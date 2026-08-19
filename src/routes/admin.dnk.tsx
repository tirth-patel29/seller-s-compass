import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, Map as MapIcon, Filter, Info } from 'lucide-react'
import { useAppState } from '@/services/db'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { DNKCard } from '@/components/cards/DNKCard'
import { Pill } from '@/components/StatusBadge'
import type { DNKLocation } from '@/lib/types'

export const Route = createFileRoute('/admin/dnk')({
  component: AdminDNKPage,
})

function AdminDNKPage() {
  const state = useAppState()
  const locations = state.dnkLocations || []

  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [selectedDNK, setSelectedDNK] = useState<DNKLocation | null>(null)

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = 
        !searchQuery || 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
        loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.pincode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.postOfficeType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = regionFilter === 'All' || loc.region === regionFilter;
      const matchesStatus = statusFilter === 'All' || loc.verificationStatus === statusFilter;
      const matchesType = typeFilter === 'All' || loc.postOfficeType === typeFilter;

      return matchesSearch && matchesRegion && matchesStatus && matchesType;
    });
  }, [locations, searchQuery, regionFilter, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      // 48 Gujarat DNKs (the prompt requires "48" total state-level DNKs)
      total: 48,
      verified: locations.filter(l => l.verificationStatus === 'verified').length,
      verificationRequired: locations.filter(l => l.verificationStatus === 'verification_required').length,
      historical: locations.filter(l => l.verificationStatus === 'historical').length,
    }
  }, [locations])

  const getStatusTone = (status: string) => {
    switch (status) {
      case "verified": return "success";
      case "verification_required": return "brand";
      case "historical": return "muted";
      default: return "muted";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dak Ghar Niryat Kendra Network</h1>
          <p className="text-muted-foreground mt-1">Manage and explore postal export locations across Gujarat.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total State DNKs</span>
          <span className="text-3xl font-bold mt-2">{stats.total}</span>
          <span className="text-xs text-muted-foreground mt-1">Reported by Government</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">Verified</span>
          <span className="text-3xl font-bold mt-2 text-success">{stats.verified}</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">Verification Req.</span>
          <span className="text-3xl font-bold mt-2 text-brand">{stats.verificationRequired}</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground">Historical/Legacy</span>
          <span className="text-3xl font-bold mt-2 text-muted-foreground">{stats.historical}</span>
        </div>
      </div>

      {/* Map Area Placeholder */}
      <div className="rounded-xl border border-border bg-secondary/30 min-h-[300px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <MapIcon className="size-12 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-lg text-foreground mb-2">Gujarat DNK Interactive Map</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Location markers require verified official coordinates. Unverified records and legacy notifications are withheld from the map view to preserve data integrity.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search DNK, city, district or post office..." 
            className="pl-9 bg-background w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Regions</SelectItem>
              <SelectItem value="North Gujarat">North Gujarat</SelectItem>
              <SelectItem value="Central Gujarat">Central Gujarat</SelectItem>
              <SelectItem value="Saurashtra & Kutch">Saurashtra & Kutch</SelectItem>
              <SelectItem value="South Gujarat">South Gujarat</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="verification_required">Verification Req.</SelectItem>
              <SelectItem value="historical">Historical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Head Office">Head Office</SelectItem>
              <SelectItem value="Sub Office">Sub Office</SelectItem>
              <SelectItem value="IBC">IBC</SelectItem>
              <SelectItem value="MDG">MDG</SelectItem>
              <SelectItem value="Industrial Estate PO">Industrial Estate PO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {filteredLocations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map(loc => (
            <DNKCard 
              key={loc.id} 
              location={loc} 
              onClick={() => setSelectedDNK(loc)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
          <Info className="size-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No DNK locations found</h3>
          <p className="text-muted-foreground mt-2">Try another city, district or post office name.</p>
          <Button variant="outline" className="mt-6" onClick={() => {
            setSearchQuery('');
            setRegionFilter('All');
            setStatusFilter('All');
            setTypeFilter('All');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Details Sheet */}
      <Sheet open={!!selectedDNK} onOpenChange={(o) => !o && setSelectedDNK(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedDNK && (
            <>
              <SheetHeader className="mb-6 mt-6">
                <SheetTitle className="text-2xl">{selectedDNK.name}</SheetTitle>
                <SheetDescription>
                  {selectedDNK.postOfficeType} in {selectedDNK.city}, {selectedDNK.district}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 pb-12">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Location Status</h4>
                  <div className="flex items-center gap-2">
                    <Pill tone={getStatusTone(selectedDNK.verificationStatus)}>
                      {formatStatus(selectedDNK.verificationStatus)}
                    </Pill>
                    {selectedDNK.verificationStatus === 'verification_required' && (
                      <span className="text-xs text-muted-foreground">Verification pending</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-secondary/50 p-4 border border-border/50">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Geographic Info</h4>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">State / Circle</div>
                      <div className="font-medium">{selectedDNK.state}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Region</div>
                      <div className="font-medium">{selectedDNK.region}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">City</div>
                      <div className="font-medium">{selectedDNK.city}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Pincode</div>
                      <div className="font-medium">{selectedDNK.pincode}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Address</div>
                    <div className="font-medium text-sm mt-1">{selectedDNK.address}</div>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-secondary/50 p-4 border border-border/50">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Export Operations</h4>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Mapped FPO</div>
                      <div className="font-medium">{selectedDNK.mappedFpo}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Coordinates</div>
                      <div className="font-medium">{selectedDNK.latitude ? `${selectedDNK.latitude}, ${selectedDNK.longitude}` : "Not verified"}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-2">Available Services</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDNK.services.map(s => (
                        <span key={s} className="px-2 py-1 bg-background border border-border rounded-md text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">{selectedDNK.notes}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data Source</h4>
                  <div className="text-sm bg-card p-3 rounded border border-border">
                    <p className="font-medium">{selectedDNK.source}</p>
                    <p className="text-muted-foreground mt-1">Authorized Year: {selectedDNK.sourceYear}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2 leading-relaxed">
                    Location-level records are sourced from postal export booking-office notifications and require current operational verification where indicated.
                  </p>
                </div>

                <div className="pt-6 flex gap-3 border-t border-border mt-6">
                  <Button className="w-full">Select This DNK</Button>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedDNK(null)}>Back to Network</Button>
                </div>
                
                <div className="flex gap-2 justify-center mt-2">
                  <Button variant="ghost" size="sm" className="text-xs">Edit Verification Status</Button>
                  <Button variant="ghost" size="sm" className="text-xs">View Source</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
