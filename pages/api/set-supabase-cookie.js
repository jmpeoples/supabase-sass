import { supabase } from '../../utils/supabase';

const handler = async(req, res) =>{
    // figure who are users are in the api route set auth cookie
    await supabase.auth.api.setAuthCookie(req, res);
}

export default handler;