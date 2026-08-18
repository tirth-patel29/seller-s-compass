import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { authService } from '@/services/authService'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

export const Route = createFileRoute('/buyer')({
  component: BuyerLayout,
})

const NAV_ITEMS = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: LayoutDashboard },
  { label: "My Orders", to: "/buyer/orders", icon: Package },
  { label: "Wishlist", to: "/buyer/wishlist", icon: Heart },
  { label: "Addresses", to: "/buyer/addresses", icon: MapPin },
  { label: "Profile", to: "/buyer/profile", icon: User },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

function BuyerLayout() {
  const navigate = useNavigate()
  
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
          <span className="text-sm font-medium">Buyer Portal</span>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
          <nav className="flex-1 space-y-1 p-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
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
