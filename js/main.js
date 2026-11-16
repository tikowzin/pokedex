/* =====================================================================
   main.js — script GLOBAL, usado pelas 3 páginas (Index, Galeria e Favoritos)
   [REQ 1.5] JS em arquivo separado, linkado no <head> com "defer"
   (aula: "Forma moderna de linkar o JS: usando defer").
   Aqui ficam: data do footer, favoritos no localStorage, contador do
   header e a função que monta o card (usada na Galeria e nos Favoritos).
   ===================================================================== */

/* Tipos de Pokémon: nome em português + palavras aceitas na busca.
   As cores de cada tipo ficam no CSS (classes .tipo-fire, .tipo-water...) */
const TIPOS = {
  normal:   { pt: 'Normal',    sinonimos: ['normal'] },
  fire:     { pt: 'Fogo',      sinonimos: ['fogo'] },
  water:    { pt: 'Água',      sinonimos: ['agua'] },
  grass:    { pt: 'Planta',    sinonimos: ['planta', 'grama'] },
  electric: { pt: 'Elétrico',  sinonimos: ['eletrico', 'eletrica'] },
  ice:      { pt: 'Gelo',      sinonimos: ['gelo'] },
  fighting: { pt: 'Lutador',   sinonimos: ['lutador', 'luta'] },
  poison:   { pt: 'Venenoso',  sinonimos: ['venenoso', 'veneno'] },
  ground:   { pt: 'Terrestre', sinonimos: ['terrestre', 'terra'] },
  flying:   { pt: 'Voador',    sinonimos: ['voador', 'voo'] },
  psychic:  { pt: 'Psíquico',  sinonimos: ['psiquico'] },
  bug:      { pt: 'Inseto',    sinonimos: ['inseto'] },
  rock:     { pt: 'Pedra',     sinonimos: ['pedra', 'rocha'] },
  ghost:    { pt: 'Fantasma',  sinonimos: ['fantasma'] },
  dragon:   { pt: 'Dragão',    sinonimos: ['dragao'] },
  dark:     { pt: 'Sombrio',   sinonimos: ['sombrio', 'noturno'] },
  steel:    { pt: 'Aço',       sinonimos: ['aco', 'metal'] },
  fairy:    { pt: 'Fada',      sinonimos: ['fada'] },
};

// Nome do tipo em português (se for um tipo raro, mostra o nome original)
function nomeTipo(tipo) {
  return TIPOS[tipo] ? TIPOS[tipo].pt : tipo;
}

// Tira acentos e espaços das pontas e deixa minúsculo (aula de Strings)
function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// "mr-mime" -> "Mr Mime" (split, map, toUpperCase, slice e join)
function formatarNome(nome) {
  return nome
    .split('-')
    .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

// 6.5 -> "6,5" (toFixed + replace troca o ponto pela vírgula)
function formatarNumero(valor, casas) {
  return valor.toFixed(casas).replace('.', ',');
}

// Cria um elemento com classe e texto (createElement + textContent)
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

/* =====================================================================
   [REQ 5] FAVORITOS — guardados no localStorage
   (aula de localStorage: só guarda texto, então usamos JSON.stringify
   para salvar e JSON.parse para ler, com try/catch e chave com prefixo)
   ===================================================================== */
const CHAVE_FAVORITOS = 'pokecolecao:favoritos';

// [REQ 5.3] Lê a lista salva. Se não existir ou der erro, devolve []
function lerFavoritos() {
  try {
    const bruto = localStorage.getItem(CHAVE_FAVORITOS);
    return bruto ? JSON.parse(bruto) : [];
  } catch {
    return [];
  }
}

// [REQ 5.3] Salva a lista e atualiza o contador do header
function salvarFavoritos(lista) {
  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
  } catch (erro) {
    console.error('Não foi possível salvar os favoritos:', erro);
  }
  atualizarContador();
}

function ehFavorito(id) {
  return lerFavoritos().some(pokemon => pokemon.id === id);
}

// [REQ 5.1] Adiciona um pokémon à coleção (sem repetir)
function adicionarFavorito(pokemon) {
  const lista = lerFavoritos();
  if (!lista.some(p => p.id === pokemon.id)) {
    lista.push(pokemon);
    salvarFavoritos(lista);
  }
}

// [REQ 5.4] Remove um pokémon da coleção
function removerFavorito(id) {
  const lista = lerFavoritos().filter(pokemon => pokemon.id !== id);
  salvarFavoritos(lista);
}

/* [REQ 5.2] CONTADOR no header, estilo carrinho de compras.
   Como lê do localStorage em toda página, o número persiste entre páginas. */
function atualizarContador() {
  const contador = document.getElementById('contador-favoritos');
  const total = lerFavoritos().length;
  contador.textContent = total;
  if (total === 0) {
    contador.classList.add('vazio');
  } else {
    contador.classList.remove('vazio');
  }
}

/* =====================================================================
   [REQ 4.1] CARD DO POKÉMON — uma única função monta o card da Galeria
   e o dos Favoritos ([REQ 5.3] mesmo padrão de layout nas duas páginas).
   Criado com createElement + textContent (aula de segurança: evitar
   innerHTML com dados vindos de fora, por causa de XSS).
   ===================================================================== */
// p = { id, name, hp, types, weight, height, img }   modo = 'galeria' ou 'favoritos'
function criarCard(p, modo) {
  const nome = formatarNome(p.name);

  const card = criarElemento('article', 'card');
  card.dataset.id = p.id;

  // [REQ 6.2] Imagem com width/height (reserva o espaço = sem CLS),
  // loading="lazy" (só carrega perto da tela) e decoding="async"
  const img = document.createElement('img');
  img.src = p.img;
  img.alt = 'Ilustração de ' + nome;
  img.width = 475;
  img.height = 475;
  img.loading = 'lazy';
  img.decoding = 'async';

  const titulo = criarElemento('h3', '', nome);

  const tipos = criarElemento('ul', 'card__tipos');
  p.types.forEach(tipo => {
    tipos.append(criarElemento('li', 'selo-tipo tipo-' + tipo, nomeTipo(tipo)));
  });

  const hp = criarElemento('p', '', 'HP: ' + p.hp);
  const peso = criarElemento('p', '', 'Peso: ' + formatarNumero(p.weight, 1) + ' kg');
  const altura = criarElemento('p', '', 'Altura: ' + formatarNumero(p.height, 1) + ' m');

  const botao = criarElemento('button', 'btn');
  botao.type = 'button';
  botao.dataset.id = p.id;

  if (modo === 'galeria') {
    // [REQ 5.1] botão favoritar
    botao.classList.add('btn--favoritar');
    atualizarBotaoFavoritar(botao, ehFavorito(p.id));
  } else {
    // [REQ 5.4] botão remover
    botao.classList.add('btn--remover');
    botao.textContent = 'Remover';
  }

  card.append(img, titulo, tipos, hp, peso, altura, botao);
  return card;
}

// [REQ 5.1] Troca o texto e a classe do botão favoritar
function atualizarBotaoFavoritar(botao, favoritado) {
  if (favoritado) {
    botao.textContent = 'Favoritado';
    botao.classList.add('ativo');
  } else {
    botao.textContent = 'Favoritar';
    botao.classList.remove('ativo');
  }
}

/* =====================================================================
   [REQ 1.3] DATA DINÂMICA NO FOOTER (aula de Date)
   Ex.: "terça-feira, 12 de novembro de 2026"
   weekday = dia da semana | day = dia do mês | month = mês por extenso |
   year = ano com 4 dígitos
   ===================================================================== */
function mostrarDataAtual() {
  const hoje = new Date();
  const texto = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  document.getElementById('data-atual').textContent = texto;
  document.getElementById('ano-atual').textContent = hoje.getFullYear();
}

/* Inicialização: com "defer", o HTML já foi lido quando este código roda */
mostrarDataAtual();
atualizarContador();
