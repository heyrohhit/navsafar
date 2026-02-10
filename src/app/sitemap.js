export default function sitemap() {
  const BASE_URL = 'https://navsafar.vercel.app'
  const now = new Date()

  // Tumhari services ke paths (jo tumne diye)
  const services = [
    { label: "Domestic Tours", path: "/services/Domestic-Tours" },
    { label: "International Tours", path: "/services/International-Tours" },
    { label: "Corporate Travel", path: "/services/Corporate-Travel" },
    { label: "Religious Tours", path: "/services/Religious-Tours" },
    { label: "Customized Tours", path: "/services/Customized-Tours" },
  ]

  // Map karke dynamic URLs banao
  const dynamicServiceUrls = services.map(service => ({
    url: `${BASE_URL}${service.path.trim()}`, // trim() just in case
    lastModified: now,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: now,
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/all-tours`,
      lastModified: now,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tours`,
      lastModified: now,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      priority: 0.7,
    },
    ...dynamicServiceUrls, // tumhari dynamic services yahan add ho gyi
    {
      url: `${BASE_URL}/journeys`,
      lastModified: now,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/corporate`,
      lastModified: now,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      priority: 0.6,
    },
  ]
}
