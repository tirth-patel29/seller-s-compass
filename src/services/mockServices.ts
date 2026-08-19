import { initialState } from "@/data/seed";
import type { Product, Seller, Order, ExportOrder, Shipment, AppState } from "@/lib/types";

// In-memory state for mock services
let state: AppState = { ...initialState };

// Products
export const getProducts = async (): Promise<Product[]> => {
  return [...state.products];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return state.products.find(p => p.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return state.products.filter(p => p.category === category);
};

export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  return state.products.filter(p => p.sellerId === sellerId);
};

export const createProduct = async (product: Omit<Product, "id" | "createdAt" | "views">): Promise<Product> => {
  const newProduct: Product = {
    ...product,
    id: `prd-${Date.now()}`,
    createdAt: new Date().toISOString(),
    views: 0,
  };
  state.products.push(newProduct);
  return newProduct;
};

// Sellers
export const getSellers = async (): Promise<Seller[]> => {
  return [...state.sellers];
};

export const getSellerById = async (id: string): Promise<Seller | undefined> => {
  return state.sellers.find(s => s.id === id);
};

// Orders
export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  return state.orders.filter(o => o.sellerId === sellerId);
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return state.orders.find(o => o.id === id);
};

// Export Orders
export const getExportOrdersBySeller = async (sellerId: string): Promise<ExportOrder[]> => {
  const sellerOrders = await getOrdersBySeller(sellerId);
  const sellerOrderIds = sellerOrders.map(o => o.id);
  return state.exportOrders.filter(eo => sellerOrderIds.includes(eo.orderId));
};

export const getExportOrderById = async (id: string): Promise<ExportOrder | undefined> => {
  return state.exportOrders.find(eo => eo.id === id);
};

export const getExportOrderByOrderId = async (orderId: string): Promise<ExportOrder | undefined> => {
  return state.exportOrders.find(eo => eo.orderId === orderId);
};

export const updateExportChecklist = async (orderId: string, checklist: Partial<ExportOrder['checklist']>): Promise<ExportOrder | undefined> => {
  const eo = state.exportOrders.find(e => e.orderId === orderId);
  if (eo) {
    eo.checklist = { ...eo.checklist, ...checklist };
  }
  return eo;
};

export const generateExportDocuments = async (orderId: string): Promise<ExportOrder | undefined> => {
  const eo = state.exportOrders.find(e => e.orderId === orderId);
  if (eo) {
    eo.documentsGenerated = true;
  }
  return eo;
};

export const submitToDNK = async (orderId: string, dnkName: string): Promise<{ exportOrder: ExportOrder, shipment: Shipment } | undefined> => {
  const order = state.orders.find(o => o.id === orderId);
  const eo = state.exportOrders.find(e => e.orderId === orderId);
  
  if (order && eo) {
    order.status = "dnk_submitted";
    eo.status = "submitted";
    eo.dnk = dnkName;
    eo.submittedAt = new Date().toISOString();
    eo.pbeRef = `DNK${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const shipment: Shipment = {
      id: `SHP-${Date.now()}`,
      orderId: order.id,
      exportOrderId: eo.id,
      trackingId: `DNK-TRK-${new Date().getFullYear()}-${order.id.split('-')[1]}`,
      destination: order.destinationCountry,
      stage: "preparing",
      eta: "Pending calculation",
      events: [{ date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), label: "DNK submission created", location: dnkName }]
    };
    state.shipments.push(shipment);
    
    return { exportOrder: eo, shipment };
  }
  return undefined;
};

// Shipments
export const getShipmentByTrackingId = async (trackingId: string): Promise<Shipment | undefined> => {
  return state.shipments.find(s => s.trackingId === trackingId);
};

export const getShipmentsBySeller = async (sellerId: string): Promise<Shipment[]> => {
  const sellerOrders = await getOrdersBySeller(sellerId);
  const sellerOrderIds = sellerOrders.map(o => o.id);
  return state.shipments.filter(s => sellerOrderIds.includes(s.orderId));
};
