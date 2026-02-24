// Tour packages data model for travel agency
export const tourPackagesModel = [
    {
        id: 1,
        name: "Dubai Luxury Package",
        category: "international",
        price: "₹45,999",
        originalPrice: "₹65,999",
        duration: "5 Days / 4 Nights",
        description: "Experience luxury in the city of gold with premium hotels and exclusive experiences",
        inclusions: [
            "4-star hotel accommodation",
            "Daily breakfast",
            "Desert Safari with BBQ dinner",
            "Dubai city tour",
            "Burj Khalifa tickets",
            "Airport transfers",
            "Travel insurance"
        ],
        exclusions: [
            "Airfare",
            "Lunch and dinner",
            "Personal expenses",
            "Visa fees"
        ],
        highlights: ["Burj Khalifa", "Dubai Mall", "Desert Safari", "Palm Jumeirah"],
        image: "/packages/dubai-luxury.jpg",
        rating: 4.8,
        reviews: 245,
        discount: 30,
        keywords: "dubai, luxury, package, burj khalifa, desert safari"
    },
    {
        id: 2,
        name: "Singapore Adventure",
        category: "international",
        price: "₹38,999",
        originalPrice: "₹52,999",
        duration: "4 Days / 3 Nights",
        description: "Fun-filled adventure in the lion city with theme parks and city tours",
        inclusions: [
            "3-star hotel accommodation",
            "Daily breakfast",
            "Universal Studios tickets",
            "Sentosa Island tour",
            "City orientation tour",
            "Airport transfers",
            "Travel insurance"
        ],
        exclusions: [
            "Airfare",
            "Lunch and dinner",
            "Personal expenses",
            "Visa fees"
        ],
        highlights: ["Marina Bay Sands", "Sentosa Island", "Universal Studios", "Gardens by the Bay"],
        image: "/packages/singapore-adventure.jpg",
        rating: 4.7,
        reviews: 189,
        discount: 26,
        keywords: "singapore, adventure, universal studios, sentosa, marina bay"
    },
    {
        id: 3,
        name: "Switzerland Alpine Paradise",
        category: "international",
        price: "₹1,25,999",
        originalPrice: "₹1,65,999",
        duration: "7 Days / 6 Nights",
        description: "Breathtaking Alpine experience with scenic train journeys and mountain excursions",
        inclusions: [
            "4-star hotel accommodation",
            "Daily breakfast",
            "Swiss Travel Pass",
            "Jungfraujoch excursion",
            "Lake cruise",
            "Airport transfers",
            "Travel insurance"
        ],
        exclusions: [
            "Airfare",
            "Lunch and dinner",
            "Personal expenses",
            "Visa fees"
        ],
        highlights: ["Interlaken", "Lucerne", "Zurich", "Jungfraujoch"],
        image: "/packages/switzerland-alpine.jpg",
        rating: 4.9,
        reviews: 156,
        discount: 24,
        keywords: "switzerland, alpine, mountains, jungfraujoch, interlaken"
    },
    {
        id: 4,
        name: "Goa Beach Paradise",
        category: "domestic",
        price: "₹15,999",
        originalPrice: "₹22,999",
        duration: "3 Days / 2 Nights",
        description: "Relaxing beach getaway with water sports and vibrant nightlife",
        inclusions: [
            "3-star resort accommodation",
            "Daily breakfast",
            "North Goa city tour",
            "Water sports session",
            "Casino entry",
            "Airport transfers",
            "Travel insurance"
        ],
        exclusions: [
            "Airfare/Train fare",
            "Lunch and dinner",
            "Personal expenses",
            "Adventure activities"
        ],
        highlights: ["Baga Beach", "Old Goa", "Dudhsagar Falls", "Casino Cruises"],
        image: "/packages/goa-beach.jpg",
        rating: 4.6,
        reviews: 312,
        discount: 30,
        keywords: "goa, beach, water sports, casino, baga"
    },
    {
        id: 5,
        name: "Kerala Backwaters Bliss",
        category: "domestic",
        price: "₹18,999",
        originalPrice: "₹26,999",
        duration: "5 Days / 4 Nights",
        description: "Serene backwater experience with houseboat stay and hill station exploration",
        inclusions: [
            "Houseboat stay (1 night)",
            "Hotel accommodation (3 nights)",
            "Daily breakfast",
            "Houseboat meals",
            "Munnar sightseeing",
            "Airport transfers",
            "Travel insurance"
        ],
        exclusions: [
            "Airfare/Train fare",
            "Lunch and dinner (hotel)",
            "Personal expenses",
            "Boat rides"
        ],
        highlights: ["Alleppey Backwaters", "Munnar", "Kovalam Beach", "Thekkady"],
        image: "/packages/kerala-backwaters.jpg",
        rating: 4.8,
        reviews: 278,
        discount: 30,
        keywords: "kerala, backwaters, houseboat, munnar, alleppey"
    }
];

export default tourPackagesModel;
