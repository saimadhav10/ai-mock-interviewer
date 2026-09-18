"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API interface declarations for TypeScript
interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: ISpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const isManuallyStoppedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setErrorMessage(
        "Web Speech API is not supported in this browser. You can still type your answer manually."
      );
      return;
    }

    const instance = new SpeechRecognitionClass();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = "en-US";

    instance.onresult = (event: ISpeechRecognitionEvent) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(fullTranscript.trim());
    };

    instance.onerror = (event: ISpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        return; // Normal silence, do not treat as fatal error
      }
      if (event.error === "not-allowed") {
        setErrorMessage(
          "Microphone access was denied. Please allow microphone permissions in your browser settings."
        );
      } else {
        setErrorMessage(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    instance.onend = () => {
      if (!isManuallyStoppedRef.current && isListening) {
        // Automatically restart if speech recognition ended unexpectedly while still listening
        try {
          instance.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = instance;

    return () => {
      isManuallyStoppedRef.current = true;
      try {
        instance.abort();
      } catch {
        // ignore cleanup abort
      }
    };
  }, [isListening]);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    isManuallyStoppedRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition already running or error starting:", err);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setErrorMessage(null);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
  };
}
