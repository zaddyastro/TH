import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// 🔊 audio imports (Vite-safe)
import clickSound from "../assets/audio/click.mp3";
import welcomeSound from "../assets/audio/welcome.mp3";
import finalSound from "../assets/audio/final.mp3";
import checkpointSound from "../assets/audio/checkpoint.mp3";
import wrongSound from "../assets/audio/wrong.mp3";

const StepScreen = ({ step, onNext, muted, startBg }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);

  // audio refs
  const click = useRef(new Audio(clickSound));
  const welcome = useRef(new Audio(welcomeSound));
  const final = useRef(new Audio(finalSound));
  const checkpoint = useRef(new Audio(checkpointSound));
  const wrong = useRef(new Audio(wrongSound));

  const play = (audioRef, { loop = false } = {}) => {
    if (muted) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.loop = loop;
    audioRef.current.play().catch(() => {});
  };

  const stop = (audioRef) => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // ❤️ floating hearts
  const spawnHearts = () => {
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.innerText = "💖";
      heart.style.left = Math.random() * 100 + "vw";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 6000);
    }
  };

  // 🎵 handle looping music per screen
  useEffect(() => {
    // stop looping sounds when screen changes
    stop(welcome);
    stop(final);

    if (step.type === "welcome") {
      play(welcome, { loop: true }); // 🔁 LOOP welcome
    }

    if (step.type === "final") {
      play(final, { loop: true }); // 🔁 LOOP final
    }

    if (step.type === "checkpoint") {
      confetti({ particleCount: 140, spread: 80 });
      spawnHearts();
      play(checkpoint); // one-shot
    }
  }, [step, muted]);

  useEffect(() => {
    setInput("");
    setError("");
    setShowHint(false);
  }, [step]);

  // -------- SCREENS --------

  if (step.type === "welcome") {
    return (
      <div style={styles.card}>
        <h1 style={styles.title}>{step.text}</h1>
        <button
          style={styles.btn}
          onClick={() => {
            play(click);
            stop(welcome);   // ⛔ stop welcome loop
            startBg();       // 🎵 start bg music
            onNext();
          }}
        >
          Start 💖
        </button>
      </div>
    );
  }

  if (step.type === "checkpoint") {
    return (
      <div style={styles.card}>
        <h2 style={styles.text}>{step.text}</h2>
        <button
          style={styles.btn}
          onClick={() => {
            play(click);
            onNext();
          }}
        >
          Continue ✨
        </button>
      </div>
    );
  }

  if (step.type === "final") {
    return (
      <div style={styles.card}>
        <h1 style={styles.text}>{step.text}</h1>
      </div>
    );
  }

  // -------- CLUE --------

  const handleSubmit = () => {
    play(click);

    if (input.trim().toUpperCase() === step.answer) {
      onNext();
    } else {
      play(wrong);
      setError("Not quite 💭 Try again.");
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.text}>{step.text}</h2>

      <input
        style={styles.input}
        value={input}
        placeholder="Enter password"
        onChange={(e) => setInput(e.target.value)}
      />

      <button style={styles.btn} onClick={handleSubmit}>
        Unlock 🔓
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {step.hint && (
        <>
          <button
            style={styles.hint}
            onClick={() => setShowHint(!showHint)}
          >
            Need a hint?
          </button>
          {showHint && (
            <p style={{ fontStyle: "italic", color: "#6b21a8" }}>
              {step.hint}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  card: {
    maxWidth: "420px",
    padding: "2.5rem",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    textAlign: "center",
    fontFamily: "Georgia, serif",
  },
  title: {
    color: "#9d174d",
    fontSize: "1.6rem",
  },
  text: {
    whiteSpace: "pre-line",
    color: "#7c2d92",
    fontSize: "1.3rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    margin: "1rem 0",
    borderRadius: "12px",
    border: "2px solid #f9a8d4",
  },
  btn: {
    padding: "0.75rem 1.5rem",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #ec4899, #a855f7)",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "#be123c",
    marginTop: "0.5rem",
  },
  hint: {
    marginTop: "1rem",
    background: "none",
    border: "none",
    color: "#7c3aed",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default StepScreen;
