import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import SessionError from '../SessionError'
import Account from '@/app/(profile)/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Redirect } from 'expo-router'
import AuthPage from '../(auth)/AuthPage'

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  if (!session || !session.user){
    return <AuthPage></AuthPage>
  } else {
    return (<Account session={session}></Account>)
  }
}
