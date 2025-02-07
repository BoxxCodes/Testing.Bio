document.addEventListener("DOMContentLoaded", () => {
  const text = "N o h x x - Profile";

  function animateTitle(text) {
    let index = 0;

    function loop() {
      document.title = text.slice(0, index + 1);
      index++;

      if (text[index - 1] === " ") {
        setTimeout(loop, 400);
      } else {
        setTimeout(loop, 350);
      }

      if (index >= text.length) {
        index = 0;
      }
    }

    loop();
  }

  animateTitle(text);
});

document.addEventListener("copy", (e) => {
  e.preventDefault();
});

//@media max-width 520px

function updateButtonText() {
  const buttonText = document.querySelector(".about-b-text");
  const parentElement =
    buttonText?.parentNode || document.querySelector(".about-button");

  if (window.innerWidth < 521) {
    if (buttonText && parentElement) {
      parentElement.removeChild(buttonText);
    }
  } else {
    if (!document.querySelector(".about-b-text") && parentElement) {
      const newSpan = document.createElement("span");
      newSpan.className = "about-b-text";
      newSpan.textContent = "About Us";
      parentElement.appendChild(newSpan);
    }
  }
}

window.addEventListener("load", updateButtonText);
window.addEventListener("resize", updateButtonText);

// About us
const aboutButton = document.querySelector(".about-button");
const aboutSquare = document.getElementById("about-square");
const overlay = document.getElementById("overlay");
const closeButton = document.getElementById("close-square");

aboutButton.addEventListener("click", () => {
  aboutSquare.style.display = "flex";

  const squareContent = document.querySelector(".square-content");
  squareContent.scrollTop = 0;
});

closeButton.addEventListener("click", () => {
  aboutSquare.style.display = "none";
});

overlay.addEventListener("click", () => {
  aboutSquare.style.display = "none";
});
