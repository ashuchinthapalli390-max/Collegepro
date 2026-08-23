import React, { useRef, useState, useEffect } from 'react';
import OtpDigitBox from './OtpDigitBox.jsx';

export default function OtpInput({
  value = '',
  onChange,
  onComplete,
  isDisabled = false,
  autoFocus = true
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && !isDisabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, isDisabled]);

  const handleDigitChange = (index, char) => {
    const cleanDigit = char.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const combined = newDigits.join('');
    onChange(combined);

    if (cleanDigit && index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    if (cleanDigit && index === 5 && combined.length === 6) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      onChange(pasted);
      if (pasted.length === 6) {
        inputRefs.current[5]?.focus();
        setFocusedIndex(5);
        onComplete(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
        setFocusedIndex(pasted.length);
      }
    }
  };

  return (
    <div
      onPaste={handlePaste}
      style={{
        display: 'flex',
        gap: '0.65rem',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1.6rem 0'
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <OtpDigitBox
          key={index}
          index={index}
          digit={digits[index]}
          isFocused={focusedIndex === index && !isDisabled}
          isDisabled={isDisabled}
          inputRef={(el) => (inputRefs.current[index] = el)}
          onChange={handleDigitChange}
          onKeyDown={handleKeyDown}
          onFocus={(idx) => setFocusedIndex(idx)}
        />
      ))}
    </div>
  );
}
