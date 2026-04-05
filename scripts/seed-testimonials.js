// scripts/seed-testimonials.js
// Run: node scripts/seed-testimonials.js
// Inserts sample testimonials via Admin API

const testimonials = [
  {
    name: "Priya Sharma",
    rating: 5,
    review: "Amazing experience with NavSafar! The Manali trip was perfectly organized. Hotels were excellent and the guide was very knowledgeable. Will definitely book again!",
    trip: "Manali Adventure Package",
    location: "Delhi, India",
    travelDate: "March 2025",
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Rahul Verma",
    rating: 5,
    review: "Best travel agency I've ever used. The Goa beach package was exactly as described. No hidden costs, everything was transparent. Highly recommended!",
    trip: "Goa Beach Paradise",
    location: "Mumbai, India",
    travelDate: "February 2025",
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Anjali Patel",
    rating: 4,
    review: "Great service and amazing destinations. The Kerala backwaters experience was magical. Houseboat was clean and food was delicious. Only suggestion would be to include more activities in the package.",
    trip: "Kerala Backwaters",
    location: "Ahmedabad, India",
    travelDate: "January 2025",
    isApproved: true,
    isFeatured: false,
  },
  {
    name: "Vikram Singh",
    rating: 5,
    review: "Dubai trip was beyond expectations! NavSafar took care of everything from visas to local tours. The desert safari was the highlight of our trip. Everything was well organized and on time.",
    trip: "Dubai City Experience",
    location: "Jaipur, India",
    travelDate: "December 2024",
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Neha Gupta",
    rating: 5,
    review: "Perfect honeymoon planning! The Bali villa was romantic and private. NavSafar arranged everything beautifully. From airport pickups to candlelight dinner, every detail was taken care of. Made our special trip even more memorable!",
    trip: "Bali Honeymoon Special",
    location: "Bangalore, India",
    travelDate: "February 2025",
    isApproved: true,
    isFeatured: false,
  },
  {
    name: "Amit Kumar",
    rating: 4,
    review: "Good value for money. The Rajasthan tour covered all major attractions - Jaipur, Udaipur, Jodhpur. Guide was friendly and informative. Would have liked more free time for shopping in local markets.",
    trip: "Rajasthan Royal Tour",
    location: "Kolkata, India",
    travelDate: "January 2025",
    isApproved: true,
    isFeatured: false,
  },
  {
    name: "Smita Reddy",
    rating: 5,
    review: "Our family trip to Tirupati was seamless! NavSafar arranged special darshan tickets and accommodation was very good. The entire process was smooth even with senior citizens in our group. Highly recommend for pilgrimage tours.",
    trip: "Tirupati Pilgrimage Package",
    location: "Hyderabad, India",
    travelDate: "March 2025",
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Rajesh Khanna",
    rating: 5,
    review: "Booked a corporate trip to Andaman for 25 employees. Everything was perfectly managed - flights, hotels, activities. Team was very responsive. Looking forward to booking again for next year!",
    trip: "Andaman Corporate Retreat",
    location: "Chennai, India",
    travelDate: "December 2024",
    isApproved: true,
    isFeatured: false,
  },
  {
    name: "Kavya Iyer",
    rating: 5,
    review: "As a solo female traveler, I was a bit nervous about the Leh Ladakh trip. But NavSafar made it so safe and comfortable. Our tour leader was amazing and the group was fantastic. One of the best experiences of my life!",
    trip: "Leh Ladakh Adventure",
    location: "Pune, India",
    travelDate: "July 2024",
    isApproved: true,
    isFeatured: false,
  },
];

async function seed() {
  try {
    // Check if Next.js app is running
    const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    console.log("🌱 Starting testimonials seed...\n");
    console.log(`📡 API URL: ${API_BASE}`);
    console.log(`📝 Seeding ${testimonials.length} testimonials...\n`);

    let success = 0;
    let failed = 0;

    for (const [index, testimonial] of testimonials.entries()) {
      try {
        console.log(`Seeding ${index + 1}/${testimonials.length}: ${testimonial.name}`);

        const response = await fetch(`${API_BASE}/api/admin/testimonials`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testimonial),
        });

        if (response.ok) {
          console.log(`   ✅ Success: ${testimonial.name}`);
          success++;
        } else {
          const error = await response.json();
          console.log(`   ❌ Failed: ${testimonial.name} - ${error.message || response.statusText}`);
          failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`   ❌ Error: ${testimonial.name} - ${error.message}`);
        failed++;
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Seeding complete!");
    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (success > 0) {
      console.log("🌐 Next steps:");
      console.log("   1. Visit: http://localhost:3000/admin/testimonials");
      console.log("   2. You should see the seeded testimonials");
      console.log("   3. Visit homepage: http://localhost:3000");
      console.log("   4. Testimonials will be displayed automatically\n");
    }

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
