"use client"

import { useState, useEffect } from "react"
import { productsApi } from "@/lib/api"
import { categoriesApi, Category } from "@/lib/api/categories"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Package,
  Bell,
  ChevronDown,
  Home,
  Store,
  Tag,
  Router,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Navigation items with correct URLs
const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    isActive: false,
  },
  {
    title: "Stores",
    icon: Store,
    url: "/stores",
  },
  {
    title: "Products",
    icon: Package,
    url: "/products",
    isActive: true,
  },
  {
    title: "ESL Tags",
    icon: Tag,
    url: "/esl-management",
  },
  {
    title: "Gateways",
    icon: Router,
    url: "/gateways",
  },
  {
    title: "Sync Logs",
    icon: FileText,
    url: "/sync-logs",
  },
  {
    title: "Users",
    icon: Users,
    url: "/users",
  },
]

// Sample product data
const productsData = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    barcode: "1234567890123",
    mrp: 299.99,
    discount: 10,
    sellingPrice: 269.99,
    category: "Beverages",
    autoPricing: true,
    stock: 150,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Organic Milk",
    barcode: "2345678901234",
    mrp: 65.0,
    discount: 5,
    sellingPrice: 61.75,
    category: "Dairy",
    autoPricing: false,
    stock: 0,
    status: "out-of-stock",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    barcode: "3456789012345",
    mrp: 45.0,
    discount: 0,
    sellingPrice: 45.0,
    category: "Bakery",
    autoPricing: true,
    stock: 75,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Fresh Apples",
    barcode: "4567890123456",
    mrp: 120.0,
    discount: 15,
    sellingPrice: 102.0,
    category: "Fruits",
    autoPricing: true,
    stock: 200,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Greek Yogurt",
    barcode: "5678901234567",
    mrp: 89.99,
    discount: 8,
    sellingPrice: 82.79,
    category: "Dairy",
    autoPricing: false,
    stock: 30,
    status: "low-stock",
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Default categories fallback
const defaultCategories = ["All Categories", "Beverages", "Dairy", "Bakery", "Fruits", "Snacks"]

function AutoPricingBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "default" : "secondary"} className={enabled ? "bg-green-100 text-green-800" : ""}>
      {enabled ? "Auto" : "Manual"}
    </Badge>
  )
}

function StockBadge({ stock, status }: { stock: number; status: string }) {
  const getStockConfig = () => {
    if (status === "out-of-stock") {
      return { color: "bg-red-100 text-red-800", text: "Out of Stock" }
    }
    if (status === "low-stock") {
      return { color: "bg-yellow-100 text-yellow-800", text: "Low Stock" }
    }
    return { color: "bg-green-100 text-green-800", text: "In Stock" }
  }

  const config = getStockConfig()

  return (
    <Badge variant="secondary" className={config.color}>
      {config.text} ({stock})
    </Badge>
  )
}

function ProductModal({ product, isOpen, onClose, onSuccess, categoriesList, onAddNewCategory }: { 
  product?: any; 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
  categoriesList: string[];
  onAddNewCategory: (categoryName: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    barcode: product?.barcode || "",
    mrp: product?.mrp || "",
    discount: product?.discount || "",
    sellingPrice: product?.sellingPrice || "",
    category: product?.category || "",
    autoPricing: product?.autoPricing || false,
  })

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product?.name || "",
        barcode: product?.barcode || "",
        mrp: product?.mrp || "",
        discount: product?.discount || "",
        sellingPrice: product?.sellingPrice || "",
        category: product?.category || "",
        autoPricing: product?.autoPricing || false,
      })
    } else {
      // Reset modal state when closing
      setIsNewCategoryModalOpen(false)
    }
  }, [isOpen, product])

  const calculateSellingPrice = () => {
    if (formData.mrp && formData.discount) {
      const mrp = Number.parseFloat(formData.mrp.toString())
      const discount = Number.parseFloat(formData.discount.toString())
      const sellingPrice = mrp - (mrp * discount) / 100
      setFormData({ ...formData, sellingPrice: sellingPrice.toFixed(2) })
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.barcode || !formData.mrp || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const productData = {
        name: formData.name,
        barcode: formData.barcode,
        mrp: parseFloat(formData.mrp),
        discount: parseFloat(formData.discount) || 0,
        sellingPrice: parseFloat(formData.sellingPrice),
        category: formData.category,
      }

      if (product) {
        // Update existing product
        await productsApi.updateProduct(product.id, productData)
      } else {
        // Create new product
        await productsApi.createProduct(productData)
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update product information" : "Add a new product to your inventory"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="Enter barcode"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input
                id="mrp"
                type="number"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                onBlur={calculateSellingPrice}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                onBlur={calculateSellingPrice}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="0.00"
                disabled={formData.autoPricing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                if (value === "add-new") {
                  setIsNewCategoryModalOpen(true)
                } else {
                  setFormData({ ...formData, category: value })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="add-new" className="text-blue-600 font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-4">
              <Input id="image" type="file" accept="image/*" />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoPricing"
              checked={formData.autoPricing}
              onCheckedChange={(checked) => setFormData({ ...formData, autoPricing: checked })}
            />
            <Label htmlFor="autoPricing">Enable Auto Pricing</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (product ? "Update Product" : "Add Product")}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* New Category Modal */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onAdd={async (categoryName) => {
          await onAddNewCategory(categoryName)
          setFormData({ ...formData, category: categoryName })
          setIsNewCategoryModalOpen(false)
        }}
      />
    </Dialog>
  )
}

function ProductPreview({ product, isOpen, onClose }: { product: any; isOpen: boolean; onClose: () => void }) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Product Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src={product.image || "/placeholder.svg?height=80&width=80"}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-lg border"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">Barcode: {product.barcode}</p>
              <StockBadge stock={product.stock} status={product.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">MRP:</span>
              <p className="font-medium">₹{product.mrp}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Selling Price:</span>
              <p className="font-medium">₹{product.sellingPrice}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Discount:</span>
              <p className="font-medium">{product.discount}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{product.category}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Auto Pricing:</span>
            <AutoPricingBadge enabled={product.autoPricing} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewCategoryModal({
  isOpen,
  onClose,
  onAdd,
}: { isOpen: boolean; onClose: () => void; onAdd: (category: string) => Promise<void> }) {
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)

  // Reset category name when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCategoryName("")
      setLoading(false)
    }
  }, [isOpen])

  const handleAdd = async () => {
    if (categoryName.trim()) {
      setLoading(true)
      try {
        await onAdd(categoryName.trim())
        setCategoryName("")
        onClose()
      } catch (error) {
        console.error('Failed to add category:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Create a new product category for better organization.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd()
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!categoryName.trim() || loading}>
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Tag className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ESL Manager</span>
            <span className="text-xs text-muted-foreground">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function TopNavigation() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search stores, products..." className="w-[300px] pl-8" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [categoriesList, setCategoriesList] = useState(defaultCategories)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'multiple', id?: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setCategoriesLoading(true)
        
        // Fetch products
        const productsData = await productsApi.getProducts()
        setProducts(productsData)
        setError(null)
        
        // Fetch categories
        try {
          const categoriesData = await categoriesApi.getCategories(true) // Only active categories
          const categoryNames = ["All Categories", ...categoriesData.map(cat => cat.name)]
          setCategoriesList(categoryNames)
        } catch (error) {
          console.error('Failed to fetch categories:', error)
          // Use default categories as fallback
          setCategoriesList(defaultCategories)
        }
        
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data. Please try again.')
        // Fallback to sample data if API fails
        setProducts(productsData)
        setCategoriesList(defaultCategories)
      } finally {
        setLoading(false)
        setCategoriesLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeProducts = products.filter((product) => product.status === "active")
  const outOfStockProducts = products.filter((product) => product.status === "out-of-stock")
  const lowStockProducts = products.filter((product) => product.status === "low-stock")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const handlePreview = (product: any) => {
    setSelectedProduct(product)
    setIsPreviewOpen(true)
  }

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleAddNewCategory = async (categoryName: string) => {
    try {
      // Check if category already exists
      if (categoriesList.includes(categoryName)) {
        alert('Category already exists!')
        return
      }
      
      // Try to create category via API
      try {
        const newCategory = await categoriesApi.createCategory({
          name: categoryName,
          description: `Category for ${categoryName}`,
          is_active: true
        })
        
        // Update local state
        const newCategories = [...categoriesList, newCategory.name]
        setCategoriesList(newCategories)
        
        // Show success message
        console.log(`Category "${categoryName}" added successfully!`)
      } catch (apiError) {
        console.error('API failed, adding to local state only:', apiError)
        // Fallback: add to local state only
        const newCategories = [...categoriesList, categoryName]
        setCategoriesList(newCategories)
        console.log(`Category "${categoryName}" added to local state only!`)
      }
    } catch (error) {
      console.error('Failed to add category:', error)
      alert('Failed to add category. Please try again.')
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setDeleteTarget({ type: 'single', id: productId })
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete.')
      return
    }
    setDeleteTarget({ type: 'multiple' })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      if (deleteTarget.type === 'single' && deleteTarget.id) {
        await productsApi.deleteProduct(deleteTarget.id)
        // Refresh the products list
        const data = await productsApi.getProducts()
        setProducts(data)
        setSelectedProducts(selectedProducts.filter(id => id !== deleteTarget.id))
      } else if (deleteTarget.type === 'multiple') {
        // Delete all selected products
        await Promise.all(selectedProducts.map(productId => productsApi.deleteProduct(productId)))
        
        // Refresh the products list
        const data = await productsApi.getProducts()
        setProducts(data)
        setSelectedProducts([])
      }
    } catch (error) {
      console.error('Failed to delete product(s):', error)
      alert('Failed to delete product(s). Please try again.')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeleteTarget(null)
    }
  }

  const handleProductSuccess = () => {
    // Refresh the products list
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again.')
      }
    }
    fetchProducts()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
              <p className="text-muted-foreground">Manage your product catalog and pricing</p>
            </div>
            <Button onClick={() => setIsProductModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category-filter">Category</Label>
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categoriesLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsNewCategoryModalOpen(true)}
                      className="whitespace-nowrap"
                      disabled={categoriesLoading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Category
                    </Button>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Products ({productsData.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock ({lowStockProducts.length})</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock ({outOfStockProducts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Complete product inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Loading Products...</h3>
                      <p className="text-muted-foreground">Please wait while we fetch your product data.</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
                      <p className="text-muted-foreground mb-4">{error}</p>
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                      <p className="text-muted-foreground mb-4">
                        No products match your current search criteria or filters.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setCategoryFilter("All Categories")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedProducts.length === filteredProducts.length}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Barcode</TableHead>
                            <TableHead>MRP</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Selling Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Auto Pricing</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedProducts.includes(product.id)}
                                  onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell>
                                <Image
                                  src={product.image || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded border"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <button onClick={() => handlePreview(product)} className="text-left hover:underline">
                                  {product.name}
                                </button>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{product.barcode}</TableCell>
                              <TableCell>₹{product.mrp}</TableCell>
                              <TableCell>{product.discount}%</TableCell>
                              <TableCell className="font-medium">₹{product.sellingPrice}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>
                                <StockBadge stock={product.stock} status={product.status} />
                              </TableCell>
                              <TableCell>
                                <AutoPricingBadge enabled={product.autoPricing} />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handlePreview(product)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Product
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Package className="mr-2 h-4 w-4" />
                                        Update Stock
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleDeleteProduct(product.id)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Product
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredProducts.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}{" "}
                        products
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage * itemsPerPage >= filteredProducts.length}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Active Products</CardTitle>
                  <CardDescription>Products currently available for sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{activeProducts.length} active products available</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="low-stock">
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Products</CardTitle>
                  <CardDescription>Products that need restocking</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{lowStockProducts.length} products need restocking</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="out-of-stock">
              <Card>
                <CardHeader>
                  <CardTitle>Out of Stock Products</CardTitle>
                  <CardDescription>Products currently unavailable</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{outOfStockProducts.length} products are out of stock</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false)
            setSelectedProduct(null)
          }}
          onSuccess={handleProductSuccess}
          categoriesList={categoriesList}
          onAddNewCategory={handleAddNewCategory}
        />
        <ProductPreview
          product={selectedProduct}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false)
            setSelectedProduct(null)
          }}
        />
        <NewCategoryModal
          isOpen={isNewCategoryModalOpen}
          onClose={() => setIsNewCategoryModalOpen(false)}
          onAdd={handleAddNewCategory}
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                {deleteTarget?.type === 'single' 
                  ? 'Are you sure you want to delete this product? This action cannot be undone.'
                  : `Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
