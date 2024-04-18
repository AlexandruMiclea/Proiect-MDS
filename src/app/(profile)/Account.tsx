import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Text, Pressable, StyleSheet, View, Alert, ScrollView } from "react-native";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import Avatar from "@/components/Avatar";
import { useNavigation, router} from "expo-router";
import useAuth from "../providers/AuthProvider";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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
          `username, avatar_url`, 
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
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
    <Avatar
      size={200}
      url={avatarUrl}
      onUpload={(url: string) => {
        setAvatarUrl(url);
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
          disabled
        />
      </View>


{/* Add by andrei*/}
<View style={styles.buttonContainer}>
  <Pressable
    onPress={() => {router.navigate({pathname: "ProfileSettings", params: session})}}
    style={({ pressed }) => [
      styles.pressable
    ]}>
    <Text style={[styles.text]}> Profile Settings </Text>
  </Pressable>
</View>


{/* Add by andrei*/}
<View style={styles.buttonContainer}>
  <Pressable
    onPress={() => {router.navigate({pathname: "PreferenceSettings", params: session})}}
    style={({ pressed }) => [
      styles.pressable
    ]}
  >
    <Text style={[styles.text]}>
      Preference Settings
    </Text>
  </Pressable>
</View>

{/* Add by andrei*/}
<View style={styles.signOut}>
  <Pressable
      onPress={() => supabase.auth.signOut()}
    style={({ pressed }) => [
      styles.pressable
    ]}
  >
    <Text style={[styles.text]}>
      Sign Out
    </Text>
  </Pressable>
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  button_container: {
    marginTop: 20,
    backgroundColor: 'brown',
    overlayColor: 'black',
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  avatarContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 100,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: '#7975F8',
  },
  signOut: {
    marginTop: 20,
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: 'brown',
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
});