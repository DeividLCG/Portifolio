/* =========================================================
   Comportamento do portfólio
   Movimento contido, conforme specs/design.md seção 6.
   ========================================================= */

(function () {
  "use strict";

  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = () => window.matchMedia("(max-width: 768px)").matches;

  /* ---------- ano no rodapé ---------- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- cabeçalho ganha fundo depois da rolagem ---------- */
  const cabecalho = document.getElementById("cabecalho");
  const marcarCabecalho = () => cabecalho.classList.toggle("is-preso", window.scrollY > 24);
  marcarCabecalho();
  window.addEventListener("scroll", marcarCabecalho, { passive: true });

  /* ---------- entrada por rolagem, escalonada entre irmãos ---------- */
  const aparecer = () => {
    const alvos = document.querySelectorAll(".reveal");
    if (menosMovimento || !("IntersectionObserver" in window)) {
      alvos.forEach((el) => el.classList.add("is-dentro"));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          const irmaos = Array.from(e.target.parentElement.querySelectorAll(":scope > .reveal"));
          e.target.style.setProperty("--atraso", Math.max(0, irmaos.indexOf(e.target)) * 60 + "ms");
          e.target.classList.add("is-dentro");
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    alvos.forEach((el) => obs.observe(el));

    // o que já está na tela ao abrir não espera o observer
    setTimeout(() => {
      alvos.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add("is-dentro");
        }
      });
    }, 80);
  };
  aparecer();

  /* =========================================================
     Títulos revelados linha por linha
     ========================================================= */

  const ALVOS_LINHA = ".hero__titulo, .secao__titulo, .cartao__titulo";

  function dividirEmLinhas(el) {
    if (el.dataset.linhas === "sim") return;
    if (!el.dataset.original) el.dataset.original = el.innerHTML;

    // 1. cada palavra vira um span, preservando o <em> em volta.
    //    guarda quem tinha espaço antes: senão a pontuação depois do </em>
    //    ganha um espaço que não existia ("impressionar .")
    const pedacos = [];
    let espacoPendente = false;

    (function percorrer(no, envolver) {
      no.childNodes.forEach((filho) => {
        if (filho.nodeType === 3) {
          filho.textContent.split(/(\s+)/).forEach((parte) => {
            if (!parte) return;
            if (/^\s+$/.test(parte)) {
              espacoPendente = true;
              return;
            }
            const s = document.createElement("span");
            s.className = "palavra";
            s.textContent = parte;
            const topo = envolver ? envolver(s) : s;
            topo.dataset.espaco = espacoPendente && pedacos.length ? "1" : "0";
            pedacos.push(topo);
            espacoPendente = false;
          });
        } else if (filho.nodeType === 1) {
          if (filho.tagName === "BR") return;
          const tag = filho.tagName.toLowerCase();
          percorrer(filho, (s) => {
            const e = document.createElement(tag);
            e.appendChild(s);
            return e;
          });
        }
      });
    })(el, null);

    el.innerHTML = "";
    pedacos.forEach((n) => {
      if (n.dataset.espaco === "1") el.appendChild(document.createTextNode(" "));
      el.appendChild(n);
    });

    // 2. agrupa pelo topo de cada palavra — é assim que se descobre onde a linha quebrou
    const grupos = [];
    let topoAtual = null;
    el.querySelectorAll(".palavra").forEach((p) => {
      let no = p;
      while (no.parentNode !== el) no = no.parentNode;
      const topo = Math.round(p.offsetTop);
      if (topoAtual === null || Math.abs(topo - topoAtual) > 4) {
        grupos.push([]);
        topoAtual = topo;
      }
      const atual = grupos[grupos.length - 1];
      if (atual[atual.length - 1] !== no) atual.push(no);
    });

    // 3. cada linha ganha uma máscara para o texto subir de dentro dela
    el.innerHTML = "";
    grupos.forEach((grupo, i) => {
      const linha = document.createElement("span");
      linha.className = "linha";
      const interno = document.createElement("span");
      interno.className = "linha__i";
      interno.style.setProperty("--i", i);
      grupo.forEach((no, j) => {
        if (j && no.dataset.espaco === "1") interno.appendChild(document.createTextNode(" "));
        interno.appendChild(no);
      });
      linha.appendChild(interno);
      el.appendChild(linha);
    });

    el.dataset.linhas = "sim";
    // o movimento agora é das linhas: o bloco inteiro não precisa mais aparecer junto
    el.classList.remove("reveal");
    el.style.opacity = "1";
  }

  const titulos = Array.from(document.querySelectorAll(ALVOS_LINHA));

  if (!menosMovimento && "IntersectionObserver" in window) {
    titulos.forEach(dividirEmLinhas);

    const obsLinhas = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-revelada");
          obsLinhas.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    titulos.forEach((t) => obsLinhas.observe(t));

    // o que já está na tela ao abrir anima de imediato, sem depender do observer
    setTimeout(() => {
      titulos.forEach((t) => {
        if (t.getBoundingClientRect().top < window.innerHeight * 0.9) {
          t.classList.add("is-revelada");
        }
      });
    }, 80);

    // quebra de linha muda com a largura: refaz as máscaras quando a janela muda
    let larguraAnterior = window.innerWidth;
    let pendente;
    window.addEventListener("resize", () => {
      if (window.innerWidth === larguraAnterior) return;
      larguraAnterior = window.innerWidth;
      clearTimeout(pendente);
      pendente = setTimeout(() => {
        titulos.forEach((el) => {
          const jaVisto = el.classList.contains("is-revelada");
          el.innerHTML = el.dataset.original;
          el.dataset.linhas = "";
          dividirEmLinhas(el);
          if (jaVisto) el.classList.add("is-revelada");
        });
      }, 200);
    });
  }

  /* =========================================================
     Objeto do hero: inclina devagar seguindo o mouse
     ========================================================= */

  const objetoTilt = document.getElementById("objetoTilt");

  if (objetoTilt && !menosMovimento && window.matchMedia("(pointer: fine)").matches) {
    let agendado = false;
    window.addEventListener(
      "pointermove",
      (e) => {
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(() => {
          agendado = false;
          const x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          objetoTilt.style.setProperty("--tx", (x * 10).toFixed(2) + "deg");
          objetoTilt.style.setProperty("--ty", (-y * 7).toFixed(2) + "deg");
        });
      },
      { passive: true }
    );
  }

  /* =========================================================
     Faixa em esteira: repete os itens até dar a volta sem emenda
     ========================================================= */

  const marquise = document.getElementById("marquise");

  if (marquise && !menosMovimento) {
    const trilho = marquise.querySelector(".marquise__trilho");
    const base = trilho.firstElementChild;

    // repete até cobrir mais que a largura da tela
    let guarda = 0;
    while (trilho.scrollWidth < marquise.clientWidth * 1.5 && guarda++ < 10) {
      trilho.appendChild(base.cloneNode(true));
    }
    // duplica o conjunto inteiro: a animação anda 50% e volta ao mesmo ponto
    Array.from(trilho.children).forEach((n) => {
      const copia = n.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      trilho.appendChild(copia);
    });
  }

  /* ---------- foto do contato: esconde o placeholder se a imagem carregar ---------- */
  const foto = document.getElementById("fotoDeivid");
  if (foto) {
    const ok = () => foto.parentElement.classList.add("tem-foto");
    const falhou = () => foto.remove();
    if (foto.complete) (foto.naturalWidth ? ok() : falhou());
    foto.addEventListener("load", ok);
    foto.addEventListener("error", falhou);
  }

  /* =========================================================
     Lista de projetos
     ========================================================= */

  const lista = document.getElementById("listaProjetos");
  const vazio = document.getElementById("listaVazia");
  const preview = document.getElementById("preview");
  const previewImg = document.getElementById("previewImg");

  const projetos = typeof PROJETOS !== "undefined" && Array.isArray(PROJETOS) ? PROJETOS : [];

  if (!projetos.length) {
    lista.hidden = true;
    vazio.hidden = false;
  } else {
    projetos.forEach((p, i) => {
      const li = document.createElement("li");
      li.className = "lista__item";
      li.innerHTML = `
        <a class="lista__link" href="${p.url}" target="_blank" rel="noopener">
          <span class="lista__n">${String(i + 1).padStart(2, "0")}</span>
          <h3 class="lista__nome">${p.nome}</h3>
          <span class="lista__meta">${p.tipo} · ${p.ano}</span>
        </a>`;

      const link = li.querySelector(".lista__link");
      link.addEventListener("pointerenter", () => mostrarPreview(p));
      link.addEventListener("focus", () => mostrarPreview(p));
      link.addEventListener("pointerleave", esconderPreview);
      link.addEventListener("blur", esconderPreview);

      lista.appendChild(li);
    });
  }

  function mostrarPreview(p) {
    if (celular() || menosMovimento || !p.desktop) return;
    previewImg.src = p.desktop;
    previewImg.alt = "Print do site " + p.nome;
    preview.classList.add("is-visivel");
    lista.classList.add("is-ativa");
  }

  function esconderPreview() {
    preview.classList.remove("is-visivel");
    lista.classList.remove("is-ativa");
  }

  // o preview acompanha o cursor sem deslocar o layout
  document.addEventListener(
    "pointermove",
    (e) => {
      if (!preview.classList.contains("is-visivel")) return;
      preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  /* =========================================================
     Parede imersiva — só liga a partir de MINIMO_PAREDE projetos
     ========================================================= */

  const parede = document.getElementById("parede");
  const palco = document.getElementById("paredePalco");
  const trilho = document.getElementById("paredeTrilho");
  const legenda = document.getElementById("paredeLegenda");
  const filtros = document.getElementById("filtros");

  const limiteParede = typeof MINIMO_PAREDE === "number" ? MINIMO_PAREDE : 8;

  if (projetos.length >= limiteParede) {
    parede.hidden = false;
    montarParede(projetos);
  }

  function montarParede(itens) {
    let visiveis = itens;
    let x = 0;
    let velocidade = 0;
    let arrastando = false;
    let ultimoX = 0;

    const tipos = ["Todos"].concat([...new Set(itens.map((p) => p.tipo))]);
    tipos.forEach((t, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.role = "tab";
      b.textContent = t;
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        filtros.querySelectorAll("button").forEach((o) => o.setAttribute("aria-selected", "false"));
        b.setAttribute("aria-selected", "true");
        visiveis = t === "Todos" ? itens : itens.filter((p) => p.tipo === t);
        desenhar(visiveis);
        x = 0;
        aplicar();
      });
      filtros.appendChild(b);
    });

    desenhar(visiveis);

    function desenhar(lote) {
      trilho.innerHTML = "";
      lote.forEach((p) => {
        const a = document.createElement("a");
        a.className = "parede__item";
        a.href = p.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.dataset.nome = p.nome;
        a.dataset.ano = p.ano;
        a.innerHTML = `<img src="${p.desktop}" alt="Print do site ${p.nome}" loading="lazy">`;
        trilho.appendChild(a);
      });
      aplicar();
    }

    // curva a parede e destaca o item mais próximo do centro
    function aplicar() {
      if (celular()) {
        trilho.style.transform = "";
        return;
      }
      const limite = trilho.scrollWidth - palco.clientWidth + 48;
      x = Math.min(0, Math.max(-Math.max(limite, 0), x));
      trilho.style.transform = `translate3d(${x}px,0,0)`;

      const centro = palco.clientWidth / 2;
      const palcoR = palco.getBoundingClientRect();
      let foco = null;
      let menorDist = Infinity;

      const medidos = Array.from(trilho.querySelectorAll(".parede__item")).map((item) => {
        const r = item.getBoundingClientRect();
        const d = r.left - palcoR.left + r.width / 2 - centro;
        if (Math.abs(d) < menorDist) {
          menorDist = Math.abs(d);
          foco = item;
        }
        return { item, d };
      });

      medidos.forEach(({ item, d }) => {
        const emFoco = item === foco;
        item.classList.toggle("is-foco", emFoco);
        if (menosMovimento) {
          item.style.transform = "";
          return;
        }
        const giro = Math.max(-18, Math.min(18, (d / centro) * -18));
        item.style.transform = `rotateY(${giro}deg)` + (emFoco ? " scale(1.02)" : "");
      });

      if (foco) legenda.textContent = `${foco.dataset.nome} · ${foco.dataset.ano}`;
    }

    /* arrasto com inércia curta */
    palco.addEventListener("pointerdown", (e) => {
      if (celular()) return;
      arrastando = true;
      ultimoX = e.clientX;
      velocidade = 0;
      palco.classList.add("is-arrastando");
      palco.setPointerCapture(e.pointerId);
    });

    palco.addEventListener("pointermove", (e) => {
      if (!arrastando) return;
      const d = e.clientX - ultimoX;
      ultimoX = e.clientX;
      velocidade = d;
      x += d;
      aplicar();
    });

    const soltar = () => {
      if (!arrastando) return;
      arrastando = false;
      palco.classList.remove("is-arrastando");
      if (!menosMovimento) deslizar();
    };
    palco.addEventListener("pointerup", soltar);
    palco.addEventListener("pointercancel", soltar);

    function deslizar() {
      velocidade *= 0.9;
      if (Math.abs(velocidade) < 0.4) return;
      x += velocidade;
      aplicar();
      requestAnimationFrame(deslizar);
    }

    /* alternativa por teclado */
    palco.addEventListener("keydown", (e) => {
      const passo = 320;
      if (e.key === "ArrowRight") { x -= passo; aplicar(); e.preventDefault(); }
      if (e.key === "ArrowLeft") { x += passo; aplicar(); e.preventDefault(); }
    });

    window.addEventListener("resize", aplicar);
  }
})();
