import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bmekxvvsfvvoanpiajoq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZWt4dnZzZnZ2b2FucGlham9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwNzQ5MjMsImV4cCI6MjAyODY1MDkyM30.yvVBPPUcCPvjimplhsqp_vEPonhmii-fJ6h7CSweev0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})