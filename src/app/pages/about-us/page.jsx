import About from "./About";
import { getStaticMetadata } from "../../../lib/seo";

export const metadata = getStaticMetadata("about");

export default function AboutPage() {
  return (
    <>
      {/* FAQPage JSON-LD for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Where is NavSafar Travel Solutions located?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "NavSafar Travel Solutions is based in New Delhi, India (WZ-447, First Floor, Left Side, Nangal Raya, New Delhi - 110046) and serves customers across India for domestic and international travel planning.",
                },
              },
              {
                "@type": "Question",
                name: "Is NavSafar a government-approved travel agency?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "NavSafar operates as a professional travel agency offering IATO-affiliated and government-recognised travel services for Indian and international tour bookings. Please contact us for current certification details.",
                },
              },
              {
                "@type": "Question",
                name: "How experienced is the NavSafar team?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our team brings years of hands-on travel-planning experience across Indian and international destinations, and each customer gets a dedicated expert who manages the trip end to end.",
                },
              },
              {
                "@type": "Question",
                name: "Why should I choose NavSafar over an online booking website?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Unlike self-service booking sites, NavSafar gives you a real human travel expert, fully customised itineraries, transparent INR pricing and 24/7 support during your trip.",
                },
              },
            ],
          }),
        }}
      />
      <About />
    </>
  );
}