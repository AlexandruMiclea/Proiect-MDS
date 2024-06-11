import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Text, Pressable, StyleSheet, View, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Input } from "react-native-elements";
import { Image } from "react-native"
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

// this method receives the user session as a parameter, in order to
// be able to get the user data from SupaBase
export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // we use useFocusEffect in order to get profile data on page render 
  // (life hack incase we modify user photo or username or full name,
  // because we want to load changes from the database, they are not locally saved)
  useFocusEffect(
    React.useCallback(() => {
      if (session) getProfile();
    }, [session])
  )

  // if the avatarUrl is changed, we want to get the image
  useEffect(() => {
      // down below we modify the avatarUrl to some shenanigans, pulling images from supabase
      // requires the name of the image only
      if (avatarUrl && avatarUrl.endsWith('.png')) downloadImage(avatarUrl);
    }, [avatarUrl]
  )

  // method responsible with downloading the image
  // receives the path as a parameter, which in fact is the name of the photograph in
  // the table
  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getProfile() {
    setLoading(true);
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, full_name`, 
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
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              accessibilityLabel="Avatar"
              style={styles.accountImage}
            />
          ) : (
            <View style={styles.accountImage} />
          )}
        </View>
        <View style = {styles.nameContainer}>
            <Text style = {styles.nameFormat}>{fullName}</Text>
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
            onPress={() => {
              router.navigate({pathname: "ProfileSettings"});
            }}
            style={({ pressed }) => [
              styles.pressable,
              { backgroundColor: pressed ? '#6762F5' : 'transparent' }
            ]}>
            <Text style={[styles.text]}> Profile Settings </Text>
          </Pressable>
        </View>


        {/* Add by andrei*/}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {router.navigate({pathname: "PreferenceSettings"})}}
            style={({ pressed }) => [
              styles.pressable,
              { backgroundColor: pressed ? '#6762F5' : 'transparent' }
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
              onPress={() => {
                supabase.auth.signOut()
              }}
              style={({ pressed }) => [
                styles.pressable,
                { backgroundColor: pressed ? '#9E2020' : 'transparent' }
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
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  },
  nameContainer: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  nameFormat: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  accountImage: {
    width:200,
    height: 200,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 100
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