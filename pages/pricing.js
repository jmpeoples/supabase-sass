import InitStripe from "stripe";
import { useUser } from '../pages/context/user';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import Link from 'next/link';


const Pricing = ({plans}) => {
    const { user, login, isLoading } = useUser();

    const showSubscribeButton = !!user && !user.is_subscribed;
    const showCreateAccountButton = !user;
    const showMangeSubscriptionButton = !!user && user.is_subscribed;
  
    const processSubscription = planId => async() => {
        //make a request to an api route to handle customer charge for subscription

        const { data} = await axios.get(`/api/subscription/${planId}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
        await stripe.redirectToCheckout({sessionId: data.id})

    }

    return(
       <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
        {plans.map((plan) => (
            <div key={plan.id} className="w-80 h-40 shadow px-6 py-6">
                <h2 className="text-xl">{plan.name}</h2>
                <p className="text-gray-500">
                    ${plan.price / 100 } / {plan.interval}
                </p>
                {!isLoading && (
                    <div>
                    {showSubscribeButton && (
                        <button onClick={processSubscription(plan.id)}>Subscribe</button>
                    )}
                    {showMangeSubscriptionButton && (
                        <Link href="/dashboard">
                            <a>Manage Subscription</a>
                        </Link>
                    )}
                    </div>    
                )}
                 {showCreateAccountButton && (
                        <button onClick={login}>Create Account</button>
                    )}
            </div>
        ))}
       </div>
    )
}

export const getStaticProps = async () => {
    // fetch pricing data at build time
    const stripe = InitStripe(process.env.STRIPE_SECRET_KEY);

    const {data: prices } = await stripe.prices.list();
   
    //grab name of our product 
    const plans = await Promise.all(prices.map(async (price) => {
        const product = await stripe.products.retrieve(price.product);

        return{
            id: price.id,
            name: product.name,
            price: price.unit_amount,
            interval: price.recurring.interval,
            currency: price.currency
        }
    }))

    const sortedPlans = plans.sort((a,b) => a.price - b.price);

    return {
        props:{
            plans: sortedPlans,
        }
    }
}

export default Pricing;