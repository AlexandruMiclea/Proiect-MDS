import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Image, Text } from 'react-native'
import PrettyTextInput from '@/components/PrettyTextInput'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const colorScheme = useColorScheme();
  const mainColor = Colors[colorScheme ?? 'light'].tint;

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image style={styles.logoImage} source={require('@assets/images/icon.png')}></Image>
        <PrettyTextInput label='email' onChange={setEmail} icon="envelope" secure={false}/>
        <PrettyTextInput  label='password' onChange={setPassword} icon="lock" secure={true}></PrettyTextInput>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            disabled={loading} 
            onPress={signInWithEmail} 
            style={[styles.button, { backgroundColor: mainColor, flex: 1 }]}
          >
            <Text style={styles.createButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            disabled={loading} 
            onPress={signUpWithEmail} 
            style={[styles.button, { backgroundColor: mainColor, flex: 1 }]}
          >
            <Text style={styles.createButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
        
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  logoImage: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
    marginBottom: 40,
  },
  container: {
    marginTop: 40,
    height: '100%',
    alignItems: 'center',
    padding: 10, 
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 10,
    height: 50,
    width: 10,
    margin: 6,
  },
  createButtonText: {
    color: 'white',
    paddingVertical: 14,
    fontWeight: 'bold',
  }
})