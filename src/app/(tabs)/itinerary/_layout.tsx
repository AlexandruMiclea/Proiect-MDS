import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="newItinerary" options={{ headerShown: true, headerTitle: "Create Itinerary"}}/>
      <Stack.Screen name="itineraryPage" options={{ headerShown: true, headerTitle: "Result"}}/>
    </Stack>
  );
}