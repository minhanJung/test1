"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Grid3X3, List, Star, Heart, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Wireless Pro Headphones",
    price: 299,
    originalPrice: 399,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199,
    originalPrice: 249,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 89,
    badge: "New",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Premium Coffee Maker",
    price: 149,
    originalPrice: 199,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 156,
    badge: "Hot Deal",
    category: "Home",
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 399,
    originalPrice: 499,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 203,
    badge: "Premium",
    category: "Furniture",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 79,
    originalPrice: 99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 67,
    badge: "Sale",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Yoga Mat Pro",
    price: 49,
    originalPrice: 69,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 89,
    badge: "Eco-Friendly",
    category: "Sports",
  },
]

const categories = ["All", "Electronics", "Home", "Furniture", "Sports", "Fashion"]

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("featured")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Discover our amazing collection of products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </h3>

              {/* Search */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="mt-2" />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                          <div className="flex">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="ml-1">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">{sortedProducts.length} products found</span>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-64"
                      }`}
                    />
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500">
                      {product.badge}
                    </Badge>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                      <Button size="icon" variant="secondary">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                    <div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className={`flex items-center ${viewMode === "list" ? "justify-between" : "justify-between"}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => window.open(`/products/${product.id}`, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        상세보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
