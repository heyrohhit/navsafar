// Server Component
import Herosections from "./components/hero/HeroSections";
// ✅ HomePageClient ab seedha import hai (pehle ssr:false wrapper tha).
// Client component hone ke bawajood iska initial HTML server par render hota
// hai → poori homepage (stats, destinations, testimonials, about, CTA) ab
// crawlers ke liye visible + user ke liye turant paint. framer-motion
// whileInView animations aise hi kaam karte hain.
import HomePageClient from "./HomePageClient";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Herosections />
      <HomePageClient />
    </div>
  );
}
