/* =========================================================
   Projetos do portfólio
   -----------------------------------------------------------
   Este é o único arquivo que muda quando entra um projeto novo.
   Nada de código de layout aqui.

   Campos de cada projeto:
     id        identificador curto, sem espaço nem acento
     nome      nome do projeto ou do cliente, como aparece na lista
     cliente   quem é o cliente (uma linha)
     tipo      "Landing page" | "Institucional" | "Loja" | "Sob medida"
     ano       ano da entrega
     url       endereço do site no ar
     desktop   caminho do print de computador (assets/img/projetos/...)
     mobile    caminho do print de celular
     resultado uma linha sobre o que o site resolveu

   Exemplo (copiar, preencher e tirar os barra-asterisco):

   {
     id: "padaria-aurora",
     nome: "Padaria Aurora",
     cliente: "Padaria Aurora, São Paulo",
     tipo: "Institucional",
     ano: 2026,
     url: "https://exemplo.com.br",
     desktop: "assets/img/projetos/padaria-aurora-desktop.jpg",
     mobile: "assets/img/projetos/padaria-aurora-mobile.jpg",
     resultado: "Encomendas passaram a entrar pelo site, não só pelo balcão."
   }
   ========================================================= */

const PROJETOS = [
  // Os projetos entram aqui, um objeto por projeto.
];

/* A parede imersiva só liga quando houver esta quantidade de projetos.
   Com menos que isso ela fica vazia demais e a lista sozinha funciona melhor. */
const MINIMO_PAREDE = 8;
