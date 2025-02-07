function aplicarParalaxe(seletor, opcoes = {}) {
  const elemento = document.querySelector(seletor);
  if (!elemento) return;

  // Configurações padrão
  const {
    intensidade = 18,
    limite = 15,
    perspectiva = 1000,
    duracao = 0.37,
    escalaMinima = 0.95,
    escalaMaxima = 1.05,
    debounceInterval = 10,
  } = opcoes;

  elemento.style.transition = `transform ${duracao}s ease-out`;
  elemento.style.transformOrigin = "center center";
  elemento.style.willChange = "transform";

  let ultimoEvento = 0;

  const calcularTransformacao = (evento) => {
    const { left, top, width, height } = elemento.getBoundingClientRect();
    const deslocamentoX = ((evento.clientX - left) / width - 0.5) * intensidade;
    const deslocamentoY =
      ((evento.clientY - top) / height - 0.5) * -intensidade;

    const inclinacaoX = Math.min(Math.max(deslocamentoX, -limite), limite);
    const inclinacaoY = Math.min(Math.max(deslocamentoY, -limite), limite);

    const distanciaCentroX = Math.abs((evento.clientX - left) / width - 0.5);
    const distanciaCentroY = Math.abs((evento.clientY - top) / height - 0.5);
    const distanciaMaxima = Math.sqrt(0.5 ** 2 + 0.5 ** 2);
    const distanciaAtual = Math.sqrt(
      distanciaCentroX ** 2 + distanciaCentroY ** 2
    );

    const proporcao = distanciaAtual / distanciaMaxima;
    const escala = escalaMaxima - proporcao * (escalaMaxima - escalaMinima);

    return `translate(-50%, -50%) perspective(${perspectiva}px) rotateX(${inclinacaoY}deg) rotateY(${inclinacaoX}deg) scale(${escala})`;
  };

  const moverMouse = (evento) => {
    const tempoAtual = Date.now();
    if (tempoAtual - ultimoEvento < debounceInterval) return;

    ultimoEvento = tempoAtual;

    requestAnimationFrame(() => {
      elemento.style.transform = calcularTransformacao(evento);
    });
  };

  const sairMouse = () => {
    elemento.style.transition = `transform ${duracao}s ease-out`;
    elemento.style.transform = `translate(-50%, -50%) perspective(${perspectiva}px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  const verificarLarguraTela = () => {
    const larguraTela = window.innerWidth;
    if (larguraTela < 520) {
      elemento.removeEventListener("mousemove", moverMouse);
      elemento.removeEventListener("mouseleave", sairMouse);
    } else {
      elemento.addEventListener("mousemove", moverMouse);
      elemento.addEventListener("mouseleave", sairMouse);
    }
  };

  verificarLarguraTela();

  window.addEventListener("resize", verificarLarguraTela);

  return () => {
    elemento.removeEventListener("mousemove", moverMouse);
    elemento.removeEventListener("mouseleave", sairMouse);
    window.removeEventListener("resize", verificarLarguraTela);
  };
}

aplicarParalaxe(".square", {
  intensidade: 20,
  limite: 10,
  perspectiva: 1200,
  duracao: 0.5,
  escalaMinima: 1.05,
  escalaMaxima: 1.09,
  debounceInterval: 10,
});

aplicarParalaxe(".storage-main", {
  intensidade: 20,
  limite: 10,
  perspectiva: 1200,
  duracao: 0.5,
  escalaMinima: 1.05,
  escalaMaxima: 1.09,
  debounceInterval: 10,
});
