const consoleBox = document.getElementById("console");
const mode = document.getElementById("mode");
const startBtn = document.getElementById("startBtn");

let recognition;
let listening = false;

/* LOG */
function log(text){
  consoleBox.innerHTML += text + "<br>";
  consoleBox.scrollTop = 9999;
}

function speak(text){
  if (recognition) recognition.stop(); // 🔥 STOP listening

  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.9;
  msg.pitch = 0.8;
  msg.volume = 1;

  msg.onend = () => {
    setTimeout(() => {
      recognition.start(); // 🔥 RESUME listening
    }, 500);
  };

  speechSynthesis.speak(msg);
  log("JARVIS: " + text);
}

/* START JARVIS */
function startJarvis(){
  startBtn.style.display = "none";

  speak("System online. Awaiting your command.");

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();

  recognition.lang = "en-US";
 recognition.continuous = false; // IMPORTANT
recognition.interimResults = true;

  recognition.onstart = () => {
    listening = true;
    log("🎤 Listening...");
  };

  recognition.onend = () => {
    listening = false;
    log("🔁 Restarting listening...");
    recognition.start(); // 🔥 THIS IS THE KEY FIX
  };

  recognition.onerror = e => {
    log("⚠️ Error: " + e.error);
  };

  recognition.onresult = e => {
    const res = e.results[e.results.length - 1];
    if (!res.isFinal) return;

    const text = res[0].transcript.toLowerCase().trim();
    log("YOU: " + text);

    if (text.includes("hi") || text.includes("hello")) {
      speak("Hello. How can I assist you?");
    }

    if (text.includes("who are you")) {
      speak("I am Jarvis. Your personal artificial intelligence.");
    }

    if (text.includes("status")) {
      speak("All systems are functioning normally.");
    }

    if (text.includes("combat")) {
      document.body.style.color = "#ff0033";
      mode.textContent = "COMBAT MODE";
      speak("Combat mode activated.");
    }

    if (text.includes("analysis")) {
      document.body.style.color = "#ffb000";
      mode.textContent = "ANALYSIS MODE";
      speak("Analysis mode engaged.");
    }
  };

  recognition.start();
}

startBtn.onclick = startJarvis;
