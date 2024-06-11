// Import necessary modules and components
import { useState, useEffect } from "react"; // React hooks
import { supabase } from "@/lib/supabase"; // Supabase client
import { Text, Pressable, StyleSheet, View, Alert, ScrollView, ActivityIndicator } from "react-native"; // React Native components
import { Input } from "react-native-elements"; // React Native Elements Input component
import Avatar from "@/components/Avatar"; // Custom Avatar component
import { Session } from "@supabase/supabase-js"; // Supabase Session type

// ProfileSettings component
// This component allows the user to view and update their profile settings
export default function ProfileSettings({ session }: { session: Session }) {
  // State variables
  // loading: whether the component is currently loading data
  // username: the user's username
  // avatarUrl: the URL of the user's avatar
  // fullName: the user's full name
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");

  // Effect hook to fetch the user's profile when the session changes
  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  // Function to fetch the user's profile from Supabase
  async function getProfile() {
    try {
      // Start loading
      setLoading(true);

      // If there is no user on the session, throw an error
      if (!session?.user) throw new Error("No user on the session!");

      // Fetch the user's profile from Supabase
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,full_name`)
        .eq("id", session?.user.id)
        .single();

      // If there was an error and the status is not 406, throw the error
      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      // If data was received, update the state variables
      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name);
      }
    } catch (error) {
      // If an error occurred, show an alert and stop loading
      if (error instanceof Error) {
        Alert.alert(error.message);
        setLoading(false);
      }
    } finally {
      // Stop loading
      setLoading(false);
    }
  }

  // Function to update the user's profile in Supabase
  async function updateProfile({
    username,
    avatar_url,
    full_name,
  }: {
    username: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      // Start loading
      setLoading(true);

      // If there is no user on the session, throw an error
      if (!session?.user) throw new Error("No user on the session!");

      // Prepare the updates
      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      // Update the user's profile in Supabase
      const { error } = await supabase.from("profiles").upsert(updates);

      // If there was an error, throw the error
      if (error) {
        throw error;
      }
    } catch (error) {
      // If an error occurred, show an alert
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      // Stop loading
      setLoading(false);
    }
  }

  // If the component is loading, display a loading indicator
  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7975F8"></ActivityIndicator>
      </View>
    );
  } else {
    // If the component is not loading, display the profile settings
    return (
      <ScrollView style={styles.container}>
        <View style={styles.pressable}>
          <Avatar
            size={250}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({
                username,
                avatar_url: url,
                full_name: fullName,
              });
            }}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input label="Email" value={session?.user?.email} disabled />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Username"
            value={username || ""}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Full Name"
            value={fullName || ""}
            onChangeText={(text) => setFullName(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              if (!loading) {
                updateProfile({
                  username,
                  avatar_url: avatarUrl,
                  full_name: fullName,
                });
              }
            }}
            style={({ pressed }) => [
              styles.pressable,
              { backgroundColor: pressed ? '#6762F5' : 'transparent' }
            ]}
            disabled={loading}
          >
            <Text style={[styles.text]}>
              {loading ? "Loading ..." : "Update"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
}

// Styles for the component
const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  pressable: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: '#7975F8',
  },
});