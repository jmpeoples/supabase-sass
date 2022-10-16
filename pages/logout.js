import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "./context/user";

const Logout = () => {
    const { logout } = useUser()
    useEffect(() => {
        logout();
    }, [])
    return <p>Logging out</p>
}

export default Logout;