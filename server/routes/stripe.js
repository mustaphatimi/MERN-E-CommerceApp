require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express');
const Order = require('../models/order');
const router = express.Router()

router.route('/create-checkout-session')
  .post(async (req, res) => {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body?.userId,
  }
})

    try {
      const line_items = req.body?.cartItems.map((item => ({
              price_data: {
                  currency: 'usd',
                  product_data: {
                    name: item.name,
                    images: [item.image.url ? item.image.url : item.image],
                    description: item.description,
                    metadata: {
                      id: item._id
                    }
                  },
                  unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })))
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              customer: customer.id,
              line_items,
              shipping_address_collection: {
                allowed_countries: ['US', 'CA'], // Specify the countries where shipping is allowed
              },
              mode: 'payment',
              success_url: `${process.env.FRONTEND_URL}/checkout-success`,
              cancel_url: `${process.env.FRONTEND_URL}/`,
            })
               return res.json({url: session.url})
          } catch (error) {
                console.log('Error processing payment...', error)
          }
        });


const createOrder = async(customer, data, lineItems) => {  
  const order = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: lineItems,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    delivery_status: data.status,
    payment_status: data.payment_status
  })

  try {
    await order.save()
  } catch (error) {
    console.log(error.message)
  }
        }
// Stripe Webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_a499d46b6267e7e19d5f19b04e8a8571d60f47047b71aa4615a992fea190a166";

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

    let event;
    let data;
  let eventType;
  let endpointSecret;
  
  if (endpointSecret) {
    // Stripe webhook verification
    try {
      event = await stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      data = event.data;
      eventType = event.type;
      console.log('Webhook verified', event)
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    data = event.data.object;
    eventType = event.type
  }
  // Bypass stripe verification
  data = req.body.data.object;
  eventType = req.body.type;

    // Handle the event
    if (eventType === 'checkout.session.completed') {
      await stripe.customers.retrieve(data.customer)
        .then((customer) => {
          stripe.checkout.sessions.listLineItems(
          customer.id,
          { limit: 100 },
          function(err, lineItems) {
              createOrder(customer, data, lineItems)
          }
        );
        })
        .catch((err) => console.log(err.message))
    }
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 res to acknowledge receipt of the event
  res.send().end();
});

module.exports = router;
