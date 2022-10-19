import InitStripe from "stripe";


const Pricing = ({plans}) => {
    console.log("plans", plans);
    return(
       <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
        {plans.map((plan) => (
            <div key={plan.id} className="w-80 h-40 shadow px-6 py-6">
                <h2 className="text-xl">{plan.name}</h2>
                <p className="text-gray-500">
                    ${plan.price / 100 } / {plan.interval}
                </p>
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