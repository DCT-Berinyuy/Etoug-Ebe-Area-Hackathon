// Celebration & Prize Giving Application
const CelebrationApp = (() => {
  'use strict';

  // Configuration
  const CONFIG = {
    QUOTE_INTERVAL: 30000, // 30 seconds
    ANIMATION_DELAY: 800,
    PULSE_DURATION: 400,
    CANVAS_FPS: 50
  };

  // DOM Elements
  const DOM = {
    animatedQuote: null,
    startButton: null,
    timerDisplay: null,
    timerHours: null,
    timerMinutes: null,
    timerSeconds: null,
    winnerDisplay: null,
    titleElement: null
  };

  // Application state
  let state = {
    currentQuoteIndex: 0,
    timerInterval: null,
    quoteInterval: null,
    demoStartTime: null,
    isTimerRunning: false
  };

  // Data
  const DATA = {
    quotes: [
      "Congratulations to all our brilliant winners! Your innovation shines bright!",
      "Celebrating the amazing talent and creativity of our hackathon participants!",
      "Honor and recognition to those who turned ideas into reality!",
      "Time to celebrate the incredible achievements and breakthrough solutions!",
      "Cheers to our winners - you've shown what innovation and dedication can achieve!",
      "A celebration of creativity, collaboration, and technological excellence!",
      "Recognizing the visionaries who've pushed the boundaries of possibility!",
      "Festive moment to acknowledge the remarkable projects and achievements!",
      "Celebrating the spirit of innovation that made this hackathon extraordinary!",
      "Victory, achievement, and celebration - well deserved to all participants!",
    ],

    winners: [
      {
        place: "🥇 1st Place",
        team: "BrainStormers",
        project: "Career Craft",
        description: "Celebrating the spirit of innovation that made this hackathon extraordinary!"
      },
      {
        place: "🥈 2nd Place",
        team: "Digital Dynamos",
        project: "Career Orientation Platform",
        description: "Honor and recognition to those who turned ideas into reality!"
      },
      {
        place: "🥉 3rd Place",
        team: "Dynamic Hackers",
        project: "Connects Mentors and Students",
        description: "Congratulations to all our brilliant winners! Your innovation shines bright!"
      }
    ]
  };

  // Quote Management
  const quoteManager = {
    displayQuote(index, immediate = false) {
      DOM.animatedQuote.classList.remove("active");
      if (immediate) {
        // Show immediately for first quote
        DOM.animatedQuote.textContent = DATA.quotes[index];
        DOM.animatedQuote.classList.add("active");
      } else {
        // Use delay for transitions between quotes
        setTimeout(() => {
          DOM.animatedQuote.textContent = DATA.quotes[index];
          DOM.animatedQuote.classList.add("active");
        }, CONFIG.ANIMATION_DELAY);
      }
    },

    rotateQuotes() {
      this.displayQuote(state.currentQuoteIndex);
      state.currentQuoteIndex = (state.currentQuoteIndex + 1) % DATA.quotes.length;
    },

    startRotation() {
      this.displayQuote(state.currentQuoteIndex, true); // Show first quote immediately
      state.quoteInterval = setInterval(() => this.rotateQuotes(), CONFIG.QUOTE_INTERVAL);
    },

    stopRotation() {
      if (state.quoteInterval) {
        clearInterval(state.quoteInterval);
        state.quoteInterval = null;
      }
    }
  };

  // Timer Management
  const timerManager = {
    updateDisplay() {
      if (!state.demoStartTime) {
        DOM.timerDisplay.classList.remove("active");
        DOM.startButton.textContent = "Start Celebration Timer!";
        state.isTimerRunning = false;
        return;
      }

      const now = new Date().getTime();
      const timeElapsed = now - state.demoStartTime;

      const hours = Math.floor(
        (timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

      // Apply pulse animation to segments that change
      this.applyPulseAnimation(DOM.timerHours, hours);
      this.applyPulseAnimation(DOM.timerMinutes, minutes);
      this.applyPulseAnimation(DOM.timerSeconds, seconds);

      DOM.timerHours.textContent = String(hours).padStart(2, "0");
      DOM.timerMinutes.textContent = String(minutes).padStart(2, "0");
      DOM.timerSeconds.textContent = String(seconds).padStart(2, "0");

      // Remove pulse class after animation
      setTimeout(() => {
        DOM.timerHours.classList.remove("pulse");
        DOM.timerMinutes.classList.remove("pulse");
        DOM.timerSeconds.classList.remove("pulse");
      }, CONFIG.PULSE_DURATION);
    },

    applyPulseAnimation(element, value) {
      const currentValue = parseInt(element.textContent);
      if (currentValue !== value) {
        element.classList.add("pulse");
      }
    },

    startTimer() {
      if (state.timerInterval) clearInterval(state.timerInterval);

      state.demoStartTime = new Date().getTime();
      localStorage.setItem("demoStartTime", state.demoStartTime);

      DOM.timerDisplay.classList.add("active");
      DOM.startButton.textContent = "Celebration In Progress!";
      DOM.startButton.disabled = true;
      state.isTimerRunning = true;

      // Add celebration active class to title
      DOM.titleElement.classList.add('celebration-active');

      // Stop quote rotation when timer starts
      quoteManager.stopRotation();
      DOM.animatedQuote.textContent = "Celebrating our amazing winners! Time is being tracked...";

      state.timerInterval = setInterval(() => this.updateDisplay(), 1000);
      this.updateDisplay(); // Call immediately to avoid 1-second delay
    },

    checkStoredTimer() {
      const storedStartTime = localStorage.getItem("demoStartTime");
      if (storedStartTime) {
        state.demoStartTime = parseInt(storedStartTime);
        this.startTimer();
        DOM.startButton.textContent = "Celebration In Progress!";
        DOM.startButton.disabled = true;
        DOM.timerDisplay.classList.add("active");

        DOM.titleElement.classList.add('celebration-active');

        quoteManager.stopRotation();
        DOM.animatedQuote.textContent = "Celebrating our amazing winners! Time is being tracked...";
      } else {
        // If no timer, ensure button is active and quote rotation is on
        DOM.startButton.disabled = false;
        DOM.startButton.textContent = "Start Celebration Timer!";
        DOM.timerDisplay.classList.remove("active");
        state.isTimerRunning = false;

        // Remove celebration active class from title
        DOM.titleElement.classList.remove('celebration-active');
      }
    }
  };

  // Winner Display
  const winnerManager = {
    displayAllWinners() {
      if (DATA.winners.length === 0) {
        DOM.winnerDisplay.innerHTML = '<div class="winner-placeholder">No winners to display</div>';
        return;
      }

      const winnersHTML = DATA.winners.map(winner => `
        <div class="winner-card">
          <div class="winner-place">${winner.place}</div>
          <div class="winner-team">Team: ${winner.team}</div>
          <div class="winner-project">Project: ${winner.project}</div>
          <div class="winner-description">${winner.description}</div>
        </div>
      `).join('');

      DOM.winnerDisplay.innerHTML = winnersHTML;
    }
  };

  // Event Handlers
  const eventHandlers = {
    handleStartButtonClick() {
      if (!DOM.startButton.disabled) {
        alert("Celebration time starts now! Honor our winners with joy and festivity!");
        timerManager.startTimer();
      }
    },

    handleQuoteMouseEnter() {
      if (!state.timerInterval) {
        quoteManager.stopRotation();
      }
    },

    handleQuoteMouseLeave() {
      if (!state.timerInterval && !state.quoteInterval) {
        quoteManager.startRotation();
      }
    }
  };

  // Background Effects
  const backgroundEffects = {
    initCanvas() {
      const canvas = document.getElementById("binaryRain");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const celebrationChars = "01★✦♥🏆🎉🎊🎁🎈🎯";
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(1);

      function drawCelebrationRain() {
        ctx.fillStyle = "rgba(20, 10, 40, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
          const char = celebrationChars.charAt(
            Math.floor(Math.random() * celebrationChars.length)
          );

          const colors = ["rgba(255, 215, 0, 0.9)", "rgba(50, 205, 50, 0.8)",
                          "rgba(147, 112, 219, 0.8)", "rgba(255, 105, 180, 0.8)",
                          "rgba(255, 165, 0, 0.8)", "rgba(0, 191, 255, 0.7)"];
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      setInterval(drawCelebrationRain, CONFIG.CANVAS_FPS);

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }
  };

  // Initialize the application
  const init = () => {
    // Initialize DOM elements
    DOM.animatedQuote = document.getElementById("animated-quote");
    DOM.startButton = document.getElementById("start-button");
    DOM.timerDisplay = document.getElementById("timer-display");
    DOM.timerHours = document.getElementById("timer-hours");
    DOM.timerMinutes = document.getElementById("timer-minutes");
    DOM.timerSeconds = document.getElementById("timer-seconds");
    DOM.winnerDisplay = document.getElementById("winner-display");
    DOM.titleElement = document.querySelector('.celebration-title');

    // Initialize functionality
    winnerManager.displayAllWinners();
    timerManager.checkStoredTimer();

    if (!state.isTimerRunning) {
      quoteManager.startRotation();
    }

    // Add event listeners
    DOM.startButton.addEventListener("click", eventHandlers.handleStartButtonClick);
    DOM.animatedQuote.addEventListener("mouseenter", eventHandlers.handleQuoteMouseEnter);
    DOM.animatedQuote.addEventListener("mouseleave", eventHandlers.handleQuoteMouseLeave);

    // Initialize background effects
    backgroundEffects.initCanvas();
  };

  // Return public methods
  return {
    init
  };
})();

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  CelebrationApp.init();
});
