import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, Package, ShoppingCart, Ship, AlertCircle } from 'lucide-react'
import { useAppState } from '@/services/db'
import { Button } from '@/components/ui/button'
import { inr } from '@/lib/format'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const state = useAppState()
  
  const revenue = state.orders.reduce((sum, o) => sum + o.total, 0)
  const pendingCustoms = state.exportOrders.filter(e => e.status === 'submitted' || e.status === 'customs').length

  const stats = [
    { label: "Total Sellers", value: state.sellers.length, icon: Users },
    { label: "Total Products", value: state.products.length, icon: Package },
    { label: "Total Orders", value: state.orders.length, icon: ShoppingCart },
    { label: "Pending Customs", value: pendingCustoms, icon: Ship, alert: pendingCustoms > 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">DNK Operations Dashboard</h1>
        <p className="text-muted-foreground">Overview of the national Dak Ghar Niryat Kendra network.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
                {s.value}
                {s.alert && <AlertCircle className="size-4 text-destructive" />}
              </p>
            </div>
            <div className={`rounded-full p-3 ${s.alert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <s.icon className="size-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Export Orders</h2>
            <Button variant="link" asChild><Link to="/admin/export-orders">View all</Link></Button>
          </div>
          <div className="space-y-4">
            {state.exportOrders.slice(0, 5).map(e => (
              <div key={e.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface">
                <div>
                  <p className="font-medium text-sm">Order #{e.orderId}</p>
                  <p className="text-xs text-muted-foreground capitalize">Status: {e.status}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                   <Link to="/admin/export-orders">Review</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Network Revenue</h2>
            <Button variant="link" asChild><Link to="/admin/analytics">Analytics</Link></Button>
          </div>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Export Volume</p>
              <p className="text-4xl font-bold text-primary mt-2">{inr(revenue)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
