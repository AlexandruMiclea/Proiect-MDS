import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import AuthProvider from './providers/AuthProvider';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{
          headerBackTitleVisible: false
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/*TODO see if these need to be moved in a separate profile _layout file*/ }
          <Stack.Screen name="(profile)/Profile" options={{ headerShown: true, headerTitle: "Profile Page"}}/>
          <Stack.Screen name="(profile)/ProfileSettings" options={{ headerShown: true, headerTitle: "Account Settings"}}/>
          <Stack.Screen name="(profile)/PreferenceSettings" options={{ headerShown: true, headerTitle: "Trip Preferences"}}/>
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
