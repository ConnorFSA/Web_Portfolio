import type * as ProjectTypes from '../../types/project.types';
import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import ImageLoader from './ImageLoader';
import "./ImageCarousel.css";

const AUTOPLAY_DELAY = 7000; // 7 seconds
const TRANSITION_DURATION = 500; //0.5 Seconds

function ImageCarousel({ images }: { images: ProjectTypes.ProjectImage[] }) {
  // current image being displayed
  const [index, setIndex] = useState(0);
  // if we are currently animating a transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  // timeout ref/key for autoplay using setInterval
  const autoplayRef = useRef<number>(1);

  // length of image array
  const count = images.length;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));

  // generic function to go forward or backwards
  const go = useCallback((direction: 1 | -1) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // calculate the next index and wrap around while keeping the range valid
    setIndex(prevIndex => {
      const normalizedIndex = Math.min(prevIndex, Math.max(count - 1, 0));
      return (normalizedIndex + direction + count) % count;
    });
    // Schedule function to reset transition state
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, [isTransitioning, count]);

  // handlers for next and previous buttons
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  // When interval triggers moves to next slide and resets timer go > next > resetTimer
  // Timer is reset after current transition completes
  const resetTimer = useCallback(() => {
    clearInterval(autoplayRef.current);
    if (AUTOPLAY_DELAY > 0 && count > 0) {
      autoplayRef.current = setInterval(next, AUTOPLAY_DELAY);
    }
  }, [count, next]);

  // clear and resets timer/interval on index change via depencency chain go > next > resetTimer
  useEffect(() => {
    resetTimer();
    return () => clearInterval(autoplayRef.current);
  }, [count, resetTimer]);

  if (!images || images.length === 0) return null;

  return (
    <div className="carousel-root" style={{ '--transition-ms': `${TRANSITION_DURATION}ms` } as CSSProperties}>
      <div
        className="window"
        tabIndex={0}
        role="region"
        aria-label="Image carousel"
      >
        <div
          className="track"
          // when react updates the index state the css transform property is updated to shift the track left or right
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
          aria-live="polite"
        >
          {images.map((image, i) => (
            <div key={image.id} className="slide">
              <div className="image-frame">
                <ImageLoader
                  src={image.image}
                  alt={image.alt_text}
                  draggable={false}
                  className="carousel-image"
                />
              </div>
              <div className="overlay">
                <h2>{image.alt_text}</h2>
                <p>Image {i + 1} of {images.length}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="arrow-button"
          onClick={() => { prev(); resetTimer(); }}
          aria-label="Previous image"
          style={{ left: '10px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          className="arrow-button"
          onClick={() => { next(); resetTimer(); }}
          aria-label="Next image"
          style={{ right: '10px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="film-strip" role="tablist" aria-label="Slide thumbnails">
        {images.map((image, i) => (
          <button
            key={image.id}
            className="thumbnail"
            role="tab"
            // when the thumbnail is the same as current image we set aria-selected to true
            // this applies a css style to scale the thumbnail up slightly
            aria-selected={i === safeIndex}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { setIndex(i); resetTimer(); }}
            // when the thumbnail is the same as the current image we set opacity to 1 otherwise 0.6
            // css transition property eases between opacity and scale chages
            style={{ opacity: i === safeIndex ? 1 : 0.6 }}
          >
            <img className="thumb-image" src={image.image} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;