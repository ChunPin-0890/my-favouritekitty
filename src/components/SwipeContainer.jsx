import { useEffect, useRef, useState } from "react";
import "../styles/SwipeContainer.css";

const SwipeContainer = ({ cat, onSwipe }) => {
  const cardRef = useRef(null);
  const startX = useRef(0);
  const isSwiping = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetCardPosition = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.3s ease-out";
      cardRef.current.style.transform = "";
      cardRef.current.style.border = "4px solid #ddd";
      setIsAnimating(false);
    }
  };

  const handleStart = (clientX) => {
    if (isAnimating || !cardRef.current) return;

    isSwiping.current = true;
    startX.current = clientX;
    cardRef.current.style.transition = "none";
  };

  const handleMove = (clientX) => {
    if (!isSwiping.current || isAnimating || !cardRef.current) return;

    const diff = clientX - startX.current;
    const rotate = diff / (windowSize.width * 0.05);
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;

    // Visual feedback
    if (diff < -30) {
      // Swiping left (like)
      cardRef.current.style.border = "4px solid #4CAF50";
    } else if (diff > 30) {
      // Swiping right (dislike)
      cardRef.current.style.border = "4px solid #F44336";
    } else {
      cardRef.current.style.border = "4px solid #ddd";
    }
  };

  const handleEnd = (clientX) => {
    if (!isSwiping.current || isAnimating || !cardRef.current) return;
    isSwiping.current = false;

    const diff = clientX - startX.current;
    const threshold = windowSize.width * 0.25;
    cardRef.current.style.transition =
      "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), border 0.3s";
    setIsAnimating(true);

    if (Math.abs(diff) > threshold) {
      onSwipe(diff < 0 ? "like" : "dislike");
      cardRef.current.style.transform = `translateX(${
        diff < 0 ? -windowSize.width : windowSize.width
      }px) rotate(${diff / 10}deg)`;

      setTimeout(() => {
        resetCardPosition();
      }, 400);
    } else {
      resetCardPosition();
    }
  };

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleEnd(e.changedTouches[0].clientX);
  };

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp); // Handle mouse leaving window
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mouseleave", handleMouseUp);
    handleEnd(e.clientX);
  };

  return (
    <div className="swipe-container">
      <div className="swipe-instructions">
        <span className="swipe-like">❤️ Swipe left to like</span>
        <span className="swipe-dislike">Swipe right to dislike ❌</span>
      </div>
      <div className="card-holder">
        <div
          ref={cardRef}
          className="card-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <img
            src={cat.url}
            alt="Random cat"
            className="cat-image"
            onError={(e) => {
              e.target.src = "https://cataas.com/cat?width=500&height=400";
            }}
            draggable="false"
          />
        </div>
      </div>
      <div className="desktop-buttons">
        <button
          className="like-button"
          onClick={() => {
            if (!isAnimating) {
              cardRef.current.style.transition =
                "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)";
              cardRef.current.style.transform =
                "translateX(-500px) rotate(-30deg)";
              setIsAnimating(true);
              setTimeout(() => {
                onSwipe("like");
                resetCardPosition();
              }, 400);
            }
          }}
        >
          Like
        </button>
        <button
          className="dislike-button"
          onClick={() => {
            if (!isAnimating) {
              cardRef.current.style.transition =
                "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)";
              cardRef.current.style.transform =
                "translateX(500px) rotate(30deg)";
              setIsAnimating(true);
              setTimeout(() => {
                onSwipe("dislike");
                resetCardPosition();
              }, 400);
            }
          }}
        >
          Dislike
        </button>
      </div>
    </div>
  );
};

export default SwipeContainer;
