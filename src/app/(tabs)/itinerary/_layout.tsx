import { Stack } from "expo-router";

// create the navigation stack for the itinerary generation ->
// first we push the new itinerary generation page, then go to the
// itinerary page
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="newItinerary" options={{ headerShown: true, headerTitle: "Create Itinerary"}}/>
      <Stack.Screen name="itineraryPage" options={{ headerShown: true, headerTitle: "Result"}}/>
    </Stack>
  );
}