# Design — Portfólio Deivid Campos

Documento de decisões visuais. Derivado das referências salvas na pasta
(`referência 1.pdf` = kott.studio, `referência 2.pdf` = kaviengcreative.com,
`referência 3.pdf` = creativeans.com), não do produto em si.

**As referências dão direção de estrutura e clima — não são para clonar.**

---

## 1. Clima

Escuro, tipográfico, caro. A página é uma galeria: o fundo é quase preto e some,
os prints dos sites são a única coisa colorida. Tipografia grande e calma,
muito espaço vazio, um único azul elétrico que aparece pouco e por isso pesa.

O que evitar, porque é o oposto do que as referências fazem:
- gradiente roxo-azul, card dentro de card, ícone em quadradinho arredondado acima de cada título
- sombra colorida, glassmorphism, brilho neon
- texto cinza sobre fundo colorido
- mais de um acento de cor competindo por atenção

## 2. Paleta

Cores medidas nas próprias referências.

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0D0D0D` | fundo base de quase tudo |
| `--bg-raise` | `#161616` | seções e blocos que sobem meio tom do fundo |
| `--bg-card` | `#1B1B1B` | cards, painel de contato, campos de formulário |
| `--bg-light` | `#EAEBE5` | seções claras (off-white levemente quente) |
| `--fg` | `#F2F3F7` | texto sobre escuro |
| `--fg-dim` | `#9A9A98` | texto secundário, metadados |
| `--fg-on-light` | `#151618` | texto sobre `--bg-light` |
| `--accent` | `#043AFE` | azul elétrico — preenchimento (seta do botão, seleção) |
| `--accent-txt` | `#4C7CFF` | o mesmo azul, clareado para **texto sobre escuro** |
| `--line` | `rgba(242,243,247,.12)` | divisórias e bordas |

Regras de cor:
- **Um acento só.** O azul aparece em: palavra de destaque no título, links,
  estado ativo de filtro, ícone do botão primário, foco. Nada mais.
- **Duas versões do mesmo azul, por contraste.** `#043AFE` sobre `#0D0D0D` dá 2,7:1
  e reprova até para texto grande. Então: `#043AFE` só em preenchimento (área de cor),
  `#4C7CFF` sempre que o azul for texto ou contorno sobre fundo escuro (5,4:1).
  Sobre a seção clara, `#043AFE` passa e é o que se usa.
- Se o azul estiver em mais de ~3 elementos na mesma tela, tirar um.
- Nunca usar o azul como fundo de bloco grande. Ele é ponto, não área.
- Os prints dos projetos trazem a cor da página. A interface não compete com eles.
- Seção clara (`--bg-light`) entra no máximo 2 vezes na home, para quebrar o ritmo —
  tipicamente "Como eu trabalho" e/ou a seção de processo.

## 3. Tipografia

Grotesca nos títulos, sans neutra no corpo. Decisão do Deivid em 15/09/2026,
substituindo a serifa editorial que vinha da Creativeans — o clima agora puxa mais
para o lado técnico da Kott do que para o lado revista.

- **Display: Space Grotesk**, peso 400 (500 em textos menores). Nunca bold pesado.
- **Tracking negativo é obrigatório no display.** Grotesca em tamanho grande abre
  demais: hero `-0.03em`, títulos de seção `-0.025em`, itens menores `-0.02em`.
  Sem isso o título parece esticado.
- **A ênfase é a cor, não o itálico.** Uma palavra por título em `--accent-txt`
  (`não só para <em>impressionar</em>`). O itálico da grotesca é fraco demais para
  carregar o destaque — o `<em>` nos títulos vira azul, não inclinado.
- **Corpo:** Inter, 16–17px, `line-height` 1.6, largura máxima de ~62 caracteres.
- **Rótulo:** Inter em caixa-alta, 11–12px, `letter-spacing` 0.12em, cor `--fg-dim`
  (ex.: `PROJETOS SELECIONADOS`, `O QUE EU FAÇO`).
- Escala de título: hero 44–76px (fluido com `clamp`), seção 36–48px, card 18–24px.
  A grotesca ocupa mais largura que a serifa — por isso a escala baixou.
- Título nunca em caixa-alta. Caixa-alta é só para rótulo.
- Uma só palavra em azul por título. Dois destaques na mesma tela já é demais.

## 4. Formas e espaçamento

- **Cantos arredondados**, seguindo a Creativeans: card `16px`, imagem `12px`,
  botão em pílula (`999px`). Consistente — não misturar reto e arredondado.
- **Botão primário:** pílula clara com texto escuro e um ícone circular de seta
  diagonal (↗) à direita. **Secundário:** pílula com borda `--line`, fundo transparente.
- Borda de 1px em `--line` no lugar de sombra. Sombra só sutil sob imagem, nunca colorida.
- Ritmo vertical: seções com `96–160px` de respiro. Grid de 12 colunas,
  largura máxima de conteúdo `1280px`, margem lateral mínima `24px`.

## 5. Estrutura da home

Ordem definida a partir das três referências:

1. **Hero** — duas colunas. À esquerda, título em grotesca com uma palavra em azul
   e, embaixo dele, o parágrafo de posicionamento com o botão primário. À direita,
   **o objeto**: três planos em 3D, empilhados, que giram devagar e inclinam seguindo
   o mouse. Sem imagem de fundo — o objeto é geometria em CSS, não foto, e some
   abaixo de 980px, onde não há espaço sem atropelar o título.
   (O parágrafo saiu da direita para abrir essa coluna. Decisão de 15/09/2026.)
2. **O que eu faço** — esteira contínua e lenta com os tipos de projeto
   (Landing page · Site institucional · Loja virtual · Sob medida), de borda a borda,
   no lugar do "AS FEATURED IN" da Creativeans. Para ao passar o mouse. Vira logos
   ou números quando houver dado real — nada de número inventado.
3. **Parede imersiva de projetos** — a vitrine. Prints dos sites dispostos numa
   parede em perspectiva, arrastável na horizontal, com filtros embaixo
   (Todos · Landing page · Institucional · Loja · Sob medida) e legenda do item
   em foco (`Nome do projeto · 2026`). É a herança direta da Kaviengs e o momento
   de maior impacto da página. **Só entra a partir de 8 projetos** — com menos que
   isso ela fica vazia e a lista sozinha funciona melhor.
4. **Lista de projetos selecionados** — abaixo da parede: nomes grandes em lista,
   metadados alinhados à direita (`LANDING PAGE · 2026`), preview do print
   aparecendo ao passar o mouse. Leitura sóbria para quem quer detalhe. Enquanto
   não houver projeto nenhum, mostra um convite para conversar no lugar da lista.
5. **Como eu trabalho** — seção clara (`--bg-light`), processo em poucos passos.
6. **Depoimento / resultado** — uma fala ou um número que comprove resultado.
   **Ainda não construída**: entra quando existir depoimento real.
7. **Contato** — card destacado com foto, convite para conversa e botão direto
   de WhatsApp. Sem formulário longo: menos atrito.
8. **Rodapé** — wordmark grande, links, e-mail, redes.

Regra geral: **o print do site do cliente é sempre o maior elemento da seção
em que aparece.** Todo projeto é mostrado em contexto real, nunca como logo solto.

## 6. Movimento

Contido e caro. Nada de bounce, nada de elástico.

- Entrada de texto por seção: `opacity` + `translateY(16px)`, `600ms`,
  `cubic-bezier(.16,1,.3,1)`, escalonado em ~60ms entre irmãos.
- **Títulos sobem linha por linha**, cada linha saindo de dentro de uma máscara,
  `700ms` com 70ms entre elas. É o movimento principal da página — o resto é discreto
  de propósito para não competir com ele.
- **Objeto do hero:** giro de ida e volta em 22s, mais inclinação de até 10° seguindo
  o mouse, com 800ms de amortecimento. Nunca gira sozinho em volta completa.
- **Esteira da faixa:** 48s por volta, velocidade constante, pausa no hover.
- Parede de projetos: arrasto com inércia curta; item em foco ganha escala leve
  (1.02) e os vizinhos perdem um pouco de brilho.
- Lista de projetos: preview surge no cursor com fade de 200ms, sem deslocar o layout.
- Hover de botão: só mudança de fundo/borda, `160ms`.
- Respeitar `prefers-reduced-motion`: sem parallax, sem arrasto automático,
  transições reduzidas a fade de 120ms.

## 7. Tom de voz

Premium e consultivo, como a Creativeans. Português do Brasil.

- Fala de resultado, não de ferramenta: "seu site pode estar bonito, mas ele está
  vendendo?" vale mais que "feito em React".
- Primeira pessoa (Deivid), frases curtas, sem jargão de agência e sem exagero
  ("o melhor", "revolucionário").
- Rótulos e metadados em caixa-alta, secos e informativos.
- Todo bloco de texto termina apontando para uma ação ou para o próximo passo.

## 8. Acessibilidade e responsivo

- Contraste mínimo 4.5:1 para texto corrido. Sobre escuro, azul é sempre
  `--accent-txt` (5,4:1); `--accent` puro só como preenchimento ou sobre a seção clara.
- Foco visível sempre: anel de 2px em `--accent-txt` com 2px de afastamento.
- A parede arrastável precisa de alternativa por teclado e de uma versão em grid
  vertical no celular (< 768px).
- Todo movimento contínuo (objeto, esteira, linhas) para em `prefers-reduced-motion`,
  sem sumir com o conteúdo.
- O que já está na tela ao abrir aparece por `setTimeout`, não só por observer:
  em aba em segundo plano o observer não dispara e o texto ficaria invisível.
- Conteúdo legível e sem rolagem horizontal a partir de 360px de largura.
- **Nada pode passar da largura da tela, nem escondido.** O Safari do iPhone e o modo
  celular do DevTools afastam o zoom da página inteira se algum elemento vazar — e um
  `overflow:hidden` comum nem sempre segura. Elemento mais largo que a tela (a esteira)
  precisa de `overflow:hidden` **e** `contain:paint`; a página tem `overflow-x:clip` no
  `html` e no `body` como rede de segurança. Texto longo sem espaço (e-mail) leva
  `overflow-wrap:anywhere`.
- No celular: corpo 17px, rótulos 12px, título do hero no mínimo 44px.

---

## Em aberto

Decisões ainda não tomadas — perguntar antes de assumir:

- Onde o site vai ser hospedado.
- Quais projetos reais entram na vitrine e se haverá página interna por projeto.
- Se o site terá versão em inglês.

## Pendências de conteúdo

Marcadas com `TODO` no HTML, esperando material do Deivid:

- foto para o cartão de contato (`assets/img/deivid.jpg`)
- links das redes no rodapé

Já preenchidos em 16/09/2026: WhatsApp `55 51 98025-9258` (com mensagem pronta
dizendo que o contato veio do portfólio) e e-mail `deividldecampos@gmail.com`,
no cartão de contato e no rodapé.
