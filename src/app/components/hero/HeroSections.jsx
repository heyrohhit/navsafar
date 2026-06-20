// Server Component — "use client" nahi
import TripSafariHero from "./TripSafariHero";
import SearchComponentsLoader from "./SearchComponentsLoader";

const Herosections = () => {
  return (
    <div className="w-full relative">
      <TripSafariHero />
      <SearchComponentsLoader />
    </div>
  );
};

export default Herosections;
