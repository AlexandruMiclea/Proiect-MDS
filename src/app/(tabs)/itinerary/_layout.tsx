import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="newItinerary"  options={{ headerShown: true, headerTitle: "New Itinerary"}}/>
    </Stack>
  );
}