export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'shipping' | 'returns' | 'sizing' | 'warranty' | 'care' | 'technology' | 'faq';
  content: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'kb-shipping-policy',
    title: 'Shipping Rates, Delivery Times, and Free Shipping',
    category: 'shipping',
    keywords: ['shipping', 'delivery', 'cost', 'rates', 'free shipping', 'fedex', 'ups', 'international', 'expedited', 'tracking'],
    content: `
# Shipping Policy & Delivery Timelines
- **Free Standard Shipping**: Available on all orders over $75 within the contiguous United States. Orders under $75 carry a flat $5.95 standard shipping fee.
- **Standard Ground Shipping**: Delivered within 3-5 business days via UPS or FedEx Ground.
- **Expedited 2-Day Shipping**: Available at checkout for $14.99. Orders placed by 2:00 PM EST Monday through Friday ship same-day.
- **Next-Day Overnight Delivery**: Available for $24.99 for orders placed by 1:00 PM EST.
- **International Shipping**: We ship to Canada, UK, Europe, Australia, and 45+ other countries. International rates vary between $18 - $35 and take 6-12 business days.
- **Tracking**: A tracking number and live dispatch link are emailed automatically as soon as your shoes leave our logistics warehouse.
    `
  },
  {
    id: 'kb-returns-exchanges',
    title: '30-Day Wear Test Trial, Returns, and Free Exchanges',
    category: 'returns',
    keywords: ['return', 'returns', 'exchange', 'exchanges', 'refund', 'guarantee', 'trial', '30 days', 'worn', 'policy'],
    content: `
# 30-Day "Run In Them" Trial & Return Policy
- **The Stride Guarantee**: We believe you cannot judge running or lifestyle shoes until you take them for a real spin. You can wear and test your shoes outside for up to 30 days from delivery.
- **Completely Free Exchanges**: If the size, fit, or color isn't 100% right, exchanges are completely free with prepaid return shipping labels provided instantly online.
- **Full Refunds**: If you choose a refund instead of an exchange, a prepaid return label is generated through our Returns Portal. Once received at our facility, refunds are credited back to your original payment method within 3 to 5 business days.
- **Condition**: While we accept worn shoes under our 30-day trial, we request that shoes are free of excessive mud or debris. All returned shoes in gently used condition are sanitized and donated to our Soles4Good athletic youth charity.
- **Final Sale Items**: Only items explicitly marked as "Final Clearance (60%+ off)" are non-returnable.
    `
  },
  {
    id: 'kb-sizing-guide',
    title: 'Shoe Sizing Guide, True-to-Fit Advice, and Width Recommendations',
    category: 'sizing',
    keywords: ['size', 'sizing', 'fit', 'wide feet', 'half size', 'run small', 'run big', 'measure', 'chart', 'cm', 'eu', 'uk', 'narrow', 'arch support'],
    content: `
# Sizing Guide & Fit Advice
- **True to Size Benchmark**: 92% of our customers report that Stride shoes fit "True to Size" according to standard Brannock shoe devices and standard US sizing.
- **Half Sizes**: All our adult shoes are crafted in true half sizes (e.g., 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12).
- **If you are in-between sizes**:
  - For **Running shoes** (like AeroGlide Elite Carbon or Velocity Nitro): We recommend going up half a size if you run longer distances (10K+) because feet naturally swell slightly under prolonged cardio impact.
  - For **Lifestyle leather sneakers** (like Velo Retro 88): Stick to your exact true dress/casual shoe size. Italian leather softens and molds to your contours over the first 4-6 wears.
  - For **Trail shoes** (Apex Summit Waterproof): Go half size up if you plan to wear thick Merino wool hiking socks.
- **Wide Feet Recommendations**:
  - The **CloudPulse Flow 2** and **Velo Urban Knit Slip-On** feature anatomical wide toe-boxes and flexible knit that naturally accommodate E / 2E widths comfortably.
  - The **Apex TerraGrip Low Hiker** features climbing-style to-the-toe lacing that lets you loosen the forefoot for wider feet.
- **International Conversion**:
  - US Men 9 = US Women 10.5 = EU 42.5 = UK 8.5 = 27.0 CM
  - US Men 10 = US Women 11.5 = EU 44 = UK 9.5 = 28.0 CM
  - US Men 11 = US Women 12.5 = EU 45 = UK 10.5 = 29.0 CM
    `
  },
  {
    id: 'kb-foot-health-conditions',
    title: 'Foot Support: Plantar Fasciitis, High Arches, Flat Feet, and Orthotics',
    category: 'sizing',
    keywords: ['plantar fasciitis', 'flat feet', 'high arch', 'orthotics', 'cushion', 'pain', 'heel spur', 'support', 'knee pain', 'stability'],
    content: `
# Recommended Shoes for Specific Foot & Comfort Needs
- **For Plantar Fasciitis & Heel Spurs**:
  - Top Recommendation: **Stride PaceMaker Recovery Slide** (for home/post-workout) and **Stride CloudPulse Flow 2** (for daily road running and walking). Both have deep anatomical heel cups and targeted plantar fascia arch relief that reduces morning heel shock.
- **For High Arches**:
  - Top Recommendation: **Stride CloudPulse Flow 2** with dual-density memory arch cushions that fill the plantar void, preventing supination.
- **For Flat Feet & Overpronation**:
  - Top Recommendation: **Stride FlexZone Metcon HIIT** or **Volt Court Monarch Pro High**. Their firm lateral midsole sidewalls and wide base provide rigid torsional support that prevents inward ankle roll.
- **Removable Insoles for Custom Orthotics**:
  - All Stride and Velo shoes come with easily removable factory insoles, allowing you to slide in your own custom orthotic inserts or medical footbeds.
    `
  },
  {
    id: 'kb-materials-technology',
    title: 'Proprietary Technologies: Carbon Propulsion, Supercritical Nitrogen, GORE-TEX, Vibram',
    category: 'technology',
    keywords: ['carbon plate', 'foam', 'nitrogen', 'supercritical', 'gore-tex', 'vibram', 'air zoom', 'materials', 'technology', 'waterproof'],
    content: `
# Proprietary Stride Footwear Technologies
- **AeroGlide Carbon Fiber Plate**: A spoon-curved carbon fiber chassis nestled in the midsole. When compressed under load, it snaps back rapidly, propelling the runner forward with an estimated 4% improvement in running economy.
- **Supercritical Nitrogen Foam**: Instead of heavy EVA chemically blown foams, nitrogen gas is injected under extreme temperature and pressure, creating microscopic closed cells that are 30% lighter with up to 85% energy bounce.
- **GORE-TEX Invisible Fit**: Directly bonded to the outer fabric so it feels like a regular flexible running shoe while offering 100% waterproof protection against puddles, rain, and snow.
- **Vibram Megagrip Rubber**: High-traction compound originally developed for mountaineering, delivering unmatched adhesion on slippery wet slate, rocks, and mud.
- **Italian Full-Grain Sourced Leather**: Used in Velo and Aura lines, tanned using vegetable-based eco dyes for low environmental impact and buttery hand feel.
    `
  },
  {
    id: 'kb-cleaning-care-guide',
    title: 'Shoe Care, Cleaning Instructions, and Longevity Guide',
    category: 'care',
    keywords: ['cleaning', 'clean', 'wash', 'washing machine', 'suede', 'leather', 'maintenance', 'care', 'smell', 'odor'],
    content: `
# How to Clean and Maintain Your Shoes
- **Engineered Mesh & Knit Sneakers** (AeroGlide, CloudPulse):
  - Remove insoles and laces.
  - Spot clean dirt with lukewarm water, mild eco detergent, and a soft-bristled brush.
  - Air dry at room temperature away from direct heating vents or direct sunlight (do NOT use a machine dryer as heat degrades midsole glue).
  - *Special note*: The **Velo Urban Knit Slip-On** and **Kids HyperSprint** are fully machine washable on gentle cold cycle in a mesh laundry bag.
- **Full-Grain Leather** (Velo Retro 88):
  - Wipe with a damp microfiber cloth.
  - Apply a quality neutral leather cream or beeswax conditioner every 3 months to prevent creasing and drying.
- **Suede and Nubuck** (Velo Heritage Suede, Aura Velvet Chelsea):
  - Never saturate with water.
  - Use a brass/crepe suede brush to lift surface dust and restore the velvet nap.
  - Treat with a fluoropolymer-free water-repellent spray before wet-weather wear.
- **Odor Control**:
  - Remove insoles overnight after intense runs to let moisture evaporate. We recommend cedar shoe trees for leather models.
    `
  },
  {
    id: 'kb-warranty-authenticity',
    title: '1-Year Limited Manufacturer Warranty and Authenticity Guarantee',
    category: 'warranty',
    keywords: ['warranty', 'guarantee', 'authentic', 'defect', 'sole separation', 'replacement', 'fake'],
    content: `
# Warranty & Authenticity
- **1-Year Manufacturer Defect Warranty**: Every shoe purchased directly from Stride / SoleCraft is protected against manufacturing defects for 365 days from the purchase date. This covers sole delamination, stitching failure, eyelet tears, or defective air/carbon elements under normal usage.
- **Normal Wear & Tear**: Naturally worn-down rubber outsoles after hundreds of miles do not qualify as defect.
- **100% Guaranteed Authentic**: We design, build, and ship directly. There are zero third-party counterfeits.
- **Filing a Claim**: Send photos of the defect and your order number to warranty@stridefootwear.com for a replacement pair or store credit.
    `
  },
  {
    id: 'kb-checkout-payments-faq',
    title: 'Payment Methods, Guest Checkout, Discounts, and Customer Support',
    category: 'faq',
    keywords: ['payment', 'apple pay', 'credit card', 'paypal', 'guest checkout', 'discount code', 'promo', 'customer service', 'contact'],
    content: `
# Payments, Promos, & Customer Support
- **Payment Methods Accepted**: Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, PayPal, and Shop Pay.
- **Guest Checkout**: No registration required! You can complete your purchase in under 60 seconds as a guest.
- **Promotional Codes**: Enter your discount code in the Order Summary box at checkout. Only one promo code can be applied per order.
- **First Order Discount**: New subscribers receive 10% off their initial order with code **STRIDE10** at checkout.
- **Customer Support Hours**: Our support team is online 7 days a week from 8:00 AM to 9:00 PM EST via live chat or support@stridefootwear.com.
    `
  }
];
