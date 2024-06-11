// TODO theoretically we can do away with this... just need to modify /Profile to /Account in explore _layout

import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Account from '@/app/(profile)/Account'
import { Session } from '@supabase/supabase-js'
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
