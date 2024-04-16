import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [preferenceSport, setPreferenceSport] = useState('')
  const [preferenceArt, setPreferenceArt] = useState('')
  const [preferenceFood, setPreferenceFood] = useState('')
  const [preferenceItineraryComplexity, setPreferenceItineraryComplexity] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, preference_sports, preference_food, preference_arts, preference_itinerary_complexity`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setPreferenceSport(data.preference_sports)
        setPreferenceArt(data.preference_arts)
        setPreferenceFood(data.preference_food)
        setPreferenceItineraryComplexity(data.preference_itinerary_complexity)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    avatar_url,
    preference_sports,
    preference_arts,
    preference_food,
    preference_itinerary_complexity
  }: {
    username: string
    avatar_url: string
    preference_sports: string
    preference_arts: string
    preference_food: string
    preference_itinerary_complexity: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        preference_sports,
        preference_arts,
        preference_food,
        preference_itinerary_complexity,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
        <View>
            <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url: string) => {
                    setAvatarUrl(url)
                    updateProfile({ username , avatar_url: url, preference_sports, preference_arts, preference_food, preference_itinerary_complexity})
                }}
            />
        </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      {/* TODO change to sliders */}
      <View style={styles.verticallySpaced}>
        <Input label="Sport" value={preferenceSport.toString() || ''} onChangeText={(text) => setPreferenceSport(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Art" value={preferenceArt.toString() || ''} onChangeText={(text) => setPreferenceArt(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Food" value={preferenceFood.toString() || ''} onChangeText={(text) => setPreferenceFood(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Itinerary Complexity" value={preferenceItineraryComplexity.toString() || ''} onChangeText={(text) => setPreferenceItineraryComplexity(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl, preference_sports: preferenceSport, preference_arts: +preferenceArt, preference_food: +preferenceFood, preference_itinerary_complexity: +preferenceItineraryComplexity})}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})