"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

const serviceOptions = [
  "Luxury Hotels",
  "Flights",
  "Private Cab",
  "Sightseeing",
  "Visa Assistance",
  "Travel Insurance",
];

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    departureCity: "",
    tripCategory: "Luxury Holiday",
    travelType: "International",
    destination: "",
    travelDate: "",
    nights: "",
    travellers: "",
    hotelCategory: "5 Star",
    services: [],
    budget: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Check for pre-filled journey data
  useEffect(() => {
    const selectedJourney = localStorage.getItem('selectedJourney');
    if (selectedJourney) {
      const journey = JSON.parse(selectedJourney);
      setFormData(prev => ({
        ...prev,
        destination: journey.location,
        tripCategory: journey.category,
        nights: journey.duration.includes('Days') ? journey.duration.split(' ')[0] : "",
        travellers: journey.groupSize.includes('People') ? journey.groupSize.split(' ')[0] : "",
        message: `Interested in: ${journey.title} - ${journey.description.substring(0, 100)}...`
      }));
      // Clear the stored journey after using it
      localStorage.removeItem('selectedJourney');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const servicesText =
      formData.services.length > 0
        ? formData.services.join(", ")
        : "Not specified";

    const message =
      `🌟 *New Luxury Travel Enquiry* 🌟%0A%0A` +
      `👤 *Name:* ${formData.fullName}%0A` +
      `📱 *Phone:* ${formData.phone}%0A` +
      `📧 *Email:* ${formData.email || "Not provided"}%0A` +
      `🛫 *Departure City:* ${formData.departureCity || "Not specified"}%0A` +
      `🏷️ *Trip Category:* ${formData.tripCategory}%0A` +
      `✈️ *Travel Type:* ${formData.travelType}%0A` +
      `🌍 *Destination:* ${formData.destination || "Not specified"}%0A` +
      `📅 *Travel Date:* ${formData.travelDate || "Not specified"}%0A` +
      `🌙 *Nights:* ${formData.nights || "Not specified"}%0A` +
      `👥 *Travellers:* ${formData.travellers || "Not specified"}%0A` +
      `🏨 *Hotel Category:* ${formData.hotelCategory}%0A` +
      `🎯 *Services Required:* ${servicesText}%0A` +
      `💰 *Budget:* ${formData.budget || "Not specified"}%0A` +
      `📝 *Additional Requirements:* ${formData.message || "None"}%0A%0A` +
      `--------------------`;

    const whatsappUrl = `https://wa.me/918700750589?text=${message}`;
    window.open(whatsappUrl, "_blank");

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        departureCity: "",
        tripCategory: "Luxury Holiday",
        travelType: "International",
        destination: "",
        travelDate: "",
        nights: "",
        travellers: "",
        hotelCategory: "5 Star",
        services: [],
        budget: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-b from-gray-50 to-[#0B1C2D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 font-['Playfair_Display'] md:text-5xl text-4xl font-bold text-[#0B1C2D] ">
            Travel Enquiry
          </h1>
          <p className="font-['Inter'] md:text-lg text-gray-700">
            Let us craft your perfect journey with personalized attention to every detail
          </p>
        </motion.div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-5 text-green-800 border border-green-200 shadow-lg"
          >
            <CheckCircle2 size={28} />
            <div>
              <p className="font-semibold">
                Thank you! Your luxury travel enquiry has been sent successfully.
              </p>
              <p className="text-sm">
                We'll contact you shortly on WhatsApp.
              </p>
            </div>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-xl text-black"
        >
           <div className="space-y-6 flex flex-wrap gap-2">
            {/* Full Name */}
            <div className="md:w-[45%] w-full">
              <label
                htmlFor="fullName"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div className="md:w-[45%] w-full gap-4">
              <label
                htmlFor="phone"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Email */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="your@email.com"
              />
            </div>

            {/* Departure City */}
            <div className="md:w-1/2 w-full">
              <label
                htmlFor="departureCity"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Departure City
              </label>
              <input
                type="text"
                id="departureCity"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Delhi, Mumbai, Bangalore"
              />
            </div>

            {/* Trip Category & Travel Type - Side by Side */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="tripCategory"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Trip Category
                </label>
                <select
                  id="tripCategory"
                  name="tripCategory"
                  value={formData.tripCategory}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="Luxury Holiday">Luxury Holiday</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Family Vacation">Family Vacation</option>
                  <option value="Group Tour">Group Tour</option>
                  <option value="Corporate Travel">Corporate Travel</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="travelType"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Travel Type
                </label>
                <select
                  id="travelType"
                  name="travelType"
                  value={formData.travelType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="md:w-1/2 w-full">
              <label
                htmlFor="destination"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Preferred Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Maldives, Switzerland, Kerala"
              />
            </div>

            {/* Travel Date & Hotel Category - Side by Side */}
            <div className="grid gap-6 sm:grid-cols-2 ">
              <div>
                <label
                  htmlFor="travelDate"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Travel Date
                </label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label
                  htmlFor="hotelCategory"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Hotel Category
                </label>
                <select
                  id="hotelCategory"
                  name="hotelCategory"
                  value={formData.hotelCategory}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="3 Star">3 Star</option>
                  <option value="4 Star">4 Star</option>
                  <option value="5 Star">5 Star</option>
                  <option value="Luxury Resort">Luxury Resort</option>
                </select>
              </div>
            </div>

            {/* Nights & Travellers - Side by Side */}
            <div className="grid gap-6 sm:grid-cols-2 w-full">
              <div>
                <label
                  htmlFor="nights"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Number of Nights
                </label>
                <input
                  type="number"
                  id="nights"
                  name="nights"
                  min="1"
                  value={formData.nights}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="5"
                />
              </div>

              <div>
                <label
                  htmlFor="travellers"
                  className="mb-2 block font-['Inter'] font-semibold text-gray-700"
                >
                  Number of Travellers
                </label>
                <input
                  type="number"
                  id="travellers"
                  name="travellers"
                  min="1"
                  value={formData.travellers}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="2"
                />
              </div>
            </div>

            {/* Services Required */}
            <div className="w-full">
              <label className="mb-3 block font-['Inter'] font-semibold text-gray-700">
                Services Required
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-amber-300 hover:bg-amber-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleCheckboxChange(service)}
                      className="h-5 w-5 cursor-pointer rounded border-gray-300 text-amber-600 focus:ring-2 focus:ring-amber-200"
                    />
                    <span className="font-['Inter'] text-gray-700">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="w-full">
              <label
                htmlFor="budget"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Approx Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="₹1,00,000 – ₹5,00,000"
              />
            </div>

            {/* Message */}
            <div className="w-full">
              <label
                htmlFor="message"
                className="mb-2 block font-['Inter'] font-semibold text-gray-700"
              >
                Additional Requirements
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-['Inter'] transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                placeholder="Any special requests or preferences"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-amber-600 px-6 py-4 font-['Inter'] text-lg font-semibold text-white shadow-lg transition-all hover:bg-amber-700 hover:shadow-xl active:scale-98 "
            >
              <Send size={20} />
              Send Enquiry on WhatsApp
            </button>

            <p className="text-center font-['Inter'] text-sm text-gray-800">
              Your enquiry will be sent directly to our WhatsApp for immediate assistance
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
