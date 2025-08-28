"use client"
import {
  Bell,
  ChevronDown,
  Home,
  Store,
  Package,
  Tag,
  Router,
  FileText,
  Users,
  Search,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  Battery,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
import { Progress } from "@/components/ui/progress"
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
import { useAuth } from "@/contexts/auth-context"

// Navigation items with correct URLs
const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    isActive: true,
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
  },
  {
    title: "Users",
    icon: Users,
    url: "/users",
  },
]

// Sample data
const dashboardData = {
  totalStores: 24,
  activeESLs: 1847,
  offlineESLs: 23,
  lastSyncErrors: 5,
  batteryHealth: 87,
  recentActivity: [
    { store: "Store #001", status: "online", lastSync: "2 min ago" },
    { store: "Store #002", status: "offline", lastSync: "1 hour ago" },
    { store: "Store #003", status: "online", lastSync: "5 min ago" },
    { store: "Store #004", status: "sync_error", lastSync: "30 min ago" },
  ],
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
  const { user, logout } = useAuth()

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
                <span className="text-sm font-medium">{user?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.role || "User"}</span>
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
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  status,
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
  status?: "success" | "warning" | "error"
}) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-primary"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getStatusColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )
}

function StatusIndicator({ status }: { status: "online" | "offline" | "sync_error" }) {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return { color: "bg-green-500", icon: CheckCircle, text: "Online" }
      case "offline":
        return { color: "bg-red-500", icon: XCircle, text: "Offline" }
      case "sync_error":
        return { color: "bg-yellow-500", icon: AlertTriangle, text: "Sync Error" }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${config.color}`} />
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{config.text}</span>
    </div>
  )
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />

        <main className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your ESL network performance</p>
            </div>
            <Button>
              <Wifi className="mr-2 h-4 w-4" />
              Sync All Stores
            </Button>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Stores"
              value={dashboardData.totalStores}
              icon={Store}
              trend="+2 from last month"
              status="success"
            />
            <MetricCard
              title="Active ESLs"
              value={dashboardData.activeESLs.toLocaleString()}
              icon={Wifi}
              trend="+12% from last week"
              status="success"
            />
            <MetricCard
              title="Offline ESLs"
              value={dashboardData.offlineESLs}
              icon={WifiOff}
              trend="3 critical issues"
              status="error"
            />
            <MetricCard
              title="Sync Errors"
              value={dashboardData.lastSyncErrors}
              icon={AlertTriangle}
              trend="Resolved: 8 today"
              status="warning"
            />
          </div>

          {/* Additional Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Battery Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Battery Health
                </CardTitle>
                <CardDescription>Average battery level across all ESLs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{dashboardData.batteryHealth}%</span>
                    <span className="text-sm text-green-600">Good</span>
                  </div>
                  <Progress value={dashboardData.batteryHealth} className="h-2" />
                  <p className="text-xs text-muted-foreground">23 ESLs need battery replacement</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Store Activity</CardTitle>
                <CardDescription>Latest sync status from your stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{activity.store}</div>
                        <StatusIndicator status={activity.status as any} />
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.lastSync}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Tag className="h-6 w-6" />
                  Register ESL
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Wifi className="h-6 w-6" />
                  Trigger Manual Sync
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Package className="h-6 w-6" />
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
