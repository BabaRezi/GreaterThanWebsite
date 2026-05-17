const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  'grand mum.': 'price_1TY3P6S4Cd3nSRcFoBpceGLf',
  'that mum.':  'price_1TY3P5S4Cd3nSRcFXGoAS897',
  'pro mum.':   'price_1TY3P5S4Cd3nSRcFWn0iwxZz',
  'boy mum.':   'price_1TY3P4S4Cd3nSRcFRafgNDd7',
  'girl mum.':  'price_1TY3P3S4Cd3nSRcFD7p9zyX0',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    const line_items = items
      .filter(item => PRICE_IDS[item.name])
      .map(item => ({ price: PRICE_IDS[item.name], quantity: item.qty }));

    if (line_items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No valid items in cart' }) };
    }

    const origin = event.headers.origin || 'https://greaterthanapparel.co.uk';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}?checkout=success`,
      cancel_url:  `${origin}?checkout=cancelled`,
      shipping_address_collection: { allowed_countries: ['GB'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 399, currency: 'gbp' },
            display_name: 'Standard Delivery (2–4 working days)',
          },
        },
      ],
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
