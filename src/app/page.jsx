// Server Component
import Herosections from "./components/hero/HeroSections";
import HomePageClientLoader from "./HomePageClientLoader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Herosections />
      <HomePageClientLoader />
    </div>
  );
}
