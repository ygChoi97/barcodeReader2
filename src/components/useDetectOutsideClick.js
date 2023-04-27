import { useState, useEffect } from "react";

/**
 * Hook for handling closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export const useDetectOutsideClick = (el, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = e => {
        console.log(e.target)
      // If the active element exists and is clicked outside of
      if (el.current !== null && isActive && !el.current.contains(e.target)) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isActive) {
      window.addEventListener("mousedown", onClick);
    }    
    
    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, [isActive, el]);
  
  return [isActive, setIsActive];
};
