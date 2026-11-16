<div align="center">

<img src="img/logo.svg" alt="Logo PokéColeção" width="120">

# PokéColeção

**Explore todos os Pokémon, filtre por nome ou tipo e monte a sua coleção de favoritos.**

Site em HTML, CSS e JavaScript puro, sem frameworks, que consome a [PokéAPI](https://pokeapi.co/) em tempo real.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PokéAPI](https://img.shields.io/badge/API-PokéAPI-EF5350?style=for-the-badge)

<!-- Depois de publicar no GitHub Pages, troque o link abaixo -->
[**Ver o site no ar**](https://tikowzin.github.io/pokedex/) · [Funcionalidades](#funcionalidades) · [Decisões técnicas](#decisões-técnicas) · [Como rodar](#como-rodar-localmente)

</div>

---

## Sobre o projeto

A **PokéColeção** é um site com três páginas, desenvolvido como projeto da disciplina de **Desenvolvimento Web** do curso de Engenharia de Software do **Ibmec**.

A proposta funciona como uma loja virtual: a **Galeria** é a vitrine com os mais de 1.000 Pokémon da API, o botão **Favoritar** coloca o Pokémon na coleção, e a página de **Favoritos** funciona como um carrinho de compras, com um resumo das estatísticas dos escolhidos.

Tudo foi feito com **JavaScript puro**. Eu não usei bibliotecas para reforçar os fundamentos: manipulação do DOM, `fetch` com `async/await`, `localStorage`, layout responsivo e performance de imagens.

<!--
  📸 Dica: adicione prints do site para o README ficar ainda melhor.
  1. Crie a pasta docs/screenshots
  2. Salve os prints como home.png, galeria.png e favoritos.png
  3. Apague as linhas de abertura e de fechamento deste comentário

| Início | Galeria | Favoritos |
|:---:|:---:|:---:|
| ![Página inicial](docs/screenshots/home.png) | ![Galeria](docs/screenshots/galeria.png) | ![Favoritos](docs/screenshots/favoritos.png) |
-->

---

## Funcionalidades

### 🏠 Página inicial
- Hero com imagem em alta resolução e otimizada (WebP em 3 tamanhos), título, subtítulo e CTA que leva para a galeria.
- Seção que apresenta o que o site faz.

### 🔎 Galeria
- **Listagem completa** de todos os Pokémon da PokéAPI, exibidos aos poucos (24 por vez) com botão "carregar mais".
- **Busca por nome ou por tipo**, em português ou em inglês, sem precisar de acento: `fogo`, `agua`, `dragao` e `fire` funcionam.
- **Tabela de tipos** com as cores oficiais, para ajudar o usuário a escolher o que buscar.
- **Cards** com imagem, nome, HP, tipo(s), peso e altura.
- Grid responsivo: **1 coluna** no celular, **2** no tablet e **4** no desktop.

### ⭐ Favoritos (o "carrinho")
- Botão **Favoritar/Favoritado** em cada card.
- **Contador no header**, como o de um carrinho de compras, atualizado em tempo real em todas as páginas.
- **Lista salva no `localStorage`**: a coleção continua lá ao recarregar ou fechar o navegador.
- Botão **Remover**, que atualiza na hora a lista, o resumo e o contador.
- **Resumo da coleção**: média de peso, média de altura, média de HP e os tipos presentes.

### 🌐 Em todas as páginas
- Header e footer iguais nas três páginas, com o link da página atual destacado.
- **Data dinâmica** no footer (ex.: *segunda-feira, 16 de novembro de 2026*).
- Links de redes sociais com Font Awesome.

---

## Decisões técnicas

Os pontos que mais exigiram atenção no desenvolvimento:

| Desafio | Como resolvi |
|---|---|
| **Buscar todos os Pokémon da API** | A PokéAPI é paginada. Faço uma primeira requisição para descobrir o total (`count`) e uma segunda para trazer a lista inteira de uma vez. |
| **Não travar a página** | Os detalhes de cada Pokémon são buscados sob demanda, em lotes, e guardados em cache com `Map`, assim nenhum Pokémon é baixado duas vezes. |
| **Buscas rápidas seguidas** | Cada busca recebe um número de versão. Se o usuário digita outra coisa antes da resposta chegar, o resultado antigo é descartado. |
| **Segurança (XSS)** | Os cards são criados com `createElement` e `textContent`, nunca com `innerHTML` recebendo dados externos. |
| **Layout que não "pula" (CLS)** | Todas as imagens têm `width`/`height` e `aspect-ratio` no CSS, e o espaço é reservado antes de a imagem carregar. |
| **Performance da hero (LCP)** | `<link rel="preload">`, `srcset` + `sizes` com WebP em 480, 800 e 1200 px, e `fetchpriority="high"`. Os cards usam `loading="lazy"` e `decoding="async"`. |
| **Persistência confiável** | `localStorage` com chave prefixada (`pokecolecao:favoritos`), `JSON.stringify`/`JSON.parse` e `try/catch` para não quebrar se o armazenamento falhar. |
| **Código reaproveitável** | Uma única função `criarCard()` monta o card na Galeria e nos Favoritos, garantindo o mesmo visual nas duas páginas. |
| **Acessibilidade** | HTML semântico, `aria-label` nos ícones e menus, textos alternativos nas imagens e suporte a `prefers-reduced-motion`. |
| **Responsividade** | Abordagem **mobile first**, com pontos de quebra em 601 px (tablet) e 1025 px (desktop). |

---

## Tecnologias

- **HTML5** semântico
- **CSS3**: Flexbox, Grid, variáveis CSS, media queries e `aspect-ratio`
- **JavaScript (ES6+)**: `fetch`, `async/await`, `Map`, `Array.reduce`, `localStorage` e `Intl` (datas em pt-BR)
- **[PokéAPI](https://pokeapi.co/)**: fonte dos dados
- **Font Awesome** e **Google Fonts** (Roboto)

---

## Estrutura do projeto

```
pokedex/
├── index.html        # Página inicial (hero + apresentação)
├── galeria.html      # Busca, tabela de tipos e cards
├── favoritos.html    # Coleção salva + resumo estilo carrinho
├── css/
│   └── style.css     # Estilos globais, mobile first
├── js/
│   ├── main.js       # Código compartilhado: favoritos, contador, data e criação dos cards
│   ├── galeria.js    # Consumo da PokéAPI, busca e paginação
│   └── favoritos.js  # Lista e resumo da coleção
└── img/              # Logo, ícones (SVG) e imagens da hero (WebP)
```

---

## Como rodar localmente

Não precisa instalar nada, porque o projeto não tem dependências nem etapa de build.

```bash
# 1. Clone o repositório
git clone https://github.com/tikowzin/pokedex.git

# 2. Entre na pasta
cd pokedex

# 3. Abra o index.html no navegador
#    ou use a extensão Live Server do VS Code (recomendado)
```

> A Galeria busca os dados na PokéAPI, então é preciso estar conectado à internet.

---

## O que eu aprendi

- Consumir uma API REST real e lidar com paginação, erros e respostas fora de ordem.
- Manter estado entre páginas apenas com `localStorage`.
- Medir e evitar problemas de performance que afetam a experiência do usuário (CLS e LCP).
- Organizar o JavaScript em um arquivo global e em arquivos por página, sem duplicar código.

---

## Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/tikowzin">
        <img src="https://github.com/tikowzin.png" width="100" alt="Foto de Vitor Maia"><br>
        <b>Vitor Maia</b>
      </a><br>
      Estudante de Engenharia de Software (Ibmec)
    </td>
  </tr>
</table>

[![GitHub](https://img.shields.io/badge/GitHub-tikowzin-181717?style=flat-square&logo=github)](https://github.com/tikowzin)
[![Instagram](https://img.shields.io/badge/Instagram-tikowzin-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://instagram.com/tikowzin)
[![Email](https://img.shields.io/badge/Email-tikowzincontato%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:tikowzincontato@gmail.com)

---

<sub>Pokémon e todos os nomes relacionados são marcas registradas de Nintendo, Game Freak e The Pokémon Company. Projeto feito apenas para fins de estudo, sem fins comerciais. Dados fornecidos pela <a href="https://pokeapi.co/">PokéAPI</a>.</sub>