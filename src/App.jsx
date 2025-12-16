import { useEffect, useRef, useState } from "react";
import { steps } from "./data/steps";
import StepScreen from "./Components/StepScreen";

// 🎵 import bg music properly (Vite-safe)
import bgMusic from "./assets/audio/bg.mp3";

const STORAGE_KEY = "treasure-step";

function App() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 0;
  });

  const [muted, setMuted] = useState(false);
  const [bgStarted, setBgStarted] = useState(false); // 🔑 KEY FIX

  const bgAudioRef = useRef(new Audio(bgMusic));

  // persist progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentStep);
  }, [currentStep]);

  // 🎵 background music logic
  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio || !bgStarted) return;

    audio.loop = true;
    audio.volume = 0.35;

    if (muted) {
      audio.pause();
      return;
    }

    audio.play().catch(() => {});

    // fade out on final screen
    if (steps[currentStep]?.type === "final") {
      const fade = setInterval(() => {
        if (audio.volume > 0.02) {
          audio.volume -= 0.02;
        } else {
          audio.pause();
          clearInterval(fade);
        }
      }, 150);
    }
  }, [currentStep, muted, bgStarted]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  // 🔁 RESET
  const resetHunt = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(0);
    setBgStarted(false); // 🔇 stop bg on reset
    bgAudioRef.current.pause();
    bgAudioRef.current.currentTime = 0;
  };

  return (
    <div style={styles.container}>
      <StepScreen
        step={steps[currentStep]}
        onNext={nextStep}
        muted={muted}
        startBg={() => setBgStarted(true)} // 👈 passed down
      />

      {/* 🔊 mute toggle */}
      <button style={styles.mute} onClick={() => setMuted((m) => !m)}>
        {muted ? "🔇" : "🔊"}
      </button>

      {/* subtle reset */}
      <button style={styles.reset} onClick={resetHunt}>
        reset
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "1rem",
    background: "linear-gradient(135deg, #f472b6, #c084fc, #fb7185)",
  },
  mute: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    fontSize: "1.2rem",
    borderRadius: "999px",
    border: "none",
    padding: "0.5rem",
    cursor: "pointer",
  },
  reset: {
    position: "fixed",
    top: "10px",
    right: "10px",
    opacity: 0.2,
    border: "none",
    background: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default App;
