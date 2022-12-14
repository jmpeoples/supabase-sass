import {supabase} from '../../utils/supabase'
import cookie from "cookie";
import initStripe from "stripe";

const handler = async(req, res) =>{
    // figure who are users are in the api route set auth cookie
  const {user} = await supabase.auth.api.getUserByCookie(req);

  if(!user){
    return res.status(401).send('Unauthorized');
  }

  //before making request to supabase extract token
  const token = cookie.parse(req.headers.cookie)["sb-access-token"];

//https://supabase.com/docs/reference/javascript/auth-setauth
 supabase.auth.setAuth(token);
  
  //to initiate our payment with stripe need stripe profile

  const {data: {stripe_customer}} = await supabase
  .from('profile')
  .select('stripe_customer')
  .eq('id', user.id)
  .single()

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.CLIENT_URL}/dashboard`
      })
      res.send({
        url: session.url
      })
}

export default handler;
