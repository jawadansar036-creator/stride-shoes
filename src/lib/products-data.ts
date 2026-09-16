export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: 'Running' | 'Lifestyle' | 'Basketball' | 'Training' | 'Trail' | 'Luxury';
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  features: string[];
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    name: 'Stride AeroGlide Elite Carbon',
    slug: 'stride-aeroglide-elite-carbon',
    brand: 'Stride',
    category: 'Running',
    gender: 'Men',
    price: 185,
    originalPrice: 220,
    discount: 16,
    description: 'Engineered for competitive marathoners and daily tempo runs. Features a full-length carbon-fiber propulsion plate embedded in ultra-responsive supercritical nitrogen foam.',
    features: [
      'Full-length curved carbon fiber propulsion plate',
      'Dual-density nitrogen-infused supercritical foam midsole',
      'Single-layer engineered monofilament mesh upper for max breathability',
      'Continental grade traction rubber outsole for wet and dry pavement',
      'Heel-to-toe drop: 8mm, Weight: 7.4 oz (size 9)'
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Crimson Red / Carbon Black', 'Triple White', 'Volt Lime'],
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    rating: 4.9,
    reviewCount: 248,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: 'prod-002',
    name: 'Stride CloudPulse Flow 2',
    slug: 'stride-cloudpulse-flow-2',
    brand: 'Stride',
    category: 'Running',
    gender: 'Women',
    price: 140,
    originalPrice: 160,
    discount: 12,
    description: 'Buttery smooth daily training shoe with supreme arch cradle cushioning. Designed specifically for road running, long walks, and recovery sessions with zero fatigue.',
    features: [
      'Plush anatomical dual-layer memory insole',
      'Circular knit upper with reinforced lateral midfoot wraps',
      'Beveled heel crash pad for fluid heel-to-toe transition',
      'Ortholite antimicrobial eco-liner',
      'Heel drop: 10mm, Weight: 8.1 oz'
    ],
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Blush Pink / Rose Dust', 'Ice Blue / Cloud White', 'Midnight Violet'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: 'prod-003',
    name: 'Velo Retro 88 Minimalist',
    slug: 'velo-retro-88-minimalist',
    brand: 'Velo Studio',
    category: 'Lifestyle',
    gender: 'Unisex',
    price: 130,
    description: 'An iconic court silhouette updated with butter-soft Italian full-grain nappa leather, recycled vulcanized gum sole, and subtle debossed metallic accents.',
    features: [
      '100% sustainably sourced Italian full-grain leather',
      'Hand-stitched reinforced cupsole construction',
      'Waxed organic cotton laces with engraved brass aglets',
      'Removable molded cork and foam footbed',
      'Timeless clean design matches both tailoring and relaxed denim'
    ],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Chalk White / Natural Gum', 'Off-White / Forest Green', 'Triple Onyx Black'],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: 'prod-004',
    name: 'Apex ApexSummit Waterproof Trail',
    slug: 'apex-summit-waterproof-trail',
    brand: 'Apex Outdoor',
    category: 'Trail',
    gender: 'Men',
    price: 175,
    originalPrice: 195,
    discount: 10,
    description: 'Conquer rocky mountain ascents and muddy singletracks with confidence. Features a Gore-Tex waterproof breathable membrane and aggressive 5mm multidirectional chevron lugs.',
    features: [
      'GORE-TEX Invisible Fit membrane blocks moisture while expelling heat',
      'Vibram Megagrip lugged rubber compound for wet rock adhesion',
      'Reinforced TPU rock-protection plate in the forefoot',
      'Quicklace single-pull tensioning lacing system with lace garage',
      'Gusseted debris-shield tongue prevents dirt and pebbles entry'
    ],
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Alpine Pine / Safety Orange', 'Slate Gray / Rust', 'Obsidian / Stealth'],
    sizes: ['8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: 'prod-005',
    name: 'Volt Court Monarch Pro High',
    slug: 'volt-court-monarch-pro-high',
    brand: 'Volt Athletic',
    category: 'Basketball',
    gender: 'Men',
    price: 165,
    description: 'Dominant indoor hardwood performance. Dual Zoom air cushions in heel and forefoot provide explosive launch dynamics and secure lateral lock for cross-step cuts.',
    features: [
      'Dual-chamber encapsulated Air zoom units for explosive spring',
      'Dynamic high-top padded collar for lockdown ankle stabilization',
      'Herringbone engineered grip matrix for instant multi-angle stops',
      'TPU external midfoot torsional shank',
      'Breathable heat-welded synthetic composite upper'
    ],
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Hyper Violet / Infrared', 'Blackout Stealth', 'Royal Blue / Pure Platinum'],
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: 'prod-006',
    name: 'Stride FlexZone Metcon HIIT',
    slug: 'stride-flexzone-metcon-hiit',
    brand: 'Stride',
    category: 'Training',
    gender: 'Unisex',
    price: 135,
    description: 'The ultimate all-around gym and functional fitness trainer. Flat stable heel for heavy squats, flexible forefoot for box jumps and lunges, and rope-guard sidewalls.',
    features: [
      'Wide flat heel platform creates a solid base for Olympic lifting',
      'Rubber side wraps extend up the sides for rope climb grip and durability',
      'Forefoot flex grooves allow natural foot bending during burpees and sprints',
      'Abrasion-resistant textured honeycomb mesh upper',
      'Dual-density foam softer in front for cardio, firmer in heel for lifts'
    ],
    images: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Graphite / Cyber Neon', 'Desert Tan / Olive', 'Triple Black'],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: 'prod-007',
    name: 'Aura Monolith Chunky Sneaker',
    slug: 'aura-monolith-chunky-sneaker',
    brand: 'Aura Luxe',
    category: 'Luxury',
    gender: 'Women',
    price: 245,
    originalPrice: 290,
    discount: 15,
    description: 'High-fashion sculpted architectural sole meets premium Italian calfskin suede. Elevated street style with an ultra-lightweight blown EVA sole platform.',
    features: [
      'Sculpted lightweight 2.2-inch elevated silhouette',
      'Supple Italian calfskin suede combined with technical mesh overlays',
      'Subtle debossed gold foil logo at tongue and heel pull',
      'Cushioned leather lining molds naturally to the foot',
      'Handcrafted in small artisan batches in Porto, Portugal'
    ],
    images: [
      'https://images.unsplash.com/photo-1512374382149-233c42b661ac?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Cream Cashmere / Camel Suede', 'Monochrome Black', 'Silver Mist / Pastel Taupe'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5'],
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: 'prod-008',
    name: 'Velo Urban Knit Slip-On',
    slug: 'velo-urban-knit-slip-on',
    brand: 'Velo Studio',
    category: 'Lifestyle',
    gender: 'Men',
    price: 98,
    originalPrice: 115,
    discount: 15,
    description: 'Effortless all-day convenience. Slip on in seconds with a 360-degree stretch sock knit upper, collapsible heel tab, and featherweight cloud EVA sole.',
    features: [
      'Engineered seamless 3D stretch rib knit conforms to foot shape',
      'Collapsible neoprene heel counter allows slide conversion',
      'Machine-washable removable insole with charcoal odor absorption',
      'Ultralight weight: only 6.2 oz per shoe',
      'Ideal for travel, commuting, airport security, and weekend errands'
    ],
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Heather Charcoal', 'Deep Navy Blue', 'Stone Khaki'],
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    rating: 4.6,
    reviewCount: 220,
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: 'prod-009',
    name: 'Stride Velocity Nitro Speed',
    slug: 'stride-velocity-nitro-speed',
    brand: 'Stride',
    category: 'Running',
    gender: 'Men',
    price: 155,
    description: 'Fast, responsive trainer built for tempo paces and 5K to half-marathon race days. High-energy return without an overly rigid feel.',
    features: [
      'Nitro-infused PEBA foam delivers 85% kinetic energy rebound',
      'Segmented rocker geometry promotes rapid turnover',
      'Targeted zonal lacing wings prevent tongue migration',
      'Durable blown rubber forefoot pods for extended mile longevity',
      'Reflective 360-degree elements for dusk and dawn visibility'
    ],
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Laser Yellow / Midnight', 'Frost White / Coral', 'Phantom Black'],
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    rating: 4.8,
    reviewCount: 174,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: 'prod-010',
    name: 'Velo Heritage Suede Low',
    slug: 'velo-heritage-suede-low',
    brand: 'Velo Studio',
    category: 'Lifestyle',
    gender: 'Women',
    price: 120,
    description: 'Vintage 70s track heritage reimagined in velvet-soft water-repellent suede, stitched serrated stripes, and a honeycomb crepe rubber sole.',
    features: [
      'Silky treated water-resistant split cow suede',
      'Vintage exposed foam tongue with woven archive label',
      'Low-profile flexible crepe gum sole with textured foxing',
      'Padded ankle collar lined with breathable terry cloth',
      'Includes two sets of laces: tonal suede flat laces and off-white woven'
    ],
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Earthy Matcha / Cream', 'Dusty Rose / Gum', 'Caramel Tan'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
    rating: 4.7,
    reviewCount: 133,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    id: 'prod-011',
    name: 'Apex TerraGrip Low Hiker',
    slug: 'apex-terragrip-low-hiker',
    brand: 'Apex Outdoor',
    category: 'Trail',
    gender: 'Unisex',
    price: 150,
    originalPrice: 170,
    discount: 12,
    description: 'Hybrid approach shoe and fast hiking champion. Durable Cordura ballistic ripstop construction with sticky rubber toe rand for scrambling rocks.',
    features: [
      'Cordura 1000D abrasion-proof ripstop textile',
      'Climbing-inspired to-the-toe lacing for micro-precision fit',
      'Sticky Megagrip climbing rubber toe cap for boulder approach',
      'Dual-compound EVA midsole absorbs shock on downhill descents',
      'Hydrophobic mesh dries 3x faster than traditional trail shoes'
    ],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Sedona Clay / Moss', 'Gunmetal / Electric Blue', 'Canyon Brown'],
    sizes: ['7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    rating: 4.8,
    reviewCount: 91,
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    id: 'prod-012',
    name: 'Volt Slam Dunk Air Low',
    slug: 'volt-slam-dunk-air-low',
    brand: 'Volt Athletic',
    category: 'Basketball',
    gender: 'Men',
    price: 145,
    description: 'Low-cut agility shoe engineered for fast guards and wing playmakers. Low center of gravity with razor-sharp lateral stopping power.',
    features: [
      'Low-cut sculpted collar provides full ankle freedom for sharp crossover cuts',
      'Encapsulated Zoom Air unit in forefoot generates springy energy bounce',
      'Radial multi-directional traction pattern bites clean or dusty hardwood',
      'Midfoot TPU containment clip prevents rollover during hard deceleration',
      'Lightweight structured composite upper with breathable mesh tongue'
    ],
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Bred Black / University Red', 'Glacier Ice White', 'Neon Cyber Pink'],
    sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    rating: 4.7,
    reviewCount: 110,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: 'prod-013',
    name: 'Aura Velvet Chelsea Bootie Sneaker',
    slug: 'aura-velvet-chelsea-bootie-sneaker',
    brand: 'Aura Luxe',
    category: 'Luxury',
    gender: 'Women',
    price: 260,
    description: 'Where contemporary Scandinavian minimalism meets high-fashion footwear. Water-resistant nubuck upper with elasticized twin gore panels on a cushioned marshmallow sole.',
    features: [
      'Waterproofed matte velvet nubuck leather',
      'Stretch ribbed elastic side goring for easy pull-on entry',
      'Ergonomic anatomical arch-support leather footbed',
      'Chunky geometric lightweight EVA lug outsole with 1.8-inch lift',
      'Reinforced grosgrain front and rear pull tabs'
    ],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512374382149-233c42b661ac?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Oatmeal Sand', 'Espresso Dark Brown', 'Midnight Jet Black'],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '10'],
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    id: 'prod-014',
    name: 'Stride Kids HyperSprint Dash',
    slug: 'stride-kids-hypersprint-dash',
    brand: 'Stride',
    category: 'Running',
    gender: 'Kids',
    price: 65,
    originalPrice: 80,
    discount: 18,
    description: 'Built for playground speed and all-day recess fun. Easy hook-and-loop velcro strap with elastic bungee laces, non-marking rubber outsoles, and machine-washable fabrics.',
    features: [
      'Dual closure: adjustable Hook-and-Loop power strap + bungee elastic laces',
      'Machine washable: toss directly in cold wash cycle and air dry',
      'Non-marking rubber tread won’t scuff gymnasium floors',
      'Reinforced rubber bumper over toe prevents blowouts from kicking',
      'Reflective side logos keep kids visible near roads'
    ],
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Electric Cobalt / Neon Lime', 'Berry Pink / Lavender', 'Stealth Charcoal'],
    sizes: ['1Y', '1.5Y', '2Y', '2.5Y', '3Y', '3.5Y', '4Y', '4.5Y', '5Y'],
    rating: 4.8,
    reviewCount: 154,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: 'prod-015',
    name: 'Velo Court Classic Canvas',
    slug: 'velo-court-classic-canvas',
    brand: 'Velo Studio',
    category: 'Lifestyle',
    gender: 'Unisex',
    price: 85,
    description: 'Breathable 12oz organic duck canvas tennis sneaker with vulcanized gum rubber sole and ortho-cushion insole. The ultimate lightweight summer sneaker.',
    features: [
      '12oz heavy-duty 100% organic cotton duck canvas',
      'Vulcanized natural gum rubber foxing tape and diamond waffle sole',
      'Arch-hugging PU molded insole for all-day boardwalk walking',
      'Nickeled brass eyelets with tonal woven cotton laces',
      'Vegan certified construction'
    ],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Raw Natural Canvas', 'Navy Blue', 'Olive Drab Green'],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    rating: 4.6,
    reviewCount: 205,
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: 'prod-016',
    name: 'Stride PaceMaker Recovery Slide',
    slug: 'stride-pacemaker-recovery-slide',
    brand: 'Stride',
    category: 'Training',
    gender: 'Unisex',
    price: 55,
    description: 'Post-run recovery slide with deep anatomical footbed cradle and max-cushion cloud foam. Relieves pressure on tired feet, joints, and lower back after grueling workouts.',
    features: [
      'Super-soft bio-based injection molded rebound EVA foam',
      'Deep heel cup cradles the foot and aligns the Achilles tendon',
      'High arch contour relieves plantar fasciitis tension',
      'Waterproof, buoyant, quick-drying, and odor-resistant',
      'Textured footbed gently massages the sole with every step'
    ],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: ['Bone Sand', 'Matte Black', 'Sage Green'],
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    rating: 4.9,
    reviewCount: 388,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  }
];
