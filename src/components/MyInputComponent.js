import React, { useRef, useState } from 'react';

const MyInputComponent = () => {
  const inputRef = useRef(null); // Ref for the input element
  const [imeLanguage, setImeLanguage] = useState(''); // State for IME language

  const handleCompositionStart = (e) => {
    // Handle composition start event
    // Extract the IME language from the event object
    const lang = e.data;
    setImeLanguage(lang);
  };

  const handleInput = (e) => {
    // Handle input event
    // Extract the IME language from the input event's inputType property
    const lang = e.inputType === 'insertCompositionText' ? e.data : '';
    setImeLanguage(lang);
  };

  return (
    <div>
      {/* Input component */}
      <input
        type="text"
        ref={inputRef}
        onCompositionStart={handleCompositionStart}
        onInput={handleInput}
      />
      <p>IME Language: {imeLanguage}</p>
    </div>
  );
};

export default MyInputComponent;
