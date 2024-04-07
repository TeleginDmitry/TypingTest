import "./main.css";
import { getText } from "./services/text.service";

const finishElement = document.querySelector("#finish") as HTMLDivElement;
const gameElement = document.querySelector("#game") as HTMLDivElement;
const themeElement = document.querySelector("#theme") as HTMLDivElement;

const correctElement = document.querySelector("#correct") as HTMLSpanElement;
const incorrectElement = document.querySelector(
  "#incorrect",
) as HTMLSpanElement;
const wpmElement = document.querySelector("#wpm") as HTMLSpanElement;
const restartElement = document.querySelector("#restart") as HTMLButtonElement;
const timeElement = document.querySelector("#time") as HTMLSpanElement;

const stopButton = document.querySelector("#stop") as HTMLButtonElement;

const keyboardElement = document.querySelector("#keyboard") as HTMLSpanElement;

const themeBtnElement = document.querySelector(
  "#themeBtn",
) as HTMLButtonElement;

const content = document.querySelector("#content") as HTMLDivElement;
let mistakes = 0;
let correct = 0;
let wpm = 0;

let interval: string | number | NodeJS.Timeout = null;

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

async function addTextToContent() {
  const { text, status } = await getText();

  if (status !== "success") {
    return;
  }

  content.innerHTML = "";

  const lettersArray = text.split("");

  lettersArray.forEach((letter, index) => {
    const span = document.createElement("span");

    if (index === 0) {
      span.classList.add("active");
    }

    span.classList.add("letter");

    span.style.position = "relative";

    span.textContent = letter;
    content.append(span);
  });
}

function writeLetter(e: KeyboardEvent) {
  const key = e.key;
  const code = e.code;

  const span = document.querySelector("span.active");
  const contentSpan = span?.textContent;

  stopButton.style.display = "block";
  themeBtnElement.style.display = "none";

  keyboardElement.innerText = key;

  if (!code.includes("Key")) {
    mistakes++;
  }

  if (code.includes("Key") && interval === null) {
    interval = setInterval(callbackInterval, 1000);
  }

  if (key === contentSpan) {
    correct++;

    wpm = Math.round(correct / 5 / (time / 60));

    span.classList.remove("active");
    span.classList.add("toggled");

    const nextSpan = span.nextElementSibling;

    if (nextSpan) {
      nextSpan.classList.add("active");
    } else {
      addTextToContent();
    }
  }
}

document.addEventListener("keydown", writeLetter);

addTextToContent();

// timer

const seconds = document.querySelector("#seconds") as HTMLSpanElement;
const minutes = document.querySelector("#minutes") as HTMLSpanElement;

let time = 0;
let secondsCount = 0;
let minutesCount = 0;

function getSeconds() {
  return secondsCount < 10 ? `0${secondsCount}` : `${secondsCount}`;
}

function getMinutes() {
  return minutesCount < 10 ? `0${minutesCount}` : `${minutesCount}`;
}

function callbackInterval() {
  time++;
  secondsCount = time % 60;
  minutesCount = (time - secondsCount) / 60;

  seconds.textContent = getSeconds();
  minutes.textContent = getMinutes();
}

function stopTimer() {
  clearInterval(interval);

  gameElement.style.display = "none";
  finishElement.style.display = "block";

  correctElement.textContent = correct.toString();
  incorrectElement.textContent = mistakes.toString();
  wpmElement.textContent = wpm.toString();
  timeElement.textContent = `${getMinutes()}:${getSeconds()}`;
}

stopButton.addEventListener("click", stopTimer);

// finish

restartElement.addEventListener("click", async () => {
  time = 0;
  secondsCount = 0;
  minutesCount = 0;
  mistakes = 0;
  correct = 0;
  wpm = 0;

  seconds.textContent = getSeconds();
  minutes.textContent = getMinutes();

  interval = null;

  await addTextToContent();

  stopButton.style.display = "none";

  themeBtnElement.style.display = "block";

  finishElement.style.display = "none";
  gameElement.style.display = "block";
});

// background

const examplesElement = document.querySelectorAll(
  "#examples li",
) as NodeListOf<HTMLLIElement>;

const backElement = document.querySelector("#back") as HTMLButtonElement;

examplesElement.forEach((example) => {
  example.addEventListener("click", () => {
    const id = example.id;

    localStorage.setItem("theme", id);

    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(id);
  });
});

backElement.addEventListener("click", () => {
  themeElement.style.display = "none";
  gameElement.style.display = "block";
  finishElement.style.display = "none";
});

themeBtnElement.addEventListener("click", () => {
  themeElement.style.display = "block";
  gameElement.style.display = "none";
  finishElement.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme")) {
    const theme = localStorage.getItem("theme");

    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(theme);
  }
});

// Mobile version

document.addEventListener("DOMContentLoaded", () => {
  if (isMobile) {
    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.top = "50%";
    input.style.transform = "translateY(-50%)";
    input.style.left = "0";
    input.style.width = "0";
    input.style.height = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);

    input.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;

      const span = document.querySelector("span.active");
      const contentSpan = span?.textContent;

      stopButton.style.display = "block";
      themeBtnElement.style.display = "none";

      keyboardElement.innerText = value;

      if (interval === null) {
        interval = setInterval(callbackInterval, 1000);
      }

      if (value === contentSpan) {
        correct++;

        wpm = Math.round(correct / 5 / (time / 60));

        span.classList.remove("active");
        span.classList.add("toggled");

        const nextSpan = span.nextElementSibling;

        if (nextSpan) {
          nextSpan.classList.add("active");
        } else {
          addTextToContent();
        }
      } else {
        mistakes++;
      }

      input.value = " ";
    });
  }
});

document.addEventListener("click", () => {
  if (isMobile) {
    const input = document.querySelector("input");
    input.focus();
  }
});
