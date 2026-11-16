/* =====================================================================
   favoritos.js — script da página Favoritos
   [REQ 1.5] JS separado, linkado com "defer" logo depois do main.js
   [REQ 5] Lista salva, remover favorito e resumo estilo carrinho
   ===================================================================== */

const lista = document.getElementById('lista-favoritos');
const avisoVazio = document.getElementById('favoritos-vazio');
const resumoDados = document.getElementById('resumo-dados');
const resumoTipos = document.getElementById('resumo-tipos');

// média de um campo (peso, altura ou hp) usando reduce (aula de arrays)
function media(pokemons, campo) {
  if (pokemons.length === 0) {
    return 0;
  }
  const soma = pokemons.reduce((total, p) => total + p[campo], 0);
  return soma / pokemons.length;
}

/* =====================================================================
   [REQ 5.5] RESUMO ESTILO CARRINHO (topo da página)
   Média dos pesos, média das alturas, média de HP e lista dos tipos.
   ===================================================================== */
function criarLinhaResumo(rotulo, valor) {
  const linha = criarElemento('div', 'resumo__linha');
  linha.append(criarElemento('dt', '', rotulo), criarElemento('dd', '', valor));
  return linha;
}

function renderizarResumo(favoritos) {
  const vazio = favoritos.length === 0;

  resumoDados.textContent = '';
  resumoDados.append(
    criarLinhaResumo('Pokémons', favoritos.length),
    criarLinhaResumo('Média de peso', vazio ? '—' : formatarNumero(media(favoritos, 'weight'), 1) + ' kg'),
    criarLinhaResumo('Média de altura', vazio ? '—' : formatarNumero(media(favoritos, 'height'), 2) + ' m'),
    criarLinhaResumo('Média de HP', vazio ? '—' : formatarNumero(media(favoritos, 'hp'), 1))
  );

  // conta quantas vezes cada tipo aparece (Map + ??, como na aula de Map e Set)
  const contagem = new Map();
  favoritos.forEach(p => {
    p.types.forEach(tipo => {
      contagem.set(tipo, (contagem.get(tipo) ?? 0) + 1);
    });
  });

  // cada tipo vira um "item" da lista, como num carrinho
  resumoTipos.textContent = '';
  if (contagem.size === 0) {
    resumoTipos.append(criarElemento('li', 'resumo__tipo', 'Nenhum tipo ainda'));
  }
  for (const [tipo, quantidade] of contagem) {
    const li = criarElemento('li', 'resumo__tipo');
    li.append(
      criarElemento('span', 'selo-tipo tipo-' + tipo, nomeTipo(tipo)),
      criarElemento('span', 'resumo__qtd', 'x ' + quantidade)
    );
    resumoTipos.append(li);
  }
}

/* =====================================================================
   [REQ 5.3] LISTA SALVA NO localStorage — os cards usam a mesma função
   criarCard() da galeria (mesmo layout: coluna e centralizado)
   ===================================================================== */
function renderizar() {
  const favoritos = lerFavoritos();

  lista.textContent = '';
  favoritos.forEach(pokemon => {
    const li = document.createElement('li');
    li.append(criarCard(pokemon, 'favoritos'));
    lista.append(li);
  });

  avisoVazio.hidden = favoritos.length > 0;
  renderizarResumo(favoritos);
}

/* =====================================================================
   [REQ 5.4] REMOVER FAVORITO — atualiza na hora a lista, o resumo e o
   contador do header (salvarFavoritos chama atualizarContador)
   ===================================================================== */
lista.addEventListener('click', event => {
  const botao = event.target.closest('.btn--remover');
  if (!botao) {
    return;
  }
  removerFavorito(Number(botao.dataset.id));
  renderizar();
});

renderizar();
