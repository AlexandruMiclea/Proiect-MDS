import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Text, StyleSheet, View, Alert, ScrollView} from "react-native";
import { Button, Input, Slider } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import Avatar from "@/components/Avatar";
import { useAuth } from "../providers/AuthProvider";

export default function PreferenceSettings() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [PreferenceSport, setPreferenceSport] = useState(0);
  const [PreferenceFood, setPreferenceFood] = useState(0);
  const [PreferenceArts, setPreferenceArts] = useState(0);
  const [ItineraryComplexity, setItineraryComplexity] = useState(0);

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
          `username, avatar_url, preference_sportss, preference_food, preference_arts, preference_itinerary_complexity`
        )
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setPreferenceSport(data.preference_sports);
        setPreferenceFood(data.preference_food);
        setPreferenceArts(data.preference_arts);
        setItineraryComplexity(data.preference_itinerary_complexity);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    preference_sports,
    preference_food,
    preference_arts,
    preference_itinerary_complexity,
  }: {
    preference_sports: number;
    preference_food: number;
    preference_arts: number;
    preference_itinerary_complexity: number;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        preference_sports,
        preference_food,
        preference_arts,
        preference_itinerary_complexity,
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

  return (
    <ScrollView style={styles.container}>
      {/* Sliders for Arts */}

      <View style={styles.sliderContiner}>
        <Text style={styles.sliderTitle}>Preferences in Art</Text>
        <Slider
          value={PreferenceArts}
          minimumValue={0}
          maximumValue={4}
          minimumTrackTintColor="brown"
          step={1}
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
          onValueChange={(value) => setPreferenceArts(value)}
        />
      </View>
  
      {/* Sliders for Food */}
      <View style={styles.sliderContiner}>
        <Text style={styles.sliderTitle}>Preferences in Food</Text>
        <Slider 
          value={PreferenceFood}
          minimumValue={0}
          maximumValue={4}
          minimumTrackTintColor="brown"
          step={1}
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
          onValueChange={(value) => setPreferenceFood(value)}
        />
      </View>
  
      {/* Sliders for Sports */}
      <View style={styles.sliderContiner}>
        <Text style={styles.sliderTitle}>Preferences in Sports</Text>
        <Slider 
          value={PreferenceSport}
          minimumValue={0}
          maximumValue={4}
          minimumTrackTintColor="brown"
          step={1}
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
          onValueChange={(value) => setPreferenceSport(value)}
        />
      </View>
  
      {/* Sliders for Itinerary Complexity */}
      <View style={styles.sliderContiner}>
        <Text style={styles.sliderTitle}>Itinerary Complexity</Text>
        <Slider 
          value={ItineraryComplexity}
          minimumValue={0}
          maximumValue={4}
          minimumTrackTintColor="brown"
          step={1}
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
          onValueChange={(value) => setItineraryComplexity(value)}
        />
      </View>
  
      <View style={[styles.verticallySpaced, styles.mt20, styles.button]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              preference_arts: PreferenceArts,
              preference_food: PreferenceFood,
              preference_sports: PreferenceSport,
              preference_itinerary_complexity: ItineraryComplexity,
            })
          }
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  sliderContiner: {
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  sliderTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10, // Add spacing between title and slider
  },
  slider: {
    fontSize: 2,
    fontWeight: 'bold',

  },
  sliderThumb: {
    backgroundColor: 'brown',
  },
  sliderTrack: {
    height: 10,
    borderRadius: 10,
  },
  button:{
    backgroundColor: 'brown',
    color: 'white',
    fontWeight: 'bold',

  }
});