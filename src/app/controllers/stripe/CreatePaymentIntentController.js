import * as Yup from 'yup'
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51Q9vPOJzRvprckx0IPZ4GBurL0YMYd35X8nl4MXM5cMwDsnoR6vYsp2PgLjiMIB2uiuxQIQQKaKkzc9nbPi1EgKC00Uw1D3CDO');
import 'dotenv/config';


const calculateOrderAmout = (items)=>{
    const total = items.reduce((acc, current) =>{
        return current.price * current.quantity + acc;
    }, 0);

    return total;
}
console.log('Chave do Stripe:', process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Chave do Stripe não foi carregada');
}


class CreatePaymentIntentController{
async store(request,response){
    const Schema = Yup.object({
        products: Yup.array().required().of(
            Yup.object({
                id: Yup.number().required(),
                quantity: Yup.number().required(),
                price: Yup.number().required(),

            })
        ),
        
      });
      try{
        Schema.validateSync(request.body,{abortEarly:false})
      }catch(err){
        return response.status(400).json({ error: err.errors})
      }
      const {products} = request.body
        const amount = calculateOrderAmout(products);

        
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "brl",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  response.json({
    clientSecret: paymentIntent.client_secret,
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });

    }

}

export default new CreatePaymentIntentController()