const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence is famous because it contains all the letters of the English alphabet. Typing it quickly and accurately is a good test of skill.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. It involves tasks such as analysis, generating algorithms, profiling accuracy and resource consumption.",
    "JavaScript is a versatile scripting language used for web development. It allows developers to create dynamic content, control multimedia, animate images, and much more on websites.",
    "Learning to type faster can significantly increase your productivity. Whether you are writing emails, coding, or drafting documents, speed and accuracy are valuable skills in the digital age.",
    "The history of computing is fascinating, starting from mechanical calculators to the powerful microprocessors we use today. Innovations continue to shape how we interact with technology.",
    "Artificial intelligence is a branch of computer science that aims to create machines capable of intelligent behavior. Machine learning is a subset of AI that allows systems to learn from data.",
    "Open source software promotes collaboration and transparency. Developers from around the world can contribute to projects, improving code quality and adding new features for everyone to use.",
    "Cloud computing provides on-demand access to computing resources like servers, storage, and applications over the internet. It offers scalability, flexibility, and often cost savings.",
    "Cybersecurity is crucial in protecting computer systems and networks from theft or damage to their hardware, software, or electronic data, as well as from disruption of services.",
    "Data structures and algorithms are fundamental concepts in computer science. Understanding them helps in writing efficient and optimized code for solving complex problems effectively."
  ];
  
  const typingText = document.querySelector(".typing-text p");
  const inputField = document.querySelector(".game-wrapper .input-field");
  const timeDisplay = document.querySelector(".time span b");
  const mistakeDisplay = document.querySelector(".mistake span");
  const wpmDisplay = document.querySelector(".wpm span");
  const cpmDisplay = document.querySelector(".cpm span");
  const tryAgainBtn = document.querySelector(".try-again-button");
  
  let timer;
  let maxTime = 60;
  let timeLeft = maxTime;
  let charIndex = 0;
  let mistakes = 0;
  let isTyping = false;
  let characters;
  
  function loadParagraph() {
      const ranIndex = Math.floor(Math.random() * paragraphs.length);
      typingText.innerHTML = "";
      paragraphs[ranIndex].split("").forEach(char => {
          let span = `<span>${char}</span>`;
          typingText.innerHTML += span;
      });
      characters = typingText.querySelectorAll("span");
      if (characters.length > 0) {
          characters[0].classList.add("active");
      }
      document.addEventListener("keydown", () => inputField.focus());
      typingText.addEventListener("click", () => inputField.focus());
  }
  
  function resetGame() {
      loadParagraph();
      clearInterval(timer);
      timeLeft = maxTime;
      charIndex = 0;
      mistakes = 0;
      isTyping = false;
      timeDisplay.innerText = `${timeLeft}s`;
      mistakeDisplay.innerText = mistakes;
      wpmDisplay.innerText = 0;
      cpmDisplay.innerText = 0;
      inputField.value = "";
      characters.forEach(span => span.classList.remove("correct", "incorrect", "active"));
      if (characters.length > 0) {
          characters[0].classList.add("active");
      }
  }
  
  function initTyping(event) {
      const typedChar = inputField.value.slice(-1);
      inputField.value = '';
  
      if (charIndex >= characters.length || timeLeft <= 0) {
          if(timeLeft > 0) clearInterval(timer);
          isTyping = false;
          return;
      }
  
      if (!isTyping) {
          timer = setInterval(() => {
              if (timeLeft > 0) {
                  timeLeft--;
                  timeDisplay.innerText = `${timeLeft}s`;
                  let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60) * 1);
                   wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                   wpmDisplay.innerText = wpm;
              } else {
                  clearInterval(timer);
                  isTyping = false;
              }
          }, 1000);
          isTyping = true;
      }
  
      let expectedChar = characters[charIndex].innerText;
  
       if (event.inputType === "deleteContentBackward") {
           if (charIndex > 0) {
              charIndex--;
              characters[charIndex].classList.remove("correct", "incorrect");
              if (charIndex < characters.length -1){
                   characters[charIndex + 1].classList.remove("active");
              }
               characters[charIndex].classList.add("active");
          }
          return;
      }
  
      if (typedChar === expectedChar) {
          characters[charIndex].classList.add("correct");
          characters[charIndex].classList.remove("incorrect");
      } else {
          mistakes++;
          characters[charIndex].classList.add("incorrect");
          characters[charIndex].classList.remove("correct");
      }
  
      mistakeDisplay.innerText = mistakes;
  
       let cpm = Math.round((charIndex - mistakes) / ((maxTime - timeLeft) / 60) * 1);
       cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
       cpmDisplay.innerText = cpm;
  
  
      characters[charIndex].classList.remove("active");
      charIndex++;
  
      if (charIndex < characters.length) {
          characters[charIndex].classList.add("active");
      } else {
          clearInterval(timer);
          isTyping = false;
      }
  }
  
  loadParagraph();
  inputField.addEventListener("input", initTyping);
  tryAgainBtn.addEventListener("click", resetGame);