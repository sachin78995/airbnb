const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const user = require("./models/user");

// MongoDB connection
const dbUrl = "mongodb+srv://sachinsankole6:3PwEgvfqb3azlGSP@cluster0.kbkpcxx.mongodb.net/wanderlust?retryWrites=true&w=majority";

// Dummy data for listings
const dummyListings = [
  {
    title: "Luxury Beachfront Villa",
    description: "Stunning beachfront villa with panoramic ocean views. This 4-bedroom, 3-bathroom property features a private pool, gourmet kitchen, and direct beach access. Perfect for family vacations or romantic getaways.",
    image: {
      filename: "beachfront_villa",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Beachfront_Bungalow_ybmfxb.jpg"
    },
    price: 350,
    location: "Maldives",
    country: "Maldives",
    category: "Beachfront",
    rating: 4.8,
    reviews: []
  },
  {
    title: "Mountain Retreat Cabin",
    description: "Cozy cabin nestled in the heart of the mountains. This 2-bedroom retreat offers breathtaking views, a wood-burning fireplace, and hiking trails right outside your door. Perfect for nature lovers and outdoor enthusiasts.",
    image: {
      filename: "mountain_cabin",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397823/mountainsideretreat_74_mtg7na.jpg"
    },
    price: 180,
    location: "Swiss Alps",
    country: "Switzerland",
    category: "Mountains",
    rating: 4.6,
    reviews: []
  },
  {
    title: "Downtown Luxury Apartment",
    description: "Modern apartment in the heart of the city. This 3-bedroom, 2-bathroom property features floor-to-ceiling windows, high-end appliances, and a rooftop terrace with city views. Walking distance to restaurants, shops, and attractions.",
    image: {
      filename: "luxury_apartment",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Rooftop_Penthouse_rn0kxd.jpg"
    },
    price: 250,
    location: "New York City",
    country: "USA",
    category: "Iconic Cities",
    rating: 4.7,
    reviews: []
  },
  {
    title: "Historic Castle Estate",
    description: "Experience living in a piece of history. This 5-bedroom castle estate dates back to the 15th century and has been lovingly restored with modern amenities while preserving its historic charm. Features include a moat, drawbridge, and extensive gardens.",
    image: {
      filename: "castle_estate",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Luxury_Treehouse_aokiap.webp"
    },
    price: 500,
    location: "Scottish Highlands",
    country: "Scotland",
    category: "Castles",
    rating: 4.9,
    reviews: []
  },
  {
    title: "Cozy Studio in Paris",
    description: "Charming studio apartment in the heart of Paris. This perfectly appointed space features a fully equipped kitchen, comfortable sleeping area, and a balcony with views of the city. Located in a historic building in the Marais district.",
    image: {
      filename: "paris_studio",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/ozy_Studio_in_Paris_hwbhzm.jpg"
    },
    price: 150,
    location: "Paris",
    country: "France",
    category: "Iconic Cities",
    rating: 4.5,
    reviews: []
  },
  {
    title: "Luxury Treehouse",
    description: "Unique treehouse experience in the rainforest. This 2-bedroom, 2-bathroom property is built around a 200-year-old tree and offers stunning views of the surrounding forest. Features include a suspended bridge, outdoor shower, and wildlife viewing deck.",
    image: {
      filename: "luxury_treehouse",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/images_yg8t1b.jpg"
    },
    price: 220,
    location: "Costa Rica",
    country: "Costa Rica",
    category: "Unique Stays",
    rating: 4.8,
    reviews: []
  },
  {
    title: "Beachfront Bungalow",
    description: "Relaxing beachfront bungalow with ocean views. This 1-bedroom, 1-bathroom property features a private patio, hammock, and direct access to the beach. Perfect for couples or solo travelers looking for a peaceful getaway.",
    image: {
      filename: "beach_bungalow",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Beachfront_Bungalow_ybmfxb.jpg"
    },
    price: 120,
    location: "Bali",
    country: "Indonesia",
    category: "Beachfront",
    rating: 4.6,
    reviews: []
  },
  {
    title: "Ski Chalet",
    description: "Luxurious ski chalet with stunning mountain views. This 4-bedroom, 3-bathroom property features a hot tub, sauna, and ski storage room. Located just steps from the slopes and a short drive from the village center.",
    image: {
      filename: "ski_chalet",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397823/mountainsideretreat_74_mtg7na.jpg"
    },
    price: 400,
    location: "Aspen",
    country: "USA",
    category: "Mountains",
    rating: 4.9,
    reviews: []
  },
  {
    title: "Rooftop Penthouse",
    description: "Stunning rooftop penthouse with 360-degree city views. This 3-bedroom, 3-bathroom property features a private terrace, gourmet kitchen, and high-end finishes throughout. Located in a prime downtown location.",
    image: {
      filename: "rooftop_penthouse",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Rooftop_Penthouse_rn0kxd.jpg"
    },
    price: 450,
    location: "Los Angeles",
    country: "USA",
    category: "Iconic Cities",
    rating: 4.7,
    reviews: []
  },
  {
    title: "Mediterranean Villa",
    description: "Beautiful Mediterranean villa with sea views. This 5-bedroom, 4-bathroom property features a private pool, extensive gardens, and a terrace perfect for outdoor dining. Located in a quiet village with easy access to beaches and attractions.",
    image: {
      filename: "mediterranean_villa",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397821/Mediterranean_Villa_zcv8xo.jpg"
    },
    price: 380,
    location: "Santorini",
    country: "Greece",
    category: "Beachfront",
    rating: 4.8,
    reviews: []
  },
  {
    title: "Luxury Yacht",
    description: "Experience the ultimate luxury on this 50-foot yacht. This floating home features 3 bedrooms, 2 bathrooms, a fully equipped kitchen, and multiple deck areas for sunbathing and dining. Available for weekly charters in the Mediterranean.",
    image: {
      filename: "luxury_yacht",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397822/Luxury_Yacht_rfkesd.jpg"
    },
    price: 1200,
    location: "French Riviera",
    country: "France",
    category: "Unique Stays",
    rating: 4.9,
    reviews: []
  },
  {
    title: "Desert Oasis",
    description: "Unique desert oasis with stunning views. This 2-bedroom, 2-bathroom property features a private pool, outdoor kitchen, and extensive deck areas for stargazing. Located in a remote area with minimal light pollution for the best stargazing experience.",
    image: {
      filename: "desert_oasis",
      url: "https://res.cloudinary.com/dwbqyxt7r/image/upload/v1745397821/Desert_Oasis_v5h46u.jpg"
    },
    price: 280,
    location: "Sedona",
    country: "USA",
    category: "Unique Stays",
    rating: 4.7,
    reviews: []
  }
];

// Dummy reviews
const dummyReviews = [
  {
    comment: "Amazing place! The views were breathtaking and the amenities were top-notch.",
    rating: 5
  },
  {
    comment: "Perfect location and very comfortable. Would definitely stay again!",
    rating: 4
  },
  {
    comment: "Beautiful property but a bit noisy at night due to nearby construction.",
    rating: 3
  },
  {
    comment: "Exceeded all expectations. The host was incredibly helpful and the place was spotless.",
    rating: 5
  },
  {
    comment: "Great value for money. Clean and comfortable with all the essentials.",
    rating: 4
  }
];

// Connect to MongoDB and seed the database
async function seedDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    // Clear existing listings and reviews
    await Listing.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing data");

    // Create reviews
    const createdReviews = await Review.insertMany(dummyReviews);
    console.log("Created reviews");

    // Add reviews to listings
    for (let listing of dummyListings) {
      // Randomly select 2-4 reviews for each listing
      const numReviews = Math.floor(Math.random() * 3) + 2;
      const selectedReviews = [];
      
      for (let i = 0; i < numReviews; i++) {
        const randomReview = createdReviews[Math.floor(Math.random() * createdReviews.length)];
        selectedReviews.push(randomReview._id);
      }
      
      listing.reviews = selectedReviews;
    }

    // Create listings
    await Listing.insertMany(dummyListings);
    console.log("Created listings");

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDB(); 