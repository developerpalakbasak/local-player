import { getQueue, getQueueName, QueueItem } from '@/db/database';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
    currentSong: QueueItem | null;
    queueName: string;
    isPlaying: boolean;
    currentTimeSec: number;
    durationSec: number;
    progressPercent: number;
    loadQueue: (options?: { resetIndex?: boolean }) => void;
    togglePlayPause: () => void;
    playNext: () => void;
    playPrevious: () => void;
    seekTo: (seconds: number) => void;
    playAtIndex: (index: number) => void;
    cycleRepeatMode: () => void;
    repeatMode: 'off' | 'all' | 'one';
}

const AudioContext = createContext<AudioContextType | null>(null);


export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [queueName, setQueueName] = useState<string>('Queue');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

    const currentSong = queue[currentIndex] || null;

    // Maintain player instance
    const player = useAudioPlayer(currentSong?.uri ?? '');
    const status = useAudioPlayerStatus(player);
    const activeUri = useRef<string | null>(null);

    const playNext = () => {
        if (queue.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % queue.length);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    };
    const cycleRepeatMode = () => {
        setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
    };
    useEffect(() => {
        player.loop = repeatMode === 'one';
    }, [player, repeatMode]);

    // auto-advance on track end
    useEffect(() => {
        const sub = player.addListener('playbackStatusUpdate', (s) => {
            if (!s.didJustFinish || repeatMode === 'one' || queue.length === 0) return;

            if (repeatMode === 'all') {
                const nextIndex = (currentIndex + 1) % queue.length;
                if (queue[nextIndex]?.uri === activeUri.current) {
                    player.seekTo(0);          // 1-song queue: restart directly
                    player.play();
                } else {
                    setCurrentIndex(nextIndex); // existing swap effect plays it
                }
            } else {
                player.pause();                 // off → stop at end of queue
            }
        });
        return () => sub.remove();
    }, [player, repeatMode, currentIndex, queue]);


    // implementation
    const playAtIndex = (index: number) => {
        const target = queue[index];
        if (!target) return;

        // Same song & paused → just resume
        if (activeUri.current === target.uri && !status.playing) {
            player.play();
            return;
        }

        setCurrentIndex(index);
    };

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
        });
    }, []);

    const loadQueue = (options?: { resetIndex?: boolean }) => {
        const items = getQueue();
        const name = getQueueName();
        setQueue(items);
        setQueueName(name);

        if (options?.resetIndex) {
            setCurrentIndex(0);
        }
    };

    // Safely stop previous track and initialize new track
    useEffect(() => {
        if (!currentSong?.uri) return;

        // Only switch if the song URI actually changed
        if (activeUri.current !== currentSong.uri) {
            activeUri.current = currentSong.uri;

            // 1. Force stop/pause active audio playback first
            player.pause();

            // 2. Clear stream position
            player.seekTo(0);
            player.setActiveForLockScreen(true, {
                title: currentSong.filename,
                artist: queueName,
            });
            // 3. Replace source and start playback
            player.replace(currentSong.uri);
            player.play();
        }
    }, [currentSong?.uri]);

    const togglePlayPause = () => {
        if (!currentSong) return;
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };



    const seekTo = (seconds: number) => {
        player.seekTo(seconds);
    };

    const currentTimeSec = status.currentTime ?? 0;
    const durationSec = status.duration || currentSong?.duration || 1;
    const progressPercent = Math.min(
        100,
        Math.max(0, (currentTimeSec / durationSec) * 100)
    );

    return (
        <AudioContext.Provider
            value={{
                currentSong,
                queueName,
                isPlaying: status.playing,
                currentTimeSec,
                durationSec,
                progressPercent,
                loadQueue,
                togglePlayPause,
                playNext,
                playPrevious,
                seekTo,
                playAtIndex,
                cycleRepeatMode,
                repeatMode
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};