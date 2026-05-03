import { useState } from 'react';
import './ImageLoader.css';

// React.ImgHTMLAttributes<HTMLImageElement> is a list of all the valid attributes for an img element in React
// Redefines src to a required prop. Alt and className are optional. onLoad is omitted to be redefined
interface ImageLoaderProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad'> {
  src: string;
  alt?: string;
  className?: string;
  // onLoad becomes a function that takes a React.SyntheticEvent of an HTMLImageElement and returns void
  // onLoad is omitted anf redefined as the new function signature is not a subset of the original onLoad type
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * ImageLoader takes an image surce and other optional props to render an image with a placeholder skeleton, loading animation
 * and fade in effect on load
 * when this component is used by the parent it gets treated as a noraml img element accepting all the same attributes
 * the component handles the loading state of an image and then returns a loaded image as defined by the parent
 */
function ImageLoader({ src, alt, className = '', onLoad, ...imgProps }: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  // handleLoad updates the loaded state to true and if an onLoad function is passed provides the event callback to the parent
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  };

  return (
    <div className={`image-loader-wrapper ${className}`}>
      {!loaded && <div className="image-skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        // when compiled onLoad generates a native event that reacts event listener at the root intercepts
        // when the event is intercepted the event listener unpacks the native event into a synthetic event and determines
        // the origin of the event and its intended target that it then passes the synthetic event to
        // in this case the target is the handleLoad function
        onLoad={handleLoad}
        className="image-loader-img"
        style={{ opacity: loaded ? 1 : 0 }}
        // unpack any unspecified props and pass them to the img element
        {...imgProps}
      />
    </div>
  );
}

export default ImageLoader;