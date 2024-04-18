import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

type AuthData = {
    session: Session | null;
};

const AuthContext = createContext<AuthData>({
    session: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSession = async () => { 
            const {data} = await supabase.auth.getSession();
            setSession(data.session);
            //console.log(data);
        }
        fetchSession();
    }, []);

    return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);