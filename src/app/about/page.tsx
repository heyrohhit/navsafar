"use client"
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users } from 'lucide-react';

const values = [
  { icon: Award, title: 'Speed', description: 'Quick turnaround on itineraries and bookings' },
  { icon: Eye, title: 'Clarity', description: 'Transparent pricing with no hidden costs' },
  { icon: Target, title: 'Reliability', description: 'Consistent quality service delivery' },
  { icon: Users, title: 'Premium Support', description: '24/7 dedicated customer assistance' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white/100 to-[#0B1C2D] pt-20">
      {/* Hero Section */}
      <section className="bg-[#0B1C2D] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4 font-['Playfair_Display'] text-5xl font-bold text-white">
              About Navsafar
            </h1>
            <p className="mx-auto max-w-3xl font-['Inter'] text-xl text-gray-300">
              Crafting extraordinary travel experiences with professionalism,
              transparency, and unwavering commitment to excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-[#C9A24D] to-[#B8934D] p-10"
            >
              <Target className="mb-4 text-white" size={48} />
              <h2 className="mb-4 font-['Playfair_Display'] text-3xl font-bold text-white">
                Our Mission
              </h2>
              <p className="font-['Inter'] text-lg leading-relaxed text-white/90">
                To simplify travel through transparency, professionalism and
                customer-first service. We believe every journey should be
                memorable, stress-free, and perfectly tailored to individual
                preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-[#0B1C2D] to-[#1a3a52] p-10"
            >
              <Eye className="mb-4 text-[#C9A24D]" size={48} />
              <h2 className="mb-4 font-['Playfair_Display'] text-3xl font-bold text-white">
                Our Vision
              </h2>
              <p className="font-['Inter'] text-lg leading-relaxed text-white/90">
                To become India's most trusted premium travel management company,
                recognized for exceptional service, innovative solutions, and
                creating lasting memories for travelers worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className=" py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-2xl font-['Inter'] text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-xl bg-white p-8 text-center shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/10">
                    <Icon className="text-[#C9A24D]" size={32} />
                  </div>
                  <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D]">
                    {value.title}
                  </h3>
                  <p className="font-['Inter'] text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className=" py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-12 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D]">
              Leadership Team
            </h2>

            <div className="mx-auto max-w-md">
              <div className="rounded-2xl border-2 border-[#C9A24D] bg-gradient-to-br from-[#F5F7FA] to-white p-8">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A24D] font-['Playfair_Display'] text-4xl font-bold text-white">
                  N
                </div>
                <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D]">
                  Naveen Naveed Sidhant
                </h3>
                <p className="mb-4 font-['Inter'] text-[#C9A24D]">
                  Manager / CEO / Marketing
                </p>
                <p className="font-['Inter'] text-gray-600">
                  Leading Navsafar with a vision to revolutionize travel
                  management through innovation, transparency, and exceptional
                  customer service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-['Playfair_Display'] text-4xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 font-['Inter'] text-xl text-gray-300">
              Let our expert team craft the perfect travel experience for you
            </p>
            <a
              href="/booking"
              className="inline-block rounded-lg bg-[#C9A24D] px-10 py-4 font-['Inter'] text-lg font-semibold text-white transition-all hover:bg-[#B8934D]"
            >
              Plan Your Trip
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
