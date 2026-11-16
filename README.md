# Prova de Desenvolvimento Web: Site de Pokémons  
## Prazo de entrega até às 7:30 do dia de sua aula na semana que vem entre 16/11 e 20/11

Site com 3 páginas: **Index**, **Galeria** e **Favoritos**.

**Total: 10,0 pontos** em 8 famílias de requisitos.

---

## 1. Estrutura global (1,75)

- **Header (0,5):** igual nas 3 páginas, com logo em SVG, nav e link da página atual destacado dos demais durante a navegação.
- **Footer (0,5):** igual nas 3 páginas, com ao menos 3 links de redes sociais (FontAwesome) e direitos autorais.
- **Data dinâmica (0,25):** gerada por JS no footer, mostrando dia da semana, dia do mês, mês e ano com 4 dígitos. Ex.: "segunda-feira, 2 de novembro de 2026".
- **Nav estável (0,25):** sem salto dos elementos do nav entre páginas com diferença de rolagem.
- **CSS e JS separados e devidamente linkados ao html e imagens locais em subpasta apropriada (0.25).**

## 2. Página Index (1,0)

- **Hero (0,5):** imagem moderna e em alta resolução, título e subtítulo bem organizados e descritivos, e CTA que leva à galeria.
- **Segunda seção (0,5):** apresenta o que o site faz: galeria de pokémons e favoritos, onde os escolhidos são colecionados como em um carrinho de compras.

## 3. Galeria: busca e dados (1,5)

- **Barra de busca (0,5):** no início do main, com mensagem clara indicando que se busca por tipo de pokémon ou pelo nome de um pokémon específico.
- **Tabela ilustrativa com os tipos de pokemons (0.5)** para apoiar o usuário em escolher tipos na barra de busca.
- **Listagem completa (0,5):** sem filtro, mostra todos os pokémons da API, tratando o limite de itens por página retornado (limit=0).

## 4. Galeria: cards(1,0)

- **Cards (0,5):** nome, HP, tipo, peso, altura e imagem, bem estilizados e organizados. Elementos em coluna e centralizados no contra eixo.
- **Layout da galeria (0,5):** 1 coluna em mobile, 2 em tablets e 4 em desktop.

## 5. Favoritos (2,5)

- **Botão favoritar (0,5):** em cada card da galeria, adiciona o pokémon à coleção.
- **Contador no header (0,5):** ao lado do link de Favoritos, estilo contador de itens de carrinho. Atualiza ao adicionar ou remover e persiste entre páginas.
- **Lista persistente (0,5):** cards dos escolhidos salvos no localStorage entre páginas, com o mesmo padrão de layout dos cards da galeria (coluna e centralizados no contra eixo).
- **Remover favorito (0,5):** botão em cada card que remove o pokémon da coleção. Atualiza na hora a lista, o resumo e o contador do header, e persiste no localStorage.
- **Resumo estilo carrinho (0,5):** no topo da página, com a média dos pesos, a média das alturas, a média de HP e uma lista dos tipos dos escolhidos como itens.

## 6. Responsividade, performance e imagens (1,25)

- **Responsividade (0,5):** para todos os tipos de aparelhos, com abordagem mobile first e atenção aos pontos de quebra.
- **Imagens e CLS (0,75):** boas práticas de performance e responsividade tanto na hero section quanto na galeria, evitando CLS e tomando as medidas cabíveis no CSS (width/height, aspect-ratio, loading, fetchpriority, decode).

## 7. Estilo e acessibilidade (0,5)

- **Estilo (0,25):** layout bem alinhado e cores harmoniosas.
- **Acessibilidade (0,25):** aplicação de boas práticas de acessibilidade em todo o site.

## 8. Comentários no código (0,5)

- **Comentários (0,5):** cada requisito implementado está identificado por comentário no código (HTML, CSS e JS), indicando qual requisito atende.

---

## Resumo da pontuação

| # | Família | Pts |
|---|---------|-----|
| 1 | Estrutura global | 1,75 |
| 2 | Página Index | 1,0 |
| 3 | Galeria: busca e dados | 1,5 |
| 4 | Galeria: cards e grid | 1,0 |
| 5 | Favoritos | 2,5 |
| 6 | Responsividade e imagens | 1,25 |
| 7 | Estilo e acessibilidade | 0,5 |
| 8 | Comentários no código | 0,5 |
| | **Total** | **10,0** |
