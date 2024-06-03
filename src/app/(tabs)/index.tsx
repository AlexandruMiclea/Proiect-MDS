import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { View } from 'react-native'
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

    return (
    <View>
        {/*if i am logged in, show my account, otherwise show the auth form*/
        session && session.user ? <Redirect href={'/explore/'}/> : <AuthPage />}
    </View>
    )
}