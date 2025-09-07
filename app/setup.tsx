import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function Setup() {
  const [players, setPlayers] = useState(["", ""]);
  const [numQuestions, setNumQuestions] = useState("20");
  const [timer, setTimer] = useState("30");
  const router = useRouter();

  const handlePlayerChange = (idx: number, value: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };
  const addPlayer = () => setPlayers((prev) => [...prev, ""]);
  const removePlayer = (idx: number) =>
    setPlayers((prev) =>
      prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev
    );

  const handleStartGame = async () => {
    try {
      const questions: string[] = require("../questions.json");
      const n = Math.min(Number(numQuestions), questions.length);
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, n);
      router.push({
        pathname: "/game",
        params: {
          players: JSON.stringify(players),
          questions: JSON.stringify(picked),
          timer: timer,
        },
      });
    } catch (e) {
      Alert.alert("Error", "Could not load questions.");
    }
  };

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-900 px-4 py-8">
      <Text className="text-3xl font-extrabold text-primary-900 dark:text-primary-0 text-center mb-6">
        Game Setup
      </Text>
      <Box className="bg-background-50 dark:bg-background-800 rounded-2xl p-6 max-w-xl mx-auto w-full shadow-lg">
        <Text className="text-lg font-semibold text-primary-700 dark:text-primary-200 mb-2">
          Players
        </Text>
        {players.map((player, idx) => (
          <View key={idx} className="flex-row items-center mb-2">
            <TextInput
              className="flex-1 bg-background-0 dark:bg-background-900 border border-outline-200 dark:border-outline-700 rounded-lg px-3 py-2 text-base text-primary-900 dark:text-primary-0 mr-2"
              placeholder={`Player ${idx + 1}`}
              placeholderTextColor="#a3a3a3"
              value={player}
              onChangeText={(v) => handlePlayerChange(idx, v)}
            />
            {players.length > 2 && (
              <Pressable
                className="px-2 py-1 rounded bg-error-100 dark:bg-error-700"
                onPress={() => removePlayer(idx)}
              >
                <Text className="text-error-700 dark:text-error-100 text-lg">
                  -
                </Text>
              </Pressable>
            )}
          </View>
        ))}
        <Pressable
          className="self-start mt-1 mb-4 px-3 py-1 rounded bg-primary-100 dark:bg-primary-700"
          onPress={addPlayer}
        >
          <Text className="text-primary-700 dark:text-primary-100 font-semibold">
            + Add Player
          </Text>
        </Pressable>

        <Text className="text-lg font-semibold text-primary-700 dark:text-primary-200 mb-2 mt-4">
          Number of Questions
        </Text>
        <TextInput
          className="bg-background-0 dark:bg-background-900 border border-outline-200 dark:border-outline-700 rounded-lg px-3 py-2 text-base text-primary-900 dark:text-primary-0 mb-4"
          keyboardType="number-pad"
          value={numQuestions}
          onChangeText={setNumQuestions}
          placeholder="20"
          placeholderTextColor="#a3a3a3"
        />

        <Text className="text-lg font-semibold text-primary-700 dark:text-primary-200 mb-2">
          Timer (seconds)
        </Text>
        <TextInput
          className="bg-background-0 dark:bg-background-900 border border-outline-200 dark:border-outline-700 rounded-lg px-3 py-2 text-base text-primary-900 dark:text-primary-0 mb-6"
          keyboardType="number-pad"
          value={timer}
          onChangeText={setTimer}
          placeholder="60"
          placeholderTextColor="#a3a3a3"
        />

        <Pressable
          className="w-full bg-primary-700 dark:bg-primary-300 rounded-2xl py-4 shadow-lg active:bg-primary-800 dark:active:bg-primary-400 focus:bg-primary-800 dark:focus:bg-primary-400"
          onPress={handleStartGame}
        >
          <Text className="text-background-0 dark:text-background-900 text-lg font-bold text-center tracking-wide uppercase">
            Start Game
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
