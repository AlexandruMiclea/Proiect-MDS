import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import SessionError from '../SessionError'
import Account from '@/app/(profile)/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

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

  

  return (
    <View>
      {/*if i am logged in, show my account, otherwise show the auth form*/
        session && session.user ? <Account key={session.user.id} session={session} /> : <SessionError />}
    </View>
  )
}
