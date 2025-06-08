import { useEffect, useRef, useState } from "react";
import backgroundMusic from "./assets/videoplayback.mp3";
import Results from "./components/Results";
import SwipeContainer from "./components/SwipeContainer";
import useCataasAPI from "./hooks/useCataasAPI";
import "./styles/App.css";

const App = () => {
  const { currentCat, loading, error, getNextCat } = useCataasAPI();
  const [likedCats, setLikedCats] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      // Many browsers require this to be triggered by user interaction
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => {
          console.error("Audio playback failed:", err);
          // Fallback for browsers that block autoplay
          alert("Please click the music button again to start playback");
        });
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleSwipe = (action) => {
    if (action === "like") {
      setLikedCats([...likedCats, currentCat]);
    }
    getNextCat();
  };

  if (showResults) {
    return (
      <Results likedCats={likedCats} onBack={() => setShowResults(false)} />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Find My Favourite Kitty</h1>
        <div className="header-controls">
          <div className="music-controls">
            <button
              className="music-toggle"
              onClick={toggleMusic}
              aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            >
              {isMusicPlaying ? "🔊" : "🔇"}
            </button>
            {isMusicPlaying && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider"
                aria-label="Volume control"
              />
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <p className="error-message">Error loading cats. Please try again.</p>
        ) : currentCat ? (
          <SwipeContainer cat={currentCat} onSwipe={handleSwipe} />
        ) : null}
      </main>
      <div
        className={`liked-count ${likedCats.length > 0 ? "has-likes" : ""}`}
        onClick={() => likedCats.length > 0 && setShowResults(true)}
        aria-disabled={likedCats.length === 0}
        tabIndex={likedCats.length > 0 ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && likedCats.length > 0) {
            setShowResults(true);
          }
        }}
      >
        <span className="heart-icon">❤️</span>
        <span className="count-text">
          View {likedCats.length} liked{" "}
          {likedCats.length === 1 ? "cat" : "cats"}
        </span>
      </div>
    </div>
  );
};

export default App;
