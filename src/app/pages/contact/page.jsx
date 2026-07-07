import Contact from "./Contact";
import { getStaticMetadata } from "../../../lib/seo";

export const metadata = getStaticMetadata("contact");

export default function ContactPage() {
  return (
    <>
      {/* FAQPage JSON-LD for AEO/GEO — matches visible FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I book a travel package?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can browse our packages online and click 'Get Query' or contact us directly via phone or email. Our team will assist you with the booking process.",
                },
              },
              {
                "@type": "Question",
                name: "What payment methods do you accept?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We accept all major credit cards, debit cards, UPI, bank transfers, and EMI options for selected packages.",
                },
              },
              {
                "@type": "Question",
                name: "Can I customize my travel package?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! We offer customizable packages. Contact us with your requirements and we'll create a personalized itinerary for you.",
                },
              },
              {
                "@type": "Question",
                name: "Do you provide travel insurance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, we offer comprehensive travel insurance options for all our domestic and international packages.",
                },
              },
            ],
          }),
        }}
      />
      <Contact />
    </>
  );
}