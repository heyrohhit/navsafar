import React from 'react'
import BlogShow from "./blogShow"

export const metadata = {
  title: "Travel Blog | Tips, Guides & Destinations | NavSafar",
  description: "Read travel tips, destination guides, and expert advice from NavSafar. Plan your perfect trip with our curated travel blog.",
  alternates: {
    canonical: "https://navsafar.com/blog",
  },
  openGraph: {
    title: "Travel Blog | Tips, Guides & Destinations | NavSafar",
    description: "Read travel tips, destination guides, and expert advice from NavSafar.",
    url: "https://navsafar.com/blog",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <BlogShow/>
    </div>
  )
}

export default page