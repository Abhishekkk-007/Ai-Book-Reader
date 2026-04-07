import { useRef, useCallback, useEffect } from 'react';
import { tagSegments } from '../utils/textUtils';
import { useReader } from '../context/ReaderContext';

export function useTTS() {
  const {
    ttsSpeed, setTtsActive, setTtsPaused,
    setTtsSentenceIndex, ttsActive,
  } = useReader();

  const synthRef = useRef(window.speechSynthesis);
  const utterancesRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(ttsSpeed);

  useEffect(() => { speedRef.current = ttsSpeed; }, [ttsSpeed]);

  const getVoices = useCallback(() => {
    const voices = synthRef.current.getVoices();
    const narrator = voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
      || voices.find((v) => v.lang.startsWith('en'))
      || voices[0];
    const dialogue = voices.find((v) => v.lang.startsWith('en') && v !== narrator)
      || narrator;
    return { narrator, dialogue };
  }, []);

  const speakSegments = useCallback((segments, startIndex = 0) => {
    const synth = synthRef.current;
    synth.cancel();
    currentIndexRef.current = startIndex;
    isPlayingRef.current = true;

    const speakNext = (index) => {
      if (index >= segments.length || !isPlayingRef.current) {
        setTtsActive(false);
        setTtsPaused(false);
        setTtsSentenceIndex(-1);
        return;
      }

      const { narrator, dialogue } = getVoices();
      const seg = segments[index];
      const utt = new SpeechSynthesisUtterance(seg.text);
      utt.voice = seg.type === 'dialogue' ? dialogue : narrator;
      utt.rate = speedRef.current;
      utt.pitch = seg.type === 'dialogue' ? 1.2 : 1.0;
      utt.volume = 1;

      setTtsSentenceIndex(index);
      currentIndexRef.current = index;

      utt.onend = () => {
        if (isPlayingRef.current) speakNext(index + 1);
      };
      utt.onerror = (e) => {
        if (e.error !== 'interrupted') speakNext(index + 1);
      };

      synth.speak(utt);
    };

    // Voices may not be loaded yet
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => speakNext(startIndex);
    } else {
      speakNext(startIndex);
    }
  }, [getVoices, setTtsActive, setTtsPaused, setTtsSentenceIndex]);

  const play = useCallback((text) => {
    if (!text) return;
    const segments = tagSegments(text);
    utterancesRef.current = segments;
    setTtsActive(true);
    setTtsPaused(false);
    speakSegments(segments, 0);
  }, [speakSegments, setTtsActive, setTtsPaused]);

  const pause = useCallback(() => {
    synthRef.current.pause();
    setTtsPaused(true);
    isPlayingRef.current = false;
  }, [setTtsPaused]);

  const resume = useCallback(() => {
    isPlayingRef.current = true;
    setTtsPaused(false);
    if (synthRef.current.paused) {
      synthRef.current.resume();
    } else {
      // Restart from current index
      speakSegments(utterancesRef.current, currentIndexRef.current);
    }
  }, [speakSegments, setTtsPaused]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    synthRef.current.cancel();
    setTtsActive(false);
    setTtsPaused(false);
    setTtsSentenceIndex(-1);
  }, [setTtsActive, setTtsPaused, setTtsSentenceIndex]);

  // Cleanup on unmount
  useEffect(() => () => { synthRef.current.cancel(); }, []);

  return { play, pause, resume, stop, segments: utterancesRef.current };
}