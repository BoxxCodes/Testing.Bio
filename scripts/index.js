// Função para simplificar o número de visualizações
function simplificarNumero(numero) {
  if (numero >= 1000000000) {
    return (
      (Math.floor((numero / 1000000000) * 10) / 10)
        .toString()
        .replace(/\.0$/, "") + " B"
    );
  } else if (numero >= 1000000) {
    return (
      (Math.floor((numero / 1000000) * 10) / 10)
        .toString()
        .replace(/\.0$/, "") + " M"
    );
  } else if (numero >= 1000) {
    return (
      (Math.floor((numero / 1000) * 10) / 10).toString().replace(/\.0$/, "") +
      " K"
    );
  } else {
    return numero.toString();
  }
}

function obterVisualizacoes() {
  const conteudoJson = localStorage.getItem("visualizacoes");
  if (conteudoJson) {
    return JSON.parse(conteudoJson);
  }
  return { views: 0 };
}

function atualizarVisualizacoes(views) {
  const novoValor = views + 1;
  const dados = { views: novoValor };

  localStorage.setItem("visualizacoes", JSON.stringify(dados));

  return novoValor;
}

// Menu e interações de navegação
document.addEventListener("DOMContentLoaded", function () {
  const menuIconHeader = document.getElementById("menu-icon-header");
  const menu = document.getElementById("menu");
  const overlayMenu = document.getElementById("overlay-menu");
  const menuIcon = document.querySelector(".menu-icon");

  function toggleMenu() {
    const isOpen = menu.classList.contains("open");

    menu.classList.toggle("open");

    if (menu.classList.contains("open")) {
      overlayMenu.style.display = "block";
    } else {
      overlayMenu.style.display = "none";
    }
  }

  menuIconHeader.addEventListener("click", toggleMenu);
  menuIcon.addEventListener("click", toggleMenu);
  overlayMenu.addEventListener("click", () => {
    menu.classList.remove("open");
    overlayMenu.style.display = "none";
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      toggleMenu();
    }
  });
});

// overlay
document.addEventListener("DOMContentLoaded", function () {
  const blurOverlay = document.getElementById("blur-overlay");
  const playBtn = document.getElementById("play-btn");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const totalTimeDisplay = document.getElementById("total-time");
  const songName = document.getElementById("song-name");
  const artistName = document.getElementById("artist-name");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeSliderContainer = document.getElementById(
    "volume-slider-container"
  );
  const volumeSlider = document.getElementById("volume-slider");

  let isPlaying = false;
  let isSeeking = false;
  let isVolumeVisible = false;
  let isLooping = false;

  let audioContext = null;
  let audioElement = null;

  const DEFAULT_VOLUME = 0.35;

  async function updateViewsOnClick() {
    const { views } = obterVisualizacoes();
    const novoContador = atualizarVisualizacoes(views);
    const contadorFormatado = simplificarNumero(novoContador);

    document.getElementById("contador-visualizacoes").textContent =
      contadorFormatado;

    blurOverlay.style.display = "none";

    audioElement
      .play()
      .then(() => {
        audioElement.volume = volumeSlider.value / 100;
        playBtn.classList.add("playing");
        playBtn.querySelector("img#play-icon").style.display = "none";
        playBtn.querySelector("img#pause-icon").style.display = "block";
        isPlaying = true;
        isLooping = true;
        audioElement.loop = true;
        updateProgress();
      })
      .catch((error) => {
        console.log("Erro ao iniciar o autoplay:", error);
      });
  }

  blurOverlay.addEventListener("click", updateViewsOnClick);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Player Music
  function updatePlayer() {
    const song = {
      name: "Drowning (slowed + reverb)",
      artist: "Vague003",
      audioFile: "assets/audio-player/drowning.opus",
    };

    songName.textContent = song.name;
    artistName.textContent = song.artist;

    audioElement = new Audio(song.audioFile);

    const savedVolume = localStorage.getItem("audioVolume");
    const initialVolume =
      savedVolume !== null ? parseFloat(savedVolume) : DEFAULT_VOLUME;
    audioElement.volume = initialVolume;
    volumeSlider.value = initialVolume * 100;

    audioElement.onloadedmetadata = function () {
      totalTimeDisplay.textContent = formatTime(audioElement.duration);
    };

    audioElement.onended = function () {
      isPlaying = false;
      playBtn.classList.remove("playing");
      playBtn.querySelector("img#play-icon").style.display = "block";
      playBtn.querySelector("img#pause-icon").style.display = "none";
      progressBar.value = 0;
      currentTimeDisplay.textContent = formatTime(0);
    };
  }

  function togglePlay() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (isPlaying) {
      playBtn.classList.remove("playing");
      playBtn.querySelector("img#play-icon").style.display = "block";
      playBtn.querySelector("img#pause-icon").style.display = "none";
      audioElement.pause();
      isLooping = false;
      audioElement.loop = false;
    } else {
      playBtn.classList.add("playing");
      playBtn.querySelector("img#play-icon").style.display = "none";
      playBtn.querySelector("img#pause-icon").style.display = "block";
      audioElement.play();
      isLooping = true;
      audioElement.loop = true;
      updateProgress();
    }
    isPlaying = !isPlaying;
  }

  function updateProgress() {
    if (isPlaying && !isSeeking) {
      const currentTime = audioElement.currentTime;
      progressBar.value = (currentTime / audioElement.duration) * 100;
      currentTimeDisplay.textContent = formatTime(currentTime);
      progressBar.style.backgroundSize = `${progressBar.value}% 100%`;
    }
    requestAnimationFrame(updateProgress);
  }

  volumeBtn.addEventListener("click", () => {
    isVolumeVisible = !isVolumeVisible;
    if (isVolumeVisible) {
      volumeSliderContainer.classList.add("show");
    } else {
      volumeSliderContainer.classList.remove("show");
    }
  });

  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100;
    audioElement.volume = volume;
    localStorage.setItem("audioVolume", volume);
    volumeSlider.style.backgroundSize = `${volumeSlider.value}% 100%`;
  });

  window.onload = function () {
    updatePlayer();
    progressBar.value = 0;
    progressBar.style.backgroundSize = `0% 100%`;
    currentTimeDisplay.textContent = formatTime(0);
    volumeSlider.style.backgroundSize = `${volumeSlider.value}% 100%`;

    blurOverlay.style.display = "flex";

    const { views } = obterVisualizacoes();
    const contadorFormatado = simplificarNumero(views);
    document.getElementById("contador-visualizacoes").textContent =
      contadorFormatado;
  };

  playBtn.addEventListener("click", togglePlay);
});
