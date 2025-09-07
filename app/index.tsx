import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <Box >
      <Box className="w-full max-w-xs items-center">
        <Text className="text-5xl font-extrabold text-primary-900 tracking-tight mb-2 text-center drop-shadow-md">
          Out of Time
        </Text>
        <Text className="text-lg text-primary-500 mb-8 text-center font-medium">
          The party game for quick thinkers!
        </Text>
        <Pressable
          className="w-full bg-primary-700 rounded-2xl py-4 shadow-lg active:bg-primary-800 focus:bg-primary-800"
          android_ripple={{ color: '#6b7280' }}
          onPress={() => router.push("/setup")}
        >
          <Text className="text-background-0 text-lg font-bold text-center tracking-wide uppercase">
            Start Game
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
