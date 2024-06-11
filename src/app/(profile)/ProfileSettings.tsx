import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Text, Pressable, StyleSheet, View, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Button, Input } from "react-native-elements";
import Avatar from "@/components/Avatar";
import { useAuth } from "../providers/AuthProvider";

export default function ProfileSettings() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url,full_name`,
        )
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        setLoading(false);
      }
    } 
    finally {
      setLoading(false);
    }
  }

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
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    // TODO change loading screen circle color
    return (<View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7975F8"></ActivityIndicator>
    </View>)
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style = {styles.pressable}>
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
        {/* Add full name input field _andrei*/}
        <View style={styles.verticallySpaced}>
          <Input
            label="Full Name"
            value={fullName || ""}
            onChangeText={(text) => setFullName(text)}
          />
        </View>
        
        {/* Add by andrei*/}
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

