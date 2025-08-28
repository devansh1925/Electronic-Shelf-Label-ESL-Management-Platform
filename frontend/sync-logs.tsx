"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
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
  RefreshCw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  },
  {
    title: "Sync Logs",
    icon: FileText,
    url: "/sync-logs",
    isActive: true,
  },
  {
    title: "Users",
    icon: Users,
    url: "/users",
  },
]

// Sample sync logs data
const syncLogsData = [
  {
    id: "1",
    eslId: "ESL-001",
    productName: "Premium Coffee Beans",
    gatewayId: "GW-001",
    storeName: "Downtown Store",
    status: "success",
    syncedAt: "2024-01-15 14:30:25",
    errorMessage: null,
    duration: "1.2s",
  },
  {
    id: "2",
    eslId: "ESL-002",
    productName: "Organic Milk",
    gatewayId: "GW-001",
    storeName: "Downtown Store",
    status: "failure",
    syncedAt: "2024-01-15 14:28:15",
    errorMessage: "Connection timeout - ESL not responding",
    duration: "30s",
  },
  {
    id: "3",
    eslId: "ESL-003",
    productName: "Whole Wheat Bread",
    gatewayId: "GW-002",
    storeName: "Mall Branch",
    status: "success",
    syncedAt: "2024-01-15 14:25:10",
    errorMessage: null,
    duration: "0.8s",
  },
  {
    id: "4",
    eslId: "ESL-004",
    productName: "Fresh Apples",
    gatewayId: "GW-003",
    storeName: "Airport Terminal",
    status: "failure",
    syncedAt: "2024-01-15 14:20:45",
    errorMessage: "Low battery - sync incomplete",
    duration: "15s",
  },
  {
    id: "5",
    eslId: "ESL-005",
    productName: "Greek Yogurt",
    gatewayId: "GW-002",
    storeName: "Mall Branch",
    status: "success",
    syncedAt: "2024-01-15 14:18:30",
    errorMessage: null,
    duration: "1.5s",
  },
]

const stores = ["All Stores", "Downtown Store", "Mall Branch", "Airport Terminal", "Suburban Outlet"]
const gateways = ["All Gateways", "GW-001", "GW-002", "GW-003", "GW-004"]
const products = [
  "All Products",
  "Premium Coffee Beans",
  "Organic Milk",
  "Whole Wheat Bread",
  "Fresh Apples",
  "Greek Yogurt",
]
const statusOptions = ["All Status", "success", "failure"]

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Success" }
      case "failure":
        return { color: "bg-red-100 text-red-800", icon: XCircle, text: "Failed" }
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" }
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
          <Input type="search" placeholder="Search sync logs..." className="w-[300px] pl-8" />
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

export default function SyncLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [storeFilter, setStoreFilter] = useState("All Stores")
  const [gatewayFilter, setGatewayFilter] = useState("All Gateways")
  const [productFilter, setProductFilter] = useState("All Products")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredLogs = syncLogsData.filter((log) => {
    const matchesSearch =
      log.eslId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.gatewayId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStore = storeFilter === "All Stores" || log.storeName === storeFilter
    const matchesGateway = gatewayFilter === "All Gateways" || log.gatewayId === gatewayFilter
    const matchesProduct = productFilter === "All Products" || log.productName === productFilter
    const matchesStatus = statusFilter === "All Status" || log.status === statusFilter

    return matchesSearch && matchesStore && matchesGateway && matchesProduct && matchesStatus
  })

  const recentFailures = syncLogsData.filter((log) => log.status === "failure").slice(0, 5)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sync Logs</h1>
              <p className="text-muted-foreground">Monitor ESL synchronization activity and troubleshoot issues</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Recent Failures Alert */}
          {recentFailures.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Sync Failures ({recentFailures.length})
                </CardTitle>
                <CardDescription className="text-red-700">
                  These ESLs failed to sync recently and may need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentFailures.map((failure) => (
                    <div key={failure.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{failure.eslId}</span>
                        <span className="text-sm text-muted-foreground">{failure.productName}</span>
                        <Badge variant="outline" className="text-xs">
                          {failure.gatewayId}
                        </Badge>
                      </div>
                      <div className="text-sm text-red-600">{failure.errorMessage}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <div className="lg:col-span-2">
                  <Label htmlFor="search">Search Logs</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by ESL ID, Product, or Gateway..."
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
                  <Label htmlFor="gateway-filter">Gateway</Label>
                  <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways.map((gateway) => (
                        <SelectItem key={gateway} value={gateway}>
                          {gateway}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="product-filter">Product</Label>
                  <Select value={productFilter} onValueChange={setProductFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
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

          {/* Sync Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>Complete history of ESL synchronization attempts</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Logs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No sync logs match your current search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStoreFilter("All Stores")
                      setGatewayFilter("All Gateways")
                      setProductFilter("All Products")
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
                        <TableHead>ESL ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Gateway ID</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Synced At</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Error Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.eslId}</TableCell>
                          <TableCell>{log.productName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.gatewayId}</Badge>
                          </TableCell>
                          <TableCell>{log.storeName}</TableCell>
                          <TableCell>
                            <StatusBadge status={log.status} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.syncedAt}</TableCell>
                          <TableCell className="text-sm">{log.duration}</TableCell>
                          <TableCell>
                            {log.errorMessage ? (
                              <span className="text-sm text-red-600">{log.errorMessage}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
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
