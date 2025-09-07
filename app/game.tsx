import { Box } from "@/components/ui/box";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text } from "react-native";

const ROUND_TOOLTIPS = [
  "Round 1: Explain the word however you like, but don't use the word itself!",
  "Round 2: Use only one word to describe the answer!",
  "Round 3: Act out the answer (no words)!",
];
const TOTAL_ROUNDS = ROUND_TOOLTIPS.length;

export default function Game() {
  const { players, questions, timer } = useLocalSearchParams();
  const initialQuestions: string[] = questions ? JSON.parse(questions as string) : [];
  const [round, setRound] = useState(0); // 0-based
  const [deck, setDeck] = useState<string[]>([...initialQuestions]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [unguessed, setUnguessed] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [countdown, setCountdown] = useState(Number(timer) || 30);
  const [timerActive, setTimerActive] = useState(true);
  const [soundError, setSoundError] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (!timerActive || countdown <= 0) return;
    timerRef.current = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, timerActive]);

  useEffect(() => {
    if (countdown === 0 && timerActive) {
      setTimerActive(false);
      (async () => {
        try {
          // Check if sound file exists
          const soundPath = FileSystem.bundleDirectory + "assets/sounds/timesup.mp3";
          const fileInfo = await FileSystem.getInfoAsync(soundPath);
          if (!fileInfo.exists) {
            setSoundError(true);
            return;
          }
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/timesup.mp3"),
            { shouldPlay: true }
          );
        } catch (e) {
          setSoundError(true);
        }
      })();
    }
  }, [countdown, timerActive]);

  useEffect(() => {
    if (deck.length === 0 && (guessed.length + unguessed.length > 0)) {
      if (round < TOTAL_ROUNDS - 1) {
        setRound(r => r + 1);
        setDeck([...initialQuestions].sort(() => Math.random() - 0.5));
        setGuessed([]);
        setUnguessed([]);
        setCurrentIdx(0);
        setCountdown(Number(timer) || 30);
        setTimerActive(true);
      } else {
        setTimerActive(false);
      }
    }
  }, [deck, guessed, unguessed, round, timer, initialQuestions]);

  const markGuessed = () => {
    if (deck.length === 0) return;
    setGuessed(g => [...g, deck[currentIdx]]);
    nextQuestion();
  };
  const markUnguessed = () => {
    if (deck.length === 0) return;
    setUnguessed(u => [...u, deck[currentIdx]]);
    nextQuestion();
  };
  const nextQuestion = () => {
    if (deck.length === 0) return;
    if (currentIdx < deck.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setDeck([]);
    }
  };

  if (deck.length === 0 && round >= TOTAL_ROUNDS - 1) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0 dark:bg-background-900">
        <Text className="text-4xl font-extrabold text-primary-900 dark:text-primary-0 mb-4">Game Over!</Text>
        <Text className="text-lg text-primary-700 dark:text-primary-200 mb-2">All rounds complete.</Text>
        <Text className="text-base text-primary-500 dark:text-primary-400">Guessed: {guessed.length} | Unguessed: {unguessed.length}</Text>
      </Box>
    );
  }

  // Helper to restart timer for next turn
  const handleNextTurn = () => {
    setCountdown(Number(timer) || 30);
    setTimerActive(true);
  };

  return (
    <Box className="flex-1 items-center justify-center bg-background-0 dark:bg-background-900 px-4">
      <Text className="mt-4 text-center text-xs text-primary-400 dark:text-primary-500 opacity-80">
        Round {round + 1} / {TOTAL_ROUNDS}
      </Text>
      <Text className="mb-2 text-center text-xs text-primary-400 dark:text-primary-500 opacity-80">
        {ROUND_TOOLTIPS[round]}
      </Text>
      <Box className="flex-1 w-full max-w-2xl items-center justify-center">
        <Text className="text-lg text-primary-700 dark:text-primary-200 mb-2">Questions left: {deck.length - currentIdx}</Text>
        {deck.length > 0 && (
          <Box className="w-full items-center mb-6">
            <Text className="text-5xl md:text-7xl font-extrabold text-center text-primary-900 dark:text-primary-0 mb-8 break-words">
              {deck[currentIdx]}
            </Text>
            {timerActive ? (
              <Pressable
                className="w-full bg-success-600 dark:bg-success-400 rounded-xl py-3 mb-2"
                onPress={markGuessed}
              >
                <Text className="text-background-0 dark:text-background-900 text-lg font-bold text-center">Guessed!</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  className="w-full bg-error-600 dark:bg-error-400 rounded-xl py-3 mb-2"
                  onPress={markUnguessed}
                >
                  <Text className="text-background-0 dark:text-background-900 text-lg font-bold text-center">Mark as Unguessed</Text>
                </Pressable>
                {(deck.length - currentIdx) > 0 && (
                  <Pressable
                    className="w-full bg-primary-700 dark:bg-primary-300 rounded-xl py-3 mt-2"
                    onPress={handleNextTurn}
                  >
                    <Text className="text-background-0 dark:text-background-900 text-lg font-bold text-center">Start Next Turn</Text>
                  </Pressable>
                )}
              </>
            )}
          </Box>
        )}
        <Text className="text-6xl font-extrabold text-primary-900 dark:text-primary-0 mb-2">{timerActive ? countdown : "Time's up!"}</Text>
        {soundError && (
          <Text className="text-error-600 dark:text-error-400 text-center mt-2">Sound file missing or failed to play.</Text>
        )}
      </Box>
    </Box>
  );
}
