import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { Redirect } from 'expo-router';
import AuthPage from '@/app/(auth)/AuthPage'

export default function TabIndex() {
    const [session, setSession] = useState<Session | null>(null)
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    // this is the first page that gets shown
    // if there is no user session, show the authentication screen
    // otherwise redirect to the explore page
    // this redirect also shows my tab bar at the bottom
    if (session && session.user) {
        return <Redirect href = {'/explore'}/>
    } else {
        return <AuthPage/>
    }

}