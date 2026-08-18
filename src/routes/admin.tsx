import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Users, Package, ShoppingCart, Ship, Plane, MapPin, BarChart3, LogOut } from 'lucide-react'
import { authService } from '@/services/authService'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Sellers", to: "/admin/sellers", icon: Users },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Export Customs", to: "/admin/export-orders", icon: Ship },
  { label: "Shipments", to: "/admin/shipments", icon: Plane },
  { label: "DNK Network", to: "/admin/dnk", icon: MapPin },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

function AdminLayout() {
  const navigate = useNavigate()
  const router = useRouterState()
  const pathname = router.location.pathname
  
  const handleLogout = async () => {
    await authService.logout()
    toast.success("Logged out successfully")
    navigate({ to: "/login" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-primary" />
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium">DNK Operations Admin</span>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
          <nav className="flex-1 space-y-1 p-4">
            {NAV_ITEMS.map((item) => {
              const isActive = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </aside>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
