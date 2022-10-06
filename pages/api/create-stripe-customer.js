// import initStripe from 'stripe';
import Stripe from "stripe";
import { supabase} from "../../utils/supabase";

const handler = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const customer = await stripe.customers.create({
            email: req.body.record.email,
            description: "My first test customer"
        });

        await supabase.from('profile').update({
            stripe_customer: customer.id
        }).eq("id", req.body.record.id);

        res.send({message: `stripe customer created: ${customer.id}`})
    //stripe will give us back a customer object
  

}

export default handler;