const BOUTIQUES_DATA = [

  {
    id: "jharokha-heritage",
    name: "Jharokha Heritage",
    city: "Mumbai",
    neighborhood: "Colaba",
    rating: 4.9,
    reviewsCount: 124,
    aesthetic: "Heritage Indian & Royal Handloom",
    story: "Founded by Kavita Sen, Jharokha Heritage is dedicated to preserving centuries-old weaving techniques of Benares and Chanderi. Every piece is woven over weeks, using pure Mulberry silk and real silver zari thread, reflecting the grandeur of royal Indian textiles.",
    designer: "Kavita Sen",
    logoColor: "#C5A880",
    coverImage: "assets/images/boutique_jharokha_cover.jpg",
    inventory: [
      {
        id: "jh-varanasi-silk-saree",
        name: "Varanasi Kadwa Silk Saree",
        price: 85000,
        category: "Sarees",
        fabric: "100% Pure Katan Silk, Hand-spun",
        craftsmanship: "Traditional Kadwa weave with gold & silver zari motifs",
        customizable: true,
        leadTime: "4 - 6 weeks",
        images: ["assets/images/varanasi_silk_saree.jpg"],
        description: "A timeless masterpiece in royal crimson. This pure Katan silk saree features intricate floral bel (creepers) hand-woven using the complex Kadwa technique where each motif is woven individually.",
        sizes: ["Free Size (Includes unstitched blouse)"]
      },
      {
        id: "jh-zardozi-velvet-lehenga",
        name: "Zardozi Embroidered Velvet Lehenga",
        price: 185000,
        category: "Lehengas",
        fabric: "Premium Micro-Velvet, Silk Linings",
        craftsmanship: "Handmade Zardozi embroidery with dabka, sequins, and pearls",
        customizable: true,
        leadTime: "8 - 10 weeks",
        images: ["assets/images/zardozi_lehenga.jpg"],
        description: "Designed for the modern elite bride, this deep emerald velvet lehenga is embellished with dense heritage zardozi patterns depicting Mughal archways and floral motifs.",
        sizes: ["S", "M", "L", "Custom Fit"]
      },
      {
        id: "jh-chanderi-anarkali",
        name: "Gulbahar Chanderi Anarkali Set",
        price: 45000,
        category: "Indo-Western",
        fabric: "Chanderi Silk-Cotton, Organza Dupatta",
        craftsmanship: "Muted gold pita-work and delicate hand-block print",
        customizable: true,
        leadTime: "2 weeks",
        images: ["assets/images/chanderi_anarkali.jpg"],
        description: "An ivory Anarkali set featuring 24 panels of sheer elegance. Accented with pita-work along the neck and sleeves, paired with an organza dupatta adorned with hand-painted roses.",
        sizes: ["S", "M", "L"]
      }
    ]
  },
  {
    id: "shunya-design-studio",
    name: "Shunya Design Studio",
    city: "Mumbai",
    neighborhood: "Juhu",
    rating: 4.8,
    reviewsCount: 89,
    aesthetic: "Contemporary Minimalist & Structural",
    story: "Shunya redefines premium Indian apparel by stripping away excess ornamentation. Under designer Rohan Mehta, the studio crafts structural garments, architectural drapes, and monochrome co-ords, celebrating silence in design.",
    designer: "Rohan Mehta",
    logoColor: "#1C1917",
    coverImage: "assets/images/boutique_shunya_cover.jpg",
    inventory: [
      {
        id: "sd-structural-drape-saree",
        name: "Architectural Drape Saree-Gown",
        price: 58000,
        category: "Indo-Western",
        fabric: "Italian Crepe, Satin Lining",
        craftsmanship: "Precision hand-draped panels and hidden boning structure",
        customizable: true,
        leadTime: "3 weeks",
        images: ["assets/images/drape_saree_gown.jpg"],
        description: "A revolutionary take on the classic saree. Pre-draped with architectural pleats and a structured corset-style bodice, this gown is perfect for high-profile cocktail evenings.",
        sizes: ["XS", "S", "M", "L", "Custom Fit"]
      },
      {
        id: "sd-rawsilk-pantsuit",
        name: "Onyx Raw Silk Pantsuit",
        price: 38000,
        category: "Co-ords",
        fabric: "100% Handloom Bhagalpur Raw Silk",
        craftsmanship: "Tailored structured shoulders, hand-carved horn buttons",
        customizable: true,
        leadTime: "2 - 3 weeks",
        images: ["assets/images/rawsilk_pantsuit.jpg"],
        description: "Power dressing meets heritage fabric. This double-breasted blazer and straight-fit trousers set features raw silk's natural slub texture in a solid onyx black.",
        sizes: ["S", "M", "L"]
      }
    ]
  },
  {
    id: "roop-milan-luxury",
    name: "Roop Milan",
    city: "Mumbai",
    neighborhood: "Bandra",
    rating: 4.7,
    reviewsCount: 156,
    aesthetic: "Modern Fusion & Festive Edit",
    story: "A Bandra staple catering to Bollywood elites and fashion connoisseurs. Roop Milan bridges the gap between classic silhouettes and experimental cuts, known widely for their vibrant hues and light fabrics.",
    designer: "Meera & Sana",
    logoColor: "#D97706",
    coverImage: "assets/images/boutique_roopmilan_cover.jpg",
    inventory: [
      {
        id: "rm-sharara-festive",
        name: "Miraya Georgette Sharara Set",
        price: 49500,
        category: "Indo-Western",
        fabric: "Premium Silk Georgette",
        craftsmanship: "Gota patti borders and mirror-work embroidery",
        customizable: true,
        leadTime: "2 weeks",
        images: ["assets/images/miraya_sharara.jpg"],
        description: "A sunset-yellow flared sharara paired with a short peplum kurta. Decorated with authentic Rajasthani gota patti detailing and mirrors that catch the festive lights.",
        sizes: ["S", "M", "L", "XL"]
      }
    ]
  },


  {
    id: "mehrab-couture",
    name: "Mehrab Couture",
    city: "Delhi",
    neighborhood: "Mehrauli",
    rating: 5.0,
    reviewsCount: 78,
    aesthetic: "Mughal Craftsmanship & Bridal Heavyweight",
    story: "Overlooking the Qutub Minar, Mehrab Couture is a sanctuary of ultimate luxury. Designer Farhan Alvi works with third-generation master embroiderers to create bespoke wedding trousseaus and heavy sherwanis that are collector's items.",
    designer: "Farhan Alvi",
    logoColor: "#78350F",
    coverImage: "assets/images/boutique_mehrab_cover.jpg",
    inventory: [
      {
        id: "mc-kashmiri-sherwani",
        name: "Kashmiri Aari Embroidered Sherwani",
        price: 210000,
        category: "Sherwanis",
        fabric: "Pure Cashmere Blend Wool & Silk",
        craftsmanship: "All-over Kashmiri Aari hand embroidery with silk threads",
        customizable: true,
        leadTime: "10 - 12 weeks",
        images: ["assets/images/kashmiri_sherwani.jpg"],
        description: "An exceptional beige sherwani featuring dense Kashmiri hand embroidery. Represents over 350 hours of hand craftsmanship, designed for groom royalty.",
        sizes: ["M", "L", "Custom Fit"]
      },
      {
        id: "mc-royal-ivory-lehenga",
        name: "Qutub Ivory Zardozi Lehenga",
        price: 320000,
        category: "Lehengas",
        fabric: "Pure Silk Matka & Organza",
        craftsmanship: "Heavy antique gold bullion zardozi embroidery with fine seed pearls",
        customizable: true,
        leadTime: "12 - 16 weeks",
        images: ["assets/images/qutub_lehenga.jpg"],
        description: "The epitome of bridal luxury. An ivory silk matka lehenga featuring classical architectural borders inspired by Mughal lattices, encrusted with seed pearls and antique gold zardozi.",
        sizes: ["Custom Fit Only"]
      }
    ]
  },
  {
    id: "dori-dhaga",
    name: "Dori & Dhaga",
    city: "Delhi",
    neighborhood: "Shahpur Jat",
    rating: 4.8,
    reviewsCount: 112,
    aesthetic: "Artisanal Pastel & Light Festive",
    story: "A delightful boutique focused on light, breathing outfits. Dori & Dhaga works closely with weaver cooperatives in Madhya Pradesh and Rajasthan to bring soft pastel hues, hand-blocks, and delicate thread work to urban wardrobes.",
    designer: "Ananya Roy",
    logoColor: "#F472B6",
    coverImage: "assets/images/boutique_doridhaga_cover.jpg",
    inventory: [
      {
        id: "dd-pastel-anarkali",
        name: "Lilac Whisper Organza Anarkali",
        price: 32000,
        category: "Indo-Western",
        fabric: "Pure Silk-Organza, Cotton Lining",
        craftsmanship: "Hand-painted lilac blossoms and scalloped lace borders",
        customizable: true,
        leadTime: "10 days",
        images: ["assets/images/lilac_anarkali.jpg"],
        description: "Light as a breeze. This pastel lilac dress spins gracefully, boasting hand-painted floral motifs created by local fine artists and delicate lace linings.",
        sizes: ["XS", "S", "M", "L"]
      },
      {
        id: "dd-chanderi-jacket-set",
        name: "Mint Chanderi Jacket & Slip Pants",
        price: 28000,
        category: "Co-ords",
        fabric: "Chanderi Silk, Bamboo Cotton Pants",
        craftsmanship: "Hand-embroidered thread work around collar and sleeves",
        customizable: true,
        leadTime: "2 weeks",
        images: ["assets/images/mint_jacket_set.jpg"],
        description: "A sophisticated summer co-ord featuring a long Chanderi silk jacket with subtle floral hand-embroidery, worn over straight linen pants.",
        sizes: ["S", "M", "L"]
      }
    ]
  },


  {
    id: "kora-silk-house",
    name: "Kora Silk House",
    city: "Bengaluru",
    neighborhood: "Indiranagar",
    rating: 4.9,
    reviewsCount: 198,
    aesthetic: "Authentic South-Indian Silk Heritage",
    story: "A temple of pure silk. Kora Silk House brings master weavers from Kanchipuram and Dharmavaram directly to South India's fashion capital. Famed for heirloom-quality sarees that are passed down generations.",
    designer: "S. Swaminathan",
    logoColor: "#059669",
    coverImage: "assets/images/boutique_kora_cover.jpg",
    inventory: [
      {
        id: "ks-royal-kanjeevaram",
        name: "Swarnamaya Kanjeevaram Silk Saree",
        price: 110000,
        category: "Sarees",
        fabric: "Double-warp Mulberry Silk, Pure Gold Zari",
        craftsmanship: "Handloom woven, traditional Korvai border",
        customizable: false,
        leadTime: "In Stock (Ready to ship)",
        images: ["assets/images/royal_kanjeevaram.jpg"],
        description: "Draped in gold. This ultimate Kanjeevaram is woven using the Korvai technique, resulting in a distinct, heavy crimson-red border and a body shimmering with gold zari geometric temple designs.",
        sizes: ["Free Size (Includes unstitched blouse)"]
      },
      {
        id: "ks-maharani-brocade-saree",
        name: "Maharani Shikargah Silk Brocade Saree",
        price: 95000,
        category: "Sarees",
        fabric: "Pure Silk with antique silver border threads",
        craftsmanship: "Intricate Shikargah (hunting scene) weave",
        customizable: false,
        leadTime: "In Stock (Ready to ship)",
        images: ["assets/images/shikargah_saree.jpg"],
        description: "A deep navy-blue brocade saree capturing royal hunting heritage. Animals, birds, and forest creepers are intricately woven in antique gold and silver threads.",
        sizes: ["Free Size (Includes unstitched blouse)"]
      }
    ]
  },
  {
    id: "tanabana-sustainable",
    name: "Tanabana Studio",
    city: "Bengaluru",
    neighborhood: "Lavelle Road",
    rating: 4.6,
    reviewsCount: 65,
    aesthetic: "Eco-Luxe, Khadi & Sustainable Craft",
    story: "Tanabana proves that premium luxury fashion can be environmentally conscious. They use naturally dyed yarns, cruelty-free peace silk, and hand-spun khadi to create silhouettes tailored for urban ease.",
    designer: "Nisha Varma",
    logoColor: "#0F766E",
    coverImage: "assets/images/boutique_tanabana_cover.jpg",
    inventory: [
      {
        id: "tb-peace-silk-dress",
        name: "Ahimsa Silk Tiered Maxi Dress",
        price: 34000,
        category: "Indo-Western",
        fabric: "100% Organic Ahimsa (Peace) Silk",
        craftsmanship: "Natural indigo tie-dye, manually pleated tiers",
        customizable: true,
        leadTime: "2 - 3 weeks",
        images: ["assets/images/ahimsa_silk_dress.jpg"],
        description: "Eco-luxury at its best. Crafted from hand-spun silk obtained without harming the cocoons, dyed in organic indigo, and shaped into a beautiful flowing tiered maxi dress.",
        sizes: ["XS", "S", "M", "L"]
      }
    ]
  }
];

const ORDERS_DATA = [
  {
    orderId: "PHNV-874291",
    customerName: "Kareena Kapoor",
    email: "kareena@kapoor.com",
    phone: "+91 99999 88888",
    billingAddress: {
      address: "Fortune Heights, Bandra West",
      city: "Mumbai",
      pincode: "400050"
    },
    items: [
      {
        product: {
          id: "sd-structural-drape-saree",
          name: "Architectural Drape Saree-Gown",
          price: 58000,
          category: "Indo-Western",
          fabric: "Italian Crepe, Satin Lining",
          craftsmanship: "Precision hand-draped panels and hidden boning structure",
          customizable: true,
          leadTime: "3 weeks",
          images: ["assets/images/drape_saree_gown.jpg"],
          description: "A revolutionary take on the classic saree. Pre-draped with architectural pleats and a structured corset-style bodice, this gown is perfect for high-profile cocktail evenings."
        },
        boutique: {
          id: "shunya-design-studio",
          name: "Shunya Design Studio",
          city: "Mumbai",
          neighborhood: "Juhu",
          designer: "Rohan Mehta"
        },
        size: "M"
      }
    ],
    subtotal: 58000,
    serviceFee: 2900,
    total: 60900,
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    paymentId: "pay_Hk8D2ks91LaP",
    paymentStatus: "Completed",
    orderStatus: "Customization In Progress",
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    timeline: [
      { status: "Order Confirmed", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Payment Verified", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1000), completed: true },
      { status: "Boutique Processing", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Customization In Progress", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Quality Check", date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), completed: false },
      { status: "Shipped", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), completed: false },
      { status: "Delivered", date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), completed: false }
    ]
  },
  {
    orderId: "PHNV-295104",
    customerName: "Alia Bhatt",
    email: "alia@bhatt.com",
    phone: "+91 98222 11111",
    billingAddress: {
      address: "Silver Beach Apartments, Juhu",
      city: "Mumbai",
      pincode: "400049"
    },
    items: [
      {
        product: {
          id: "jh-chanderi-anarkali",
          name: "Gulbahar Chanderi Anarkali Set",
          price: 45000,
          category: "Indo-Western",
          fabric: "Chanderi Silk-Cotton, Organza Dupatta",
          craftsmanship: "Muted gold pita-work and delicate hand-block print",
          customizable: true,
          leadTime: "2 weeks",
          images: ["assets/images/chanderi_anarkali.jpg"],
          description: "An ivory Anarkali set featuring 24 panels of sheer elegance. Accented with pita-work along the neck and sleeves, paired with an organza dupatta adorned with hand-painted roses."
        },
        boutique: {
          id: "jharokha-heritage",
          name: "Jharokha Heritage",
          city: "Mumbai",
          neighborhood: "Colaba",
          designer: "Kavita Sen"
        },
        size: "S"
      }
    ],
    subtotal: 45000,
    serviceFee: 2250,
    total: 47250,
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    paymentId: "pay_Jn2L9am18KdQ",
    paymentStatus: "Completed",
    orderStatus: "Boutique Processing",
    estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    timeline: [
      { status: "Order Confirmed", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Payment Verified", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1000), completed: true },
      { status: "Boutique Processing", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), completed: true },
      { status: "Customization In Progress", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), completed: false },
      { status: "Quality Check", date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), completed: false },
      { status: "Shipped", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), completed: false },
      { status: "Delivered", date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), completed: false }
    ]
  }
];


if (typeof module !== "undefined" && module.exports) {
  module.exports = { BOUTIQUES_DATA, ORDERS_DATA };
}

