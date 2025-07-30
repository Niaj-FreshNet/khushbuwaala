// lib/data.ts - Server-side data fetching (mocked)

export interface Product {
  _id: string
  name: string
  category: string
  price: number
  primaryImage: string
  secondaryImage?: string
  smell: string[]
  section?: "featured" | "new-arrivals" | "top-rated"
  variantPrices?: { [key: string]: number } // This property is crucial for the cart context
}

export interface Review {
  id: string
  image: string
  facebookLink: string
  instagramLink: string
}

// Mock product data
const mockProducts: Product[] = [
  {
    _id: "p1",
    name: "Inspired Perfume Oil A",
    category: "inspiredPerfumeOil",
    price: 1200,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Citrusy", "Refreshing"],
    section: "featured",
    variantPrices: { "3 ml": 1200, "6 ml": 2200 }, // Example variant prices
  },
  {
    _id: "p2",
    name: "Oriental Attar B",
    category: "oriental",
    price: 1800,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Woody", "Spicy"],
    section: "featured",
    variantPrices: { "3 ml": 1800, "6 ml": 3400 },
  },
  {
    _id: "p3",
    name: "Artificial Oud C",
    category: "artificialOud",
    price: 2500,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Smooky", "Amber"],
    section: "new-arrivals",
    variantPrices: { "3 ml": 2500, "6 ml": 4800 },
  },
  {
    _id: "p4",
    name: "Natural Collection D",
    category: "natural",
    price: 3000,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Floral", "Earthy"],
    section: "top-rated",
    variantPrices: { "3 ml": 3000, "6 ml": 5800 },
  },
  {
    _id: "p5",
    name: "Inspired Perfume Oil E",
    category: "inspiredPerfumeOil",
    price: 1500,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Sweet", "Vanilla"],
    section: "featured",
    variantPrices: { "3 ml": 1500, "6 ml": 2800 },
  },
  {
    _id: "p6",
    name: "Oriental Attar F",
    category: "oriental",
    price: 2000,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Musky", "Nostalgic"],
    section: "new-arrivals",
    variantPrices: { "3 ml": 2000, "6 ml": 3800 },
  },
  {
    _id: "p7",
    name: "Artificial Oud G",
    category: "artificialOud",
    price: 2800,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Strong", "Projective"],
    section: "top-rated",
    variantPrices: { "3 ml": 2800, "6 ml": 5400 },
  },
  {
    _id: "p8",
    name: "Inspired Perfume Oil H",
    category: "inspiredPerfumeOil",
    price: 1350,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Corporate", "Manly"],
    section: "featured",
    variantPrices: { "3 ml": 1350, "6 ml": 2500 },
  },
  {
    _id: "p9",
    name: "Oriental Attar I",
    category: "oriental",
    price: 1950,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Leathery", "Smooky"],
    section: "featured",
    variantPrices: { "3 ml": 1950, "6 ml": 3700 },
  },
  {
    _id: "p10",
    name: "Artificial Oud J",
    category: "artificialOud",
    price: 2600,
    primaryImage: "/placeholder.svg?height=200&width=160",
    secondaryImage: "/placeholder.svg?height=200&width=160&text=Hover+View",
    smell: ["Amber", "Woody"],
    section: "new-arrivals",
    variantPrices: { "3 ml": 2600, "6 ml": 5000 },
  },
]

// Mock review data
const mockReviews: Review[] = [
  {
    id: "r1",
    image: "/placeholder.svg?height=256&width=256",
    facebookLink: "https://www.facebook.com/khushbuwaala",
    instagramLink: "https://www.instagram.com/khushbuwaala",
  },
  {
    id: "r2",
    image: "/placeholder.svg?height=256&width=256",
    facebookLink: "https://www.facebook.com/khushbuwaala",
    instagramLink: "https://www.instagram.com/khushbuwaala",
  },
  {
    id: "r3",
    image: "/placeholder.svg?height=256&width=256",
    facebookLink: "https://www.facebook.com/khushbuwaala",
    instagramLink: "https://www.instagram.com/khushbuwaala",
  },
  {
    id: "r4",
    image: "/placeholder.svg?height=256&width=256",
    facebookLink: "https://www.facebook.com/khushbuwaala",
    instagramLink: "https://www.instagram.com/khushbuwaala",
  },
]

export async function getProducts(category?: string, section?: string): Promise<Product[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = mockProducts
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category)
  }
  if (section) {
    filteredProducts = filteredProducts.filter((p) => p.section === section)
  }
  return filteredProducts
}

export async function getReviews(): Promise<Review[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockReviews
}
