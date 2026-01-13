"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ShoppingBag, DollarSign, Plus, Edit, Trash2, Eye, Package, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+15.3%",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    title: "Total Users",
    value: "2,456",
    change: "+12.5%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Products",
    value: "89",
    change: "+5.2%",
    icon: Package,
    color: "text-orange-600",
  },
]

// 로컬 스토리지에서 데이터 가져오기/저장하기
function getStoredOrders() {
  if (typeof window === "undefined") return []
  const orders = localStorage.getItem("admin_orders")
  return orders ? JSON.parse(orders) : []
}

function saveOrders(orders: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_orders", JSON.stringify(orders))
}

function getStoredProducts() {
  if (typeof window === "undefined") return []
  const products = localStorage.getItem("admin_products")
  return products ? JSON.parse(products) : []
}

function saveProducts(products: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_products", JSON.stringify(products))
}

function getStoredUsers() {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

function saveUsers(users: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("users", JSON.stringify(users))
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState(getStoredOrders())
  const [products, setProducts] = useState(getStoredProducts())
  const [users, setUsers] = useState(getStoredUsers())
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    status: "active",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/")
      toast({
        title: "접근 권한 없음",
        description: "관리자만 접근할 수 있습니다.",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, user, router, toast])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      customer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }

    return <Badge className={variants[status] || variants.customer}>{status.replace("_", " ")}</Badge>
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ name: "", price: "", stock: "", status: "active" })
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price.replace("$", ""),
      stock: product.stock.toString(),
      status: product.status,
    })
    setIsProductDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      const updated = products.map((p: any) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: productForm.name,
              price: `$${productForm.price}`,
              stock: Number.parseInt(productForm.stock),
              status: productForm.status,
            }
          : p
      )
      setProducts(updated)
      saveProducts(updated)
      toast({
        title: "상품 수정 완료",
        description: "상품이 성공적으로 수정되었습니다.",
      })
    } else {
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        price: `$${productForm.price}`,
        stock: Number.parseInt(productForm.stock),
        status: productForm.status,
        sales: 0,
      }
      const updated = [...products, newProduct]
      setProducts(updated)
      saveProducts(updated)
      toast({
        title: "상품 추가 완료",
        description: "새 상품이 추가되었습니다.",
      })
    }
    setIsProductDialogOpen(false)
  }

  const handleDeleteProduct = (id: number) => {
    const updated = products.filter((p: any) => p.id !== id)
    setProducts(updated)
    saveProducts(updated)
    toast({
      title: "상품 삭제 완료",
      description: "상품이 삭제되었습니다.",
    })
  }

  const handleDeleteUser = (id: string) => {
    if (id === user?.id) {
      toast({
        title: "오류",
        description: "자신의 계정은 삭제할 수 없습니다.",
        variant: "destructive",
      })
      return
    }
    const updated = users.filter((u: any) => u.id !== id)
    setUsers(updated)
    saveUsers(updated)
    toast({
      title: "사용자 삭제 완료",
      description: "사용자가 삭제되었습니다.",
    })
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">플랫폼 관리</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              홈으로
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="orders">주문</TabsTrigger>
            <TabsTrigger value="products">상품</TabsTrigger>
            <TabsTrigger value="users">사용자</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>최근 주문</CardTitle>
                <CardDescription>고객의 최신 주문 내역</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>모든 주문</CardTitle>
                  <CardDescription>모든 고객 주문 관리</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>상품</CardTitle>
                  <CardDescription>상품 카탈로그 관리</CardDescription>
                </div>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      상품 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "상품 수정" : "상품 추가"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? "상품 정보를 수정하세요." : "새 상품 정보를 입력하세요."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>상품명</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>가격 ($)</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>재고</Label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>상태</Label>
                        <Select
                          value={productForm.status}
                          onValueChange={(value) => setProductForm({ ...productForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">활성</SelectItem>
                            <SelectItem value="out_of_stock">품절</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleSaveProduct} className="w-full">
                        저장
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>사용자</CardTitle>
                  <CardDescription>사용자 계정 및 권한 관리</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.role)}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{user.spent}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
