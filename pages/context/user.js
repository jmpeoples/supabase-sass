import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from "next/router";
import axios from "axios";


const Context = createContext();

const Provider = ({children}) => {
    const router = useRouter(); 
    const [user, setUser] = useState(supabase.auth.user());
    const [isLoading, setIsLoading] = useState(true);

    // listen to any changes on our Auth object
    useEffect(() => {

        const getUserProfile = async () => {
            // check if we have a session user
            const sessionUser = supabase.auth.user();

            // then merge the data from our Profile to our session user
            if(sessionUser){
                const {data: profile} = await supabase
                .from("profile")
                .select("*")
                .eq('id', sessionUser.id)
                .single()

                setUser({
                    ...sessionUser,
                    ...profile,
                });

                setIsLoading(false);
            }
        }
     
        getUserProfile();
        
        supabase.auth.onAuthStateChange(() => {
            getUserProfile();
        } )
    }, []);

    useEffect(() => {
        //trigger when user object changes
        axios.post("/api/set-supabase-cookie", {
            event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
            session: supabase.auth.session(),
        })
    }, [user])

    const login = async () => {
        await supabase.auth.signIn({
            provider: 'github'
        })
    }

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/')
    };

    const exposed = {
        user,
        login,
        logout,
        isLoading,
    }

    return(
        <Context.Provider value={exposed}>
            {children}
        </Context.Provider>
    )
}

export const useUser = () => useContext(Context);

export default Provider;