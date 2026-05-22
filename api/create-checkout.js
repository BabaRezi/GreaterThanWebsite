const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  'grand mum.':   'price_1Ta007AxtHy9SyCU1X9WES1y',
  'that mum.':    'price_1Ta008AxtHy9SyCULkUyGqf8',
  'pro mum.':     'price_1Ta009AxtHy9SyCUmPm4zDzc',
  'boy mum.':     'price_1Ta00AAxtHy9SyCU1GKlIeZ',
  'girl mum.':    'price_1Ta00AAxtHy9SyCUpm049vBn',
  'Greater Test': 'price_1Ta007AxtHy9SyCUhMl3HpWR',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items } = req.body;

    const line_items = items
      .filter(item => PRICE_IDS[item.name])
      .map(item => ({ price: PRICE_IDS[item.name], quantity: item.qty }));

    if (line_items.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart' });
    }

    const origin = req.headers.origin || 'https://greaterthanapparel.co.uk';

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

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
