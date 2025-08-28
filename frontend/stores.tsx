"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  MapPin,
  Users,
  Tag,
  Bell,
  ChevronDown,
  Home,
  Store,
  Package,
  Router,
  FileText,
  Settings,
  LogOut,
} from "lucide-react"
import { storesApi } from "@/lib/api"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Navigation items
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
    isActive: true,
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

// Sample stores data - will be replaced by API data
const storesData = [
  {
    id: "1",
    name: "Downtown Store",
    location: "123 Main St, Downtown, NY 10001",
    manager: "John Smith",
    managerId: "mgr-001",
    eslCount: 245,
    status: "active",
    lastSync: "2 min ago",
  },
  {
    id: "2",
    name: "Mall Branch",
    location: "456 Shopping Mall, Level 2, NY 10002",
    manager: "Sarah Johnson",
    managerId: "mgr-002",
    eslCount: 189,
    status: "active",
    lastSync: "5 min ago",
  },
  {
    id: "3",
    name: "Airport Terminal",
    location: "Terminal 1, JFK Airport, NY 11430",
    manager: "Mike Davis",
    managerId: "mgr-003",
    eslCount: 156,
    status: "maintenance",
    lastSync: "1 hour ago",
  },
  {
    id: "4",
    name: "Suburban Outlet",
    location: "789 Suburban Ave, Queens, NY 11101",
    manager: "Lisa Wilson",
    managerId: "mgr-004",
    eslCount: 98,
    status: "active",
    lastSync: "3 min ago",
  },
]

// Sample managers data
const managersData = [
  { id: "mgr-001", name: "John Smith", email: "john.smith@company.com" },
  { id: "mgr-002", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "mgr-003", name: "Mike Davis", email: "mike.davis@company.com" },
  { id: "mgr-004", name: "Lisa Wilson", email: "lisa.wilson@company.com" },
  { id: "mgr-005", name: "David Brown", email: "david.brown@company.com" },
  { id: "mgr-006", name: "Emma Taylor", email: "emma.taylor@company.com" },
]

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-800", text: "Active" }
      case "maintenance":
        return { color: "bg-yellow-100 text-yellow-800", text: "Maintenance" }
      case "inactive":
        return { color: "bg-red-100 text-red-800", text: "Inactive" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: status }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant="secondary" className={config.color}>
      {config.text}
    </Badge>
  )
}

function StoreModal({ store, isOpen, onClose, onSuccess }: { 
  store?: any; 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: store?.name || "",
    location: store?.location || "",
    manager: store?.manager || "",
    eslCount: store?.eslCount || 0,
    status: store?.status || "active",
    lastSync: store?.lastSync || "",
  })
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes or store changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: store?.name || "",
        location: store?.location || "",
        manager: store?.manager || "",
        eslCount: store?.eslCount || 0,
        status: store?.status || "active",
        lastSync: store?.lastSync || "",
      })
    }
  }, [isOpen, store])

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.manager) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      if (store) {
        // Update existing store
        await storesApi.updateStore(store.id, formData)
      } else {
        // Create new store
        await storesApi.createStore(formData)
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save store:', error)
      alert('Failed to save store. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
          <DialogDescription>
            {store ? "Update store information" : "Add a new store to your network"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter store name"
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter full address"
            />
          </div>
          <div>
            <Label htmlFor="manager">Manager Name *</Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="Enter manager name"
            />
          </div>
          <div>
            <Label htmlFor="eslCount">ESL Count</Label>
            <Input
              id="eslCount"
              type="number"
              value={formData.eslCount}
              onChange={(e) => setFormData({ ...formData, eslCount: parseInt(e.target.value) || 0 })}
              placeholder="Number of ESL tags"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (store ? "Update Store" : "Add Store")}
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
          <Input type="search" placeholder="Search stores..." className="w-[300px] pl-8" />
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

export default function StoresManagement() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'multiple', id?: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        const data = await storesApi.getStores()
        setStores(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch stores:', err)
        setError('Failed to load stores. Please try again.')
        // Fallback to sample data if API fails
        setStores(storesData)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.manager && store.manager.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStores(filteredStores.map((store) => store.id))
    } else {
      setSelectedStores([])
    }
  }

  const handleSelectStore = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId])
    } else {
      setSelectedStores(selectedStores.filter((id) => id !== storeId))
    }
  }

  const handleEdit = (store: any) => {
    setSelectedStore(store)
    setIsStoreModalOpen(true)
  }

  const handleStoreSuccess = () => {
    // Refresh the stores list
    const fetchStores = async () => {
      try {
        const data = await storesApi.getStores()
        setStores(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch stores:', err)
        setError('Failed to load stores. Please try again.')
      }
    }
    fetchStores()
  }

  const handleDeleteStore = (storeId: string) => {
    setDeleteTarget({ type: 'single', id: storeId })
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSelected = () => {
    if (selectedStores.length === 0) {
      alert('Please select stores to delete.')
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
        await storesApi.deleteStore(deleteTarget.id)
        // Refresh the stores list
        const data = await storesApi.getStores()
        setStores(data)
        setSelectedStores(selectedStores.filter(id => id !== deleteTarget.id))
      } else if (deleteTarget.type === 'multiple') {
        // Delete all selected stores
        await Promise.all(selectedStores.map(storeId => storesApi.deleteStore(storeId)))
        
        // Refresh the stores list
        const data = await storesApi.getStores()
        setStores(data)
        setSelectedStores([])
      }
    } catch (error) {
      console.error('Failed to delete store(s):', error)
      alert('Failed to delete store(s). Please try again.')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setDeleteTarget(null)
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
              <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
              <p className="text-muted-foreground">Manage your store locations and assignments</p>
            </div>
            <Button onClick={() => setIsStoreModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="search">Search Stores</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, location, or manager..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
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
          {selectedStores.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedStores.length} store{selectedStores.length > 1 ? "s" : ""} selected
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

          {/* Error Message */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-sm font-medium">Error:</span>
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stores Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Stores ({filteredStores.length})</CardTitle>
              <CardDescription>Manage your store network and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Loading Stores...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your store data.</p>
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Store className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Stores Found</h3>
                  <p className="text-muted-foreground mb-4">No stores match your current search criteria.</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedStores.length === filteredStores.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Number of ESLs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStores.includes(store.id)}
                              onCheckedChange={(checked) => handleSelectStore(store.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{store.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{store.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>{store.manager}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{store.eslCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={store.status} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{store.lastSync}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(store)}>
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
                                  <DropdownMenuItem onClick={() => handleEdit(store)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Store
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    View ESLs
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteStore(store.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Store
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

        {/* Store Modal */}
        <StoreModal
          store={selectedStore}
          isOpen={isStoreModalOpen}
          onClose={() => {
            setIsStoreModalOpen(false)
            setSelectedStore(null)
          }}
          onSuccess={handleStoreSuccess}
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                {deleteTarget?.type === 'single' 
                  ? 'Are you sure you want to delete this store? This action cannot be undone.'
                  : `Are you sure you want to delete ${selectedStores.length} selected store(s)? This action cannot be undone.`
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
