import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import AuthProvider from './providers/AuthProvider';
import AuthPage from './(auth)/AuthPage';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

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
  const [session, setSession] = useState<Session | null>(null)
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [loading, setLoading] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    setLoading(false);
  }, [])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  console.log('aci sunt Blaga');

  if (loading) {
    console.log('ma incarc');
    return (<View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="#7975F8"></ActivityIndicator>
    </View>)
  } else {
    console.log('unde oi mere');
    if (session && session.user) {
      console.log('rootlay');
      return <RootLayoutNav />;
    } else {
      console.log('authpa');
      return <AuthPage></AuthPage>
    }
  }
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
          <Stack.Screen name="(profile)/Profile" options={{ headerShown: true, headerTitle: "Profile Page", headerTintColor: Colors.light.tint}}/>
          <Stack.Screen name="(profile)/ProfileSettings" options={{ headerShown: true, headerTitle: "Account Settings", headerTintColor: Colors.light.tint}}/>
          <Stack.Screen name="(profile)/PreferenceSettings" options={{ headerShown: true, headerTitle: "Trip Preferences", headerTintColor: Colors.light.tint}}/>
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  }
});