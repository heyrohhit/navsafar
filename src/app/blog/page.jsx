import PackageGridLayout from "../components/packages/PackageGridLayout"
import { blogPosts } from "../api/blog"

const page = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 pt-24">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">

        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-pulse">
          ✨ Travel Stories & Guides
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Explore Our 
          <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            Latest Blogs
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover travel tips, hidden destinations, budget guides and inspiring journeys curated by our experts.
        </p>

      </div>

      {/* Blog Grid */}
      <PackageGridLayout packages={blogPosts} btn={true} />

    </section>
  )
}

export default page