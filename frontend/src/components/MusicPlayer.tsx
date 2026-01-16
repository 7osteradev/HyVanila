import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Import all music tracks
import menu01 from '../assets/menu_01.ogg';
import menu02 from '../assets/menu_02.ogg';
import menu03 from '../assets/menu_03.ogg';
import menu04 from '../assets/menu_04.ogg';
import menu05 from '../assets/menu_05.ogg';
import menu06 from '../assets/menu_06.ogg';
import menu07 from '../assets/menu_07.ogg';
import menu08 from '../assets/menu_08.ogg';
import menu09 from '../assets/menu_09.ogg';
import menu10 from '../assets/menu_10.ogg';

const musicTracks = [
  menu01, menu02, menu03, menu04, menu05,
  menu06, menu07, menu08, menu09, menu10
];

interface MusicPlayerProps {
  className?: string;
  forceMuted?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = '', forceMuted = false }) => {
  // Load saved mute preference from localStorage
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('hyprism-music-muted');
    return saved === 'true';
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const targetVolumeRef = useRef(0.3);

  // Save mute preference when it changes
  useEffect(() => {
    localStorage.setItem('hyprism-music-muted', String(isMuted));
  }, [isMuted]);

  // Handle forceMuted prop with smooth fade
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (forceMuted && !isFading) {
      // Fade out and pause over 1 second
      setIsFading(true);
      const startVolume = audioRef.current.volume;
      const steps = 20;
      const stepTime = 1000 / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, startVolume - (volumeStep * currentStep));
        }
        if (currentStep >= steps) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause(); // Pause instead of just muting
            audioRef.current.currentTime = 0; // Reset to beginning
          }
          setIsFading(false);
        }
      }, stepTime);
    } else if (!forceMuted && audioRef.current.paused) {
      // Fade in and resume playing over 1 second
      setIsFading(true);
      const targetVolume = targetVolumeRef.current;
      audioRef.current.volume = 0;
      
      // Resume playback
      audioRef.current.play().catch(err => {
        console.log('Failed to resume audio:', err);
        setIsFading(false);
        return;
      });
      
      const steps = 20;
      const stepTime = 1000 / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (audioRef.current) {
          audioRef.current.volume = Math.min(targetVolume, volumeStep * currentStep);
        }
        if (currentStep >= steps) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          setIsFading(false);
        }
      }, stepTime);
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [forceMuted]);

  useEffect(() => {
    // Select a random track on mount
    const randomIndex = Math.floor(Math.random() * musicTracks.length);
    setCurrentTrack(randomIndex);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.3; // 30% volume
    
    // Auto-play when loaded
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        // Auto-play was prevented, user needs to interact first
        console.log('Auto-play blocked, waiting for user interaction');
        
        const handleUserInteraction = async () => {
          try {
            await audio.play();
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
          } catch (e) {
            // Still blocked
          }
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
      }
    };

    playAudio();

    // Handle track ending - play next random track
    const handleEnded = () => {
      const nextIndex = Math.floor(Math.random() * musicTracks.length);
      setCurrentTrack(nextIndex);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLoaded, currentTrack]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      // Ensure audio continues playing when unmuting
      if (!newMutedState && audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          console.log('Auto-play prevented after unmute');
        });
      }
    }
  };

  return (
    <>
      {isLoaded && (
        <audio
          ref={audioRef}
          src={musicTracks[currentTrack]}
          loop={false}
          preload="auto"
        />
      )}
      <button
        onClick={toggleMute}
        disabled={forceMuted}
        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${forceMuted ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        title={forceMuted ? 'Music muted while game is running' : isMuted ? 'Unmute' : 'Mute'}
      >
        {forceMuted ? (
          <VolumeX size={20} className="text-gray-500" />
        ) : isMuted ? (
          <VolumeX size={20} className="text-gray-400" />
        ) : (
          <Volume2 size={20} className="text-[#FFA845]" />
        )}
      </button>
    </>
  );
};
