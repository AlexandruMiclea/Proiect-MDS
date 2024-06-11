import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";

export default function MenuStack() {

    return (
        <Stack screenOptions={{
            headerRight: () => (
                <Link href="/Profile" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="user-circle"
                        size={24}
                        color={Colors.light.tint}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
              headerBackTitleVisible: false,
              headerTintColor: Colors.light.tint
        }}>
            <Stack.Screen name="index" options={{title: 'Explore'}}/>
        </Stack>
    );
}