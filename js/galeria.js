/* =====================================================================
   galeria.js — script da página Galeria
   [REQ 1.5] JS separado, linkado com "defer" logo depois do main.js
   [REQ 3] Busca e dados da PokeAPI | [REQ 4] Cards | [REQ 5.1] Favoritar
   ===================================================================== */

const API = 'https://pokeapi.co/api/v2';
const POR_LOTE = 24; // quantos cards aparecem de cada vez

const form = document.getElementById('form-busca');
const campo = document.getElementById('campo-busca');
const botaoLimpar = document.getElementById('btn-limpar');
const statusGaleria = document.getElementById('status-galeria');
const grid = document.getElementById('grid-galeria');
const areaMais = document.getElementById('area-mais');
const botaoMais = document.getElementById('btn-carregar-mais');
const tabelaTipos = document.getElementById('tabela-tipos');

let todos = [];        // lista completa vinda da API: { name, url, id }
let listaAtual = [];   // todos, ou só o resultado da busca
let exibidos = 0;      // quantos itens da listaAtual já foram para a tela
let carregando = false;
let versao = 0;        // muda a cada busca, para ignorar respostas antigas
let descricao = '';    // texto usado na mensagem de status

const cache = new Map(); // url -> pokémon já baixado (aula de Map e Set)
const porId = new Map(); // id  -> pokémon (usado ao favoritar)

/* ---------------------------------------------------------------------
   Requisições (aula de fetch: async/await + try/catch + response.ok)
   --------------------------------------------------------------------- */
async function buscarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error('Erro HTTP ' + resposta.status);
  }
  return resposta.json();
}

// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
function idDaUrl(url) {
  const partes = url.split('/').filter(parte => parte !== '');
  return Number(partes[partes.length - 1]);
}

// [REQ 4.1] Pega da resposta da API só o que o card mostra
function normalizarPokemon(dados) {
  const hp = dados.stats.find(s => s.stat.name === 'hp');
  const arte = dados.sprites.other['official-artwork'];
  return {
    id: dados.id,
    name: dados.name,
    hp: hp.base_stat,
    types: dados.types.map(t => t.type.name),
    weight: dados.weight / 10, // a API manda em hectogramas -> kg
    height: dados.height / 10, // a API manda em decímetros  -> m
    img: arte.front_default || dados.sprites.front_default || 'img/pokebola.svg',
  };
}

async function obterDetalhes(item) {
  if (cache.has(item.url)) {
    return cache.get(item.url);
  }
  const dados = await buscarJSON(item.url);
  const pokemon = normalizarPokemon(dados);
  cache.set(item.url, pokemon);
  porId.set(pokemon.id, pokemon);
  return pokemon;
}

/* =====================================================================
   [REQ 3.3] LISTAGEM COMPLETA — sem filtro mostra TODOS os pokémons.
   A PokeAPI divide os resultados em páginas. Com limit=0 ela devolve só
   a página padrão (20 itens), mas informa o total em "count".
   Por isso são 2 requisições:
     1) ?limit=0       -> descobre o total (count)
     2) ?limit=count   -> recebe a lista inteira de uma vez
   ===================================================================== */
async function carregarListaCompleta() {
  const primeira = await buscarJSON(`${API}/pokemon?limit=0`);
  const total = primeira.count;
  const completa = await buscarJSON(`${API}/pokemon?limit=${total}`);
  todos = completa.results.map(p => ({ name: p.name, url: p.url, id: idDaUrl(p.url) }));
}

/* ---------------------------------------------------------------------
   Mostra o próximo lote de cards. Cada <li> entra na ordem certa com um
   spinner e é preenchido quando o fetch termina (.then/.catch/.finally)
   --------------------------------------------------------------------- */
function carregarMais() {
  if (carregando || exibidos >= listaAtual.length) {
    return;
  }

  carregando = true;
  const minhaVersao = versao;
  const lote = listaAtual.slice(exibidos, exibidos + POR_LOTE);
  exibidos = exibidos + lote.length;
  let pendentes = lote.length;
  areaMais.hidden = true;
  atualizarStatus();

  lote.forEach(item => {
    const li = criarElemento('li', 'carregando-card');
    li.append(criarElemento('div', 'spinner'));
    grid.append(li);

    obterDetalhes(item)
      .then(pokemon => {
        li.className = '';
        li.textContent = '';
        li.append(criarCard(pokemon, 'galeria'));
      })
      .catch(() => li.remove()) // se um pokémon falhar, os outros continuam
      .finally(() => {
        pendentes--;
        if (pendentes === 0 && minhaVersao === versao) {
          carregando = false;
          areaMais.hidden = exibidos >= listaAtual.length;
          verificarFimDaPagina();
        }
      });
  });
}

function atualizarStatus() {
  const total = listaAtual.length;
  if (total === 0) {
    statusGaleria.textContent = `Nenhum pokémon encontrado ${descricao}. Tente outro nome ou um tipo da tabela.`;
  } else {
    statusGaleria.textContent = `Exibindo ${exibidos} de ${total} pokémons ${descricao}.`;
  }
}

/* Rolagem infinita: o evento "scroll" (aula de listeners) verifica se a
   área do botão "Carregar mais" já está perto da parte de baixo da tela */
function verificarFimDaPagina() {
  const distancia = areaMais.getBoundingClientRect().top - window.innerHeight;
  if (distancia < 400) {
    carregarMais();
  }
}

window.addEventListener('scroll', verificarFimDaPagina);
botaoMais.addEventListener('click', carregarMais);

/* =====================================================================
   [REQ 3.1] BUSCA por TIPO (em português ou inglês) ou por NOME
   ===================================================================== */
function tipoDoTermo(termo) {
  if (TIPOS[termo]) {
    return termo; // digitou em inglês, ex.: "fire"
  }
  return Object.keys(TIPOS).find(tipo => TIPOS[tipo].sinonimos.includes(termo));
}

async function buscar(termoDigitado) {
  const termo = normalizarTexto(termoDigitado);
  versao++;
  const minhaVersao = versao;

  // limpa a galeria antes de mostrar o novo resultado
  carregando = false;
  exibidos = 0;
  grid.textContent = '';
  areaMais.hidden = true;
  statusGaleria.textContent = 'Buscando…';

  try {
    if (termo === '') {
      // sem filtro -> listagem completa
      listaAtual = todos;
      descricao = 'no total';
    } else if (tipoDoTermo(termo)) {
      // busca por TIPO -> endpoint /type/{tipo}
      const tipo = tipoDoTermo(termo);
      const dados = await buscarJSON(`${API}/type/${tipo}`);
      if (minhaVersao !== versao) {
        return; // chegou uma busca mais nova
      }
      listaAtual = dados.pokemon.map(el => ({
        name: el.pokemon.name,
        url: el.pokemon.url,
        id: idDaUrl(el.pokemon.url),
      }));
      descricao = `do tipo ${TIPOS[tipo].pt}`;
    } else {
      // busca por NOME (parte do nome) ou pelo número da Pokédex
      const nome = termo.replaceAll(' ', '-');
      listaAtual = todos.filter(p => p.name.includes(nome) || String(p.id) === termo);
      descricao = `com "${termoDigitado.trim()}" no nome`;
    }
  } catch (erro) {
    console.error(erro);
    listaAtual = [];
    descricao = `para "${termoDigitado.trim()}"`;
  }

  atualizarStatus();
  carregarMais();
}

// submit + preventDefault: busca sem recarregar a página (aula de forms)
form.addEventListener('submit', event => {
  event.preventDefault();
  buscar(campo.value);
});

botaoLimpar.addEventListener('click', () => {
  campo.value = '';
  buscar('');
});

/* [REQ 3.2] Tabela de tipos: delegação de eventos com closest + dataset.
   Clicar em um tipo preenche a barra de busca e já busca. */
tabelaTipos.addEventListener('click', event => {
  const botao = event.target.closest('[data-tipo]');
  if (!botao) {
    return;
  }
  campo.value = botao.dataset.tipo;
  buscar(botao.dataset.tipo);
});

/* =====================================================================
   [REQ 5.1] FAVORITAR — um único listener na grade (delegação)
   ===================================================================== */
grid.addEventListener('click', event => {
  const botao = event.target.closest('.btn--favoritar');
  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);
  const pokemon = porId.get(id);

  if (ehFavorito(id)) {
    removerFavorito(id);
    atualizarBotaoFavoritar(botao, false);
  } else {
    adicionarFavorito(pokemon);
    atualizarBotaoFavoritar(botao, true);
  }
});

/* ---------------------------------------------------------------------
   Início: baixa a lista completa e mostra os primeiros cards
   --------------------------------------------------------------------- */
async function iniciar() {
  statusGaleria.textContent = 'Carregando a lista de pokémons…';
  try {
    await carregarListaCompleta();
    buscar('');
  } catch (erro) {
    console.error(erro);
    statusGaleria.textContent = 'Não foi possível conectar à PokeAPI. Verifique sua internet e recarregue a página.';
  }
}

iniciar();
