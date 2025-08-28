"use client"

import { useState, useEffect } from "react"
import { gatewaysApi, Gateway, GatewayCreate } from "@/lib/api/gateways"
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
  Wifi,
  WifiOff,
  Activity,
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
  Eye,
  AlertTriangle,
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
    isActive: true,
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

// Sample gateway data
const gatewaysData = [
  {
    id: "GW-001",
    storeName: "Downtown Store",
    storeId: "store-001",
    ipAddress: "192.168.1.100",
    firmwareVersion: "v2.1.3",
    lastHeartbeat: "2024-01-15 14:30:25",
    status: "online",
    syncCount: 245,
    errorCount: 2,
    uptime: "15 days",
  },
  {
    id: "GW-002",
    storeName: "Mall Branch",
    storeId: "store-002",
    ipAddress: "192.168.2.100",
    firmwareVersion: "v2.1.2",
    lastHeartbeat: "2024-01-15 14:25:10",
    status: "online",
    syncCount: 189,
    errorCount: 0,
    uptime: "8 days",
  },
  {
    id: "GW-003",
    storeName: "Airport Terminal",
    storeId: "store-003",
    ipAddress: "192.168.3.100",
    firmwareVersion: "v2.0.8",
    lastHeartbeat: "2024-01-15 13:45:30",
    status: "offline",
    syncCount: 156,
    errorCount: 15,
    uptime: "0 days",
  },
  {
    id: "GW-004",
    storeName: "Suburban Outlet",
    storeId: "store-004",
    ipAddress: "192.168.4.100",
    firmwareVersion: "v2.1.3",
    lastHeartbeat: "2024-01-15 14:28:45",
    status: "online",
    syncCount: 98,
    errorCount: 1,
    uptime: "22 days",
  },
]

const stores = ["All Stores", "Downtown Store", "Mall Branch", "Airport Terminal", "Suburban Outlet"]
const statusOptions = ["All Status", "online", "offline"]

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return { color: "bg-green-100 text-green-800", icon: Wifi, text: "Online" }
      case "offline":
        return { color: "bg-red-100 text-red-800", icon: WifiOff, text: "Offline" }
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

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
}

function GatewayModal({ gateway, isOpen, onClose, onSuccess }: { gateway?: any; isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    storeName: gateway?.storeName || "",
    storeId: gateway?.storeId || "",
    ipAddress: gateway?.ipAddress || "",
    firmwareVersion: gateway?.firmwareVersion || "v2.1.3",
    status: gateway?.status || "online",
  })

  // Reset form when modal opens/closes or gateway changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        storeName: gateway?.storeName || "",
        storeId: gateway?.storeId || "",
        ipAddress: gateway?.ipAddress || "",
        firmwareVersion: gateway?.firmwareVersion || "v2.1.3",
        status: gateway?.status || "online",
      })
    }
  }, [isOpen, gateway])

  const handleSubmit = async () => {
    if (!formData.storeName || !formData.storeId || !formData.ipAddress || !formData.firmwareVersion) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const gatewayData: GatewayCreate = {
        ...formData,
        lastHeartbeat: new Date().toISOString(),
        syncCount: 0,
        errorCount: 0,
        uptime: "0 days",
      }

      if (gateway) {
        // Update existing gateway
        await gatewaysApi.updateGateway(gateway.id, gatewayData)
      } else {
        // Create new gateway
        await gatewaysApi.createGateway(gatewayData)
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save gateway:', error)
      alert('Failed to save gateway. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{gateway ? "Edit Gateway" : "Register New Gateway"}</DialogTitle>
          <DialogDescription>
            {gateway ? "Update gateway information" : "Register a new gateway to your network"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="storeName">Store Name *</Label>
            <Select value={formData.storeName} onValueChange={(value) => {
              const storeIndex = stores.findIndex(store => store === value)
              setFormData({ 
                ...formData, 
                storeName: value,
                storeId: storeIndex > 0 ? `store-00${storeIndex}` : ""
              })
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.slice(1).map((store, index) => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ipAddress">IP Address *</Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              placeholder="192.168.1.100"
            />
          </div>
          <div>
            <Label htmlFor="firmwareVersion">Firmware Version *</Label>
            <Input
              id="firmwareVersion"
              value={formData.firmwareVersion}
              onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
              placeholder="v2.1.3"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (gateway ? "Update Gateway" : "Register Gateway")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ViewLogsModal({ gateway, isOpen, onClose }: { gateway?: any; isOpen: boolean; onClose: () => void }) {
  const sampleLogs = [
    { time: "14:30:25", event: "Heartbeat sent", status: "success" },
    { time: "14:25:10", event: "ESL sync completed", status: "success" },
    { time: "14:20:45", event: "Connection timeout", status: "error" },
    { time: "14:15:30", event: "Firmware update check", status: "success" },
    { time: "14:10:15", event: "ESL registration", status: "success" },
  ]

  if (!gateway) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gateway Logs - {gateway.id}</DialogTitle>
          <DialogDescription>Recent activity and sync history for this gateway</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sampleLogs.map((log, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">{log.time}</div>
              <div className="flex-1">{log.event}</div>
              <StatusBadge status={log.status} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
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
          <Input type="search" placeholder="Search gateways..." className="w-[300px] pl-8" />
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

export default function GatewaysManagement() {
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGateways, setSelectedGateways] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [storeFilter, setStoreFilter] = useState("All Stores")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false)
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState<any>(null)

  // Fetch gateways from API
  useEffect(() => {
    const fetchGateways = async () => {
      try {
        setLoading(true)
        const data = await gatewaysApi.getGateways()
        setGateways(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch gateways:', err)
        setError('Failed to load gateways. Please try again.')
        // Fallback to sample data if API fails
        setGateways(gatewaysData)
      } finally {
        setLoading(false)
      }
    }

    fetchGateways()
  }, [])

  const filteredGateways = gateways.filter((gateway) => {
    const matchesSearch =
      gateway.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gateway.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gateway.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStore = storeFilter === "All Stores" || gateway.storeName === storeFilter
    const matchesStatus = statusFilter === "All Status" || gateway.status === statusFilter

    return matchesSearch && matchesStore && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGateways(filteredGateways.map((gateway) => gateway.id))
    } else {
      setSelectedGateways([])
    }
  }

  const handleSelectGateway = (gatewayId: string, checked: boolean) => {
    if (checked) {
      setSelectedGateways([...selectedGateways, gatewayId])
    } else {
      setSelectedGateways(selectedGateways.filter((id) => id !== gatewayId))
    }
  }

  const handleEdit = (gateway: any) => {
    setSelectedGateway(gateway)
    setIsGatewayModalOpen(true)
  }

  const handleViewLogs = (gateway: any) => {
    setSelectedGateway(gateway)
    setIsLogsModalOpen(true)
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
              <h1 className="text-3xl font-bold tracking-tight">Gateway Management</h1>
              <p className="text-muted-foreground">Monitor and manage ESL gateways across your stores</p>
            </div>
            <Button onClick={() => setIsGatewayModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Register Gateway
            </Button>
          </div>

          {/* Filters */}
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
                  <Label htmlFor="search">Search Gateways</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by Gateway ID, Store, or IP..."
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
                      {stores.map((store) => (
                        <SelectItem key={store} value={store}>
                          {store}
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
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedGateways.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedGateways.length} gateway{selectedGateways.length > 1 ? "s" : ""} selected
                  </span>
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

          {/* Gateways Table */}
          <Card>
            <CardHeader>
              <CardTitle>Gateways ({filteredGateways.length})</CardTitle>
              <CardDescription>Monitor gateway status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Loading Gateways...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your gateway data.</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Error Loading Gateways</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      // Retry fetching
                      const fetchGateways = async () => {
                        try {
                          setLoading(true)
                          const data = await gatewaysApi.getGateways()
                          setGateways(data)
                          setError(null)
                        } catch (err) {
                          console.error('Failed to fetch gateways:', err)
                          setError('Failed to load gateways. Please try again.')
                          setGateways(gatewaysData)
                        } finally {
                          setLoading(false)
                        }
                      }
                      fetchGateways()
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredGateways.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Router className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Gateways Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No gateways match your current search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStoreFilter("All Stores")
                      setStatusFilter("All Status")
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
                            checked={selectedGateways.length === filteredGateways.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Gateway ID</TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Firmware Version</TableHead>
                        <TableHead>Last Heartbeat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sync Count</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedGateways.includes(gateway.id)}
                              onCheckedChange={(checked) => handleSelectGateway(gateway.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{gateway.id}</TableCell>
                          <TableCell>{gateway.storeName}</TableCell>
                          <TableCell className="font-mono text-sm">{gateway.ipAddress}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{gateway.firmwareVersion}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{getRelativeTime(gateway.lastHeartbeat)}</span>
                              <span className="text-xs text-muted-foreground">{gateway.lastHeartbeat}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={gateway.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{gateway.syncCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {gateway.errorCount > 0 ? (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 font-medium">{gateway.errorCount}</span>
                              </div>
                            ) : (
                              <span className="text-green-600">0</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewLogs(gateway)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(gateway)}>
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
                                  <DropdownMenuItem onClick={() => handleViewLogs(gateway)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Logs
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(gateway)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Gateway
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Gateway
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

        {/* Modals */}
        <GatewayModal
          gateway={selectedGateway}
          isOpen={isGatewayModalOpen}
          onClose={() => {
            setIsGatewayModalOpen(false)
            setSelectedGateway(null)
          }}
          onSuccess={() => {
            // Refresh the gateways list
            const fetchGateways = async () => {
              try {
                setLoading(true)
                const data = await gatewaysApi.getGateways()
                setGateways(data)
                setError(null)
              } catch (err) {
                console.error('Failed to fetch gateways:', err)
                setError('Failed to load gateways. Please try again.')
              } finally {
                setLoading(false)
              }
            }
            fetchGateways()
          }}
        />
        <ViewLogsModal
          gateway={selectedGateway}
          isOpen={isLogsModalOpen}
          onClose={() => {
            setIsLogsModalOpen(false)
            setSelectedGateway(null)
          }}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
