"use client"

import { useState, useEffect } from "react"
import { eslsApi, ESL, ESLCreate } from "@/lib/api/esls"
import { storesApi, Store as StoreType } from "@/lib/api/stores"
import { productsApi, Product } from "@/lib/api/products"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  MoreHorizontal,
  Battery,
  BatteryLow,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  ChevronDown,
  Home,
  Store,
  Package,
  Tag,
  Router,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react"

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
  },
  {
    title: "ESL Tags",
    icon: Tag,
    url: "/esl-management",
    isActive: true,
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
  DialogTrigger,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample ESL data
const eslData = [
  {
    id: "ESL-001",
    labelSize: "2.9 inch",
    batteryLevel: 85,
    signalStrength: 92,
    status: "active",
    productName: "Premium Coffee Beans",
    storeName: "Store #001",
    lastSync: "2 min ago",
    isRecentlySync: true,
  },
  {
    id: "ESL-002",
    labelSize: "4.2 inch",
    batteryLevel: 23,
    signalStrength: 67,
    status: "active",
    productName: "Organic Milk",
    storeName: "Store #001",
    lastSync: "15 min ago",
    isRecentlySync: false,
  },
  {
    id: "ESL-003",
    labelSize: "2.9 inch",
    batteryLevel: 0,
    signalStrength: 0,
    status: "error",
    productName: "Whole Wheat Bread",
    storeName: "Store #002",
    lastSync: "2 hours ago",
    isRecentlySync: false,
  },
  {
    id: "ESL-004",
    labelSize: "7.5 inch",
    batteryLevel: 67,
    signalStrength: 88,
    status: "inactive",
    productName: "Fresh Apples",
    storeName: "Store #002",
    lastSync: "1 hour ago",
    isRecentlySync: false,
  },
  {
    id: "ESL-005",
    labelSize: "4.2 inch",
    batteryLevel: 91,
    signalStrength: 95,
    status: "active",
    productName: "Greek Yogurt",
    storeName: "Store #003",
    lastSync: "30 sec ago",
    isRecentlySync: true,
  },
]

const stores = ["All Stores"] // Will be populated with real data
const statusOptions = ["All Status", "active", "inactive", "error"]
const batteryOptions = ["All Battery", "low", "medium", "high"]

function BatteryIndicator({ level }: { level: number }) {
  const getBatteryColor = () => {
    if (level > 60) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getBatteryIcon = () => {
    if (level === 0) return XCircle
    if (level < 30) return BatteryLow
    return Battery
  }

  const Icon = getBatteryIcon()

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${getBatteryColor()}`} />
      <span className={`text-sm font-medium ${getBatteryColor()}`}>{level}%</span>
    </div>
  )
}

function SignalIndicator({ strength }: { strength: number }) {
  const getSignalColor = () => {
    if (strength > 70) return "text-green-600"
    if (strength > 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getSignalBars = () => {
    if (strength === 0) return 0
    if (strength < 25) return 1
    if (strength < 50) return 2
    if (strength < 75) return 3
    return 4
  }

  const bars = getSignalBars()

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 ${bar <= bars ? getSignalColor() : "text-gray-300"} ${bar === 1 ? "h-1" : bar === 2 ? "h-2" : bar === 3 ? "h-3" : "h-4"
              } bg-current rounded-sm`}
          />
        ))}
      </div>
      <span className={`text-sm ${getSignalColor()}`}>{strength}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Active" }
      case "inactive":
        return { color: "bg-gray-100 text-gray-800", icon: Clock, text: "Inactive" }
      case "error":
        return { color: "bg-red-100 text-red-800", icon: XCircle, text: "Error" }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock, text: status }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

function RegisterESLModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<StoreType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [storesLoading, setStoresLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [formData, setFormData] = useState({
    labelSize: "",
    batteryLevel: 100,
    signalStrength: 100,
    status: "active",
    productName: "",
    storeName: "",
  })

  // Fetch stores and products when modal opens
  useEffect(() => {
    if (open) {
      fetchStores()
      fetchProducts()
    }
  }, [open])

  const fetchStores = async () => {
    try {
      setStoresLoading(true)
      const data = await storesApi.getStores()
      setStores(data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      // Fallback to sample data if API fails
      setStores([
        { id: "1", name: "Store #001", location: "Location 1", manager: "Manager 1", managerId: "mgr-1", eslCount: 10, status: "active" },
        { id: "2", name: "Store #002", location: "Location 2", manager: "Manager 2", managerId: "mgr-2", eslCount: 15, status: "active" },
        { id: "3", name: "Store #003", location: "Location 3", manager: "Manager 3", managerId: "mgr-3", eslCount: 8, status: "active" },
      ])
    } finally {
      setStoresLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      const data = await productsApi.getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      // Fallback to sample data if API fails
      setProducts([
        { id: "1", name: "Premium Coffee Beans", barcode: "123456789", mrp: 15.99, sellingPrice: 12.99, category: "Beverages" },
        { id: "2", name: "Organic Milk", barcode: "987654321", mrp: 4.99, sellingPrice: 3.99, category: "Dairy" },
        { id: "3", name: "Whole Wheat Bread", barcode: "456789123", mrp: 3.99, sellingPrice: 2.99, category: "Bakery" },
        { id: "4", name: "Fresh Apples", barcode: "789123456", mrp: 2.99, sellingPrice: 1.99, category: "Produce" },
        { id: "5", name: "Greek Yogurt", barcode: "321654987", mrp: 5.99, sellingPrice: 4.99, category: "Dairy" },
      ])
    } finally {
      setProductsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.labelSize || !formData.productName || !formData.storeName ||
      formData.productName === "loading" || formData.productName === "no-products" ||
      formData.storeName === "loading" || formData.storeName === "no-stores") {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const eslData: ESLCreate = {
        ...formData,
        lastSync: "Just now",
        isRecentlySync: true,
      }

      await eslsApi.createESL(eslData)
      onSuccess()
      setOpen(false)
      // Reset form
      setFormData({
        labelSize: "",
        batteryLevel: 100,
        signalStrength: 100,
        status: "active",
        productName: "",
        storeName: "",
      })
    } catch (error) {
      console.error('Failed to create ESL:', error)
      alert('Failed to create ESL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Register New ESL Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New ESL Tag</DialogTitle>
          <DialogDescription>
            Add a new ESL tag to your inventory. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label-size" className="text-right">
              Label Size *
            </Label>
            <Select value={formData.labelSize} onValueChange={(value) => setFormData({ ...formData, labelSize: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.9 inch">2.9 inch</SelectItem>
                <SelectItem value="4.2 inch">4.2 inch</SelectItem>
                <SelectItem value="7.5 inch">7.5 inch</SelectItem>
                <SelectItem value="13.3 inch">13.3 inch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="store" className="text-right">
              Store *
            </Label>
            <Select
              value={formData.storeName}
              onValueChange={(value) => setFormData({ ...formData, storeName: value })}
              disabled={storesLoading || stores.length === 0}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={storesLoading ? "Loading stores..." : stores.length === 0 ? "No stores available" : "Select store"} />
              </SelectTrigger>
              <SelectContent>
                {storesLoading ? (
                  <SelectItem value="loading" disabled>Loading stores...</SelectItem>
                ) : stores.length === 0 ? (
                  <SelectItem value="no-stores" disabled>No stores available</SelectItem>
                ) : (
                  stores.map((store) => (
                    <SelectItem key={store.id} value={store.name}>
                      {store.name} - {store.location}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product" className="text-right">
              Product *
            </Label>
            <Select 
              value={formData.productName} 
              onValueChange={(value) => setFormData({ ...formData, productName: value })}
              disabled={productsLoading || products.length === 0}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={productsLoading ? "Loading products..." : products.length === 0 ? "No products available" : "Assign product"} />
              </SelectTrigger>
              <SelectContent>
                {productsLoading ? (
                  <SelectItem value="loading" disabled>Loading products...</SelectItem>
                ) : products.length === 0 ? (
                  <SelectItem value="no-products" disabled>No products available</SelectItem>
                ) : (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.name}>
                      {product.name} - ${product.sellingPrice}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Register ESL"}
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

export default function ESLManagement() {
  const [esls, setEsls] = useState<ESL[]>([])
  const [stores, setStores] = useState<StoreType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedESLs, setSelectedESLs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [storeFilter, setStoreFilter] = useState("All Stores")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [batteryFilter, setBatteryFilter] = useState("All Battery")

  // Fetch ESLs and stores from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch ESLs
        const eslData = await eslsApi.getESLs()
        setEsls(eslData)

        // Fetch stores
        const storeData = await storesApi.getStores()
        setStores(storeData)

        setError(null)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data. Please try again.')
        // Fallback to sample data if API fails
        setEsls(eslData)
        setStores([
          { id: "1", name: "Store #001", location: "Location 1", manager: "Manager 1", managerId: "mgr-1", eslCount: 10, status: "active" },
          { id: "2", name: "Store #002", location: "Location 2", manager: "Manager 2", managerId: "mgr-2", eslCount: 15, status: "active" },
          { id: "3", name: "Store #003", location: "Location 3", manager: "Manager 3", managerId: "mgr-3", eslCount: 8, status: "active" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredESLs = esls.filter((esl) => {
    const matchesSearch =
      esl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      esl.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      esl.storeName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStore = storeFilter === "All Stores" || esl.storeName === storeFilter
    const matchesStatus = statusFilter === "All Status" || esl.status === statusFilter

    const matchesBattery =
      batteryFilter === "All Battery" ||
      (batteryFilter === "low" && esl.batteryLevel < 30) ||
      (batteryFilter === "medium" && esl.batteryLevel >= 30 && esl.batteryLevel <= 60) ||
      (batteryFilter === "high" && esl.batteryLevel > 60)

    return matchesSearch && matchesStore && matchesStatus && matchesBattery
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedESLs(filteredESLs.map((esl) => esl.id))
    } else {
      setSelectedESLs([])
    }
  }

  const handleSelectESL = (eslId: string, checked: boolean) => {
    if (checked) {
      setSelectedESLs([...selectedESLs, eslId])
    } else {
      setSelectedESLs(selectedESLs.filter((id) => id !== eslId))
    }
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
              <h1 className="text-3xl font-bold tracking-tight">ESL Tag Management</h1>
              <p className="text-muted-foreground">Manage and monitor all ESL tags across your stores</p>
            </div>
            <RegisterESLModal onSuccess={() => {
              // Refresh the ESLs and stores list
              const fetchData = async () => {
                try {
                  setLoading(true)
                  const eslData = await eslsApi.getESLs()
                  const storeData = await storesApi.getStores()
                  setEsls(eslData)
                  setStores(storeData)
                  setError(null)
                } catch (err) {
                  console.error('Failed to fetch data:', err)
                  setError('Failed to load data. Please try again.')
                } finally {
                  setLoading(false)
                }
              }
              fetchData()
            }} />
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <Label htmlFor="search">Search ESLs</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by ESL ID, Product, or Store..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="store-filter">Store</Label>
                  <Select value={storeFilter} onValueChange={setStoreFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Stores">All Stores</SelectItem>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.name}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="battery-filter">Battery</Label>
                  <Select value={batteryFilter} onValueChange={setBatteryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {batteryOptions.map((battery) => (
                        <SelectItem key={battery} value={battery}>
                          {battery}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedESLs.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedESLs.length} ESL{selectedESLs.length > 1 ? "s" : ""} selected
                  </span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ESL Table */}
          <Card>
            <CardHeader>
              <CardTitle>ESL Tags ({filteredESLs.length})</CardTitle>
              <CardDescription>Monitor and manage all ESL tags with real-time status updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Loading ESLs...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your ESL data.</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Error Loading ESLs</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      // Retry fetching
                      const fetchData = async () => {
                        try {
                          setLoading(true)
                          const eslData = await eslsApi.getESLs()
                          const storeData = await storesApi.getStores()
                          setEsls(eslData)
                          setStores(storeData)
                          setError(null)
                        } catch (err) {
                          console.error('Failed to fetch data:', err)
                          setError('Failed to load data. Please try again.')
                          setEsls(eslData)
                          setStores([
                            { id: "1", name: "Store #001", location: "Location 1", manager: "Manager 1", managerId: "mgr-1", eslCount: 10, status: "active" },
                            { id: "2", name: "Store #002", location: "Location 2", manager: "Manager 2", managerId: "mgr-2", eslCount: 15, status: "active" },
                            { id: "3", name: "Store #003", location: "Location 3", manager: "Manager 3", managerId: "mgr-3", eslCount: 8, status: "active" },
                          ])
                        } finally {
                          setLoading(false)
                        }
                      }
                      fetchData()
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredESLs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No ESLs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No ESL tags match your current search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStoreFilter("All Stores")
                      setStatusFilter("All Status")
                      setBatteryFilter("All Battery")
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
                            checked={selectedESLs.length === filteredESLs.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>ESL ID</TableHead>
                        <TableHead>Label Size</TableHead>
                        <TableHead>Battery Level</TableHead>
                        <TableHead>Signal Strength</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredESLs.map((esl) => (
                        <TableRow key={esl.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedESLs.includes(esl.id)}
                              onCheckedChange={(checked) => handleSelectESL(esl.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {esl.id}
                              {esl.isRecentlySync && (
                                <div
                                  className="h-2 w-2 bg-green-500 rounded-full animate-pulse"
                                  title="Recently synced"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{esl.labelSize}</TableCell>
                          <TableCell>
                            <BatteryIndicator level={esl.batteryLevel} />
                          </TableCell>
                          <TableCell>
                            <SignalIndicator strength={esl.signalStrength} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={esl.status} />
                          </TableCell>
                          <TableCell>{esl.productName}</TableCell>
                          <TableCell>{esl.storeName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{esl.lastSync}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit ESL
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Sync Now
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ESL
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
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
