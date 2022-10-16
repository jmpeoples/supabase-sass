// import initStripe from 'stripe';
import Stripe from "stripe";
import { supabase} from "../../utils/supabase";

const handler = async (req, res) => {
     //create API key, verify the person making requests is us and not some stranger
    if(req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET){
        return res.status(401).send('You are not authorized to call the API');
    }   
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Call this api route anytime any time a new row is added to the profile table
    // Call this endpoint anytime an insert event happens
        const customer = await stripe.customers.create({
            email: req.body.record.email,
            description: "My first test customer"
        });

       
    //

        await supabase.from('profile').update({
            stripe_customer: customer.id
        }).eq("id", req.body.record.id);

        res.send({message: `stripe customer created: ${customer.id}`})
    //stripe will give us back a customer object
  

}

export default handler;