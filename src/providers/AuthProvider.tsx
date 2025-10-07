
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as SecureStore from 'expo-secure-store';


// Persistência em dispositivos nativos
supabase.auth.onAuthStateChange(async (event, session) => {
if (session) {
await SecureStore.setItemAsync('sb-session', JSON.stringify(session));
} else {
await SecureStore.deleteItemAsync('sb-session');
}
});


export type AuthContextType = {
session: any | null,
loading: boolean,
signIn: (email: string, password: string) => Promise<{ error?: any }>,
signUp: (email: string, password: string) => Promise<{ error?: any }>,
signOut: () => Promise<void>
};


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        (async () => {
            const stored = await SecureStore.getItemAsync('sb-session');
            if (stored) {
                try { setSession(JSON.parse(stored)); } catch { }
            } else {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
            }
            setLoading(false);
        })();


        const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
            setSession(sess);
        });
        return () => { sub.subscription.unsubscribe(); };
    }, []);


    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };


    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error };
    };


    const signOut = async () => { await supabase.auth.signOut(); };


    return (
        <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};