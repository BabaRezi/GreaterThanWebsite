const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  'grand mum.': 'price_1TY5wcAxtHy9SyCUr9trfufE',
  'that mum.':  'price_1TY5x2AxtHy9SyCUoBXPSMTe',
  'pro mum.':   'price_1TY5xqAxtHy9SyCUv4XxYvtW',
  'boy mum.':   'price_1TY5DLAxtHy9SyCUtKFcroaD',
  'girl mum.':  'price_1TY5DLAxtHy9SyCUIDjnNE5D',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('KEY present:', !!process.env.STRIPE_SECRET_KEY);
    const { items } = JSON.parse(event.body);
    console.log('Items received:', JSON.stringify(items));

    const line_items = items
      .filter(item => PRICE_IDS[item.name])
      .map(item => ({ price: PRICE_IDS[item.name], quantity: item.qty }));

    console.log('Line items:', JSON.stringify(line_items));

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
    console.log('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
