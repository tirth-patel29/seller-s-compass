import { getState, setState } from "./db";
import type { Product, Seller, Order, ExportOrder, Shipment, OrderStatus, ChecklistKey } from "@/lib/types";

// Products
export const getProducts = async (): Promise<Product[]> => {
  return [...getState().products];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return getState().products.find(p => p.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return getState().products.filter(p => p.category === category);
};

export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  return getState().products.filter(p => p.sellerId === sellerId);
};

export const createProduct = async (product: Omit<Product, "id" | "createdAt" | "views">): Promise<Product> => {
  const newProduct: Product = {
    ...product,
    id: `prd-${Date.now()}`,
    createdAt: new Date().toISOString(),
    views: 0,
  };
  setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  return newProduct;
};

// Sellers
export const getSellers = async (): Promise<Seller[]> => {
  return [...getState().sellers];
};

export const getSellerById = async (id: string): Promise<Seller | undefined> => {
  return getState().sellers.find(s => s.id === id);
};

// Orders
export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  return getState().orders.filter(o => o.sellerId === sellerId);
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return getState().orders.find(o => o.id === id);
};

export const createOrder = async (order: Order): Promise<Order> => {
  setState(prev => ({ ...prev, orders: [...prev.orders, order] }));
  return order;
};

// Export Orders
export const getExportOrdersBySeller = async (sellerId: string): Promise<ExportOrder[]> => {
  const sellerOrders = await getOrdersBySeller(sellerId);
  const sellerOrderIds = sellerOrders.map(o => o.id);
  return getState().exportOrders.filter(eo => sellerOrderIds.includes(eo.orderId));
};

export const getExportOrderById = async (id: string): Promise<ExportOrder | undefined> => {
  return getState().exportOrders.find(eo => eo.id === id);
};

export const getExportOrderByOrderId = async (orderId: string): Promise<ExportOrder | undefined> => {
  return getState().exportOrders.find(eo => eo.orderId === orderId);
};

export const updateExportChecklist = async (orderId: string, checklist: Partial<Record<ChecklistKey, boolean>>): Promise<ExportOrder | undefined> => {
  let updatedEo: ExportOrder | undefined;
  
  setState(prev => {
    const eoIndex = prev.exportOrders.findIndex(e => e.orderId === orderId);
    if (eoIndex === -1) return prev;
    
    const newExportOrders = [...prev.exportOrders];
    const current = newExportOrders[eoIndex] as ExportOrder;
    newExportOrders[eoIndex] = {
      ...current,
      checklist: { ...current.checklist, ...checklist }
    } as ExportOrder;
    
    updatedEo = newExportOrders[eoIndex] as ExportOrder;
    return { ...prev, exportOrders: newExportOrders };
  });
  
  return updatedEo;
};

export const updateExportDetails = async (orderId: string, updates: Partial<ExportOrder>): Promise<ExportOrder | undefined> => {
  let updatedEo: ExportOrder | undefined;
  
  setState(prev => {
    const eoIndex = prev.exportOrders.findIndex(e => e.orderId === orderId);
    if (eoIndex === -1) return prev;
    
    const newExportOrders = [...prev.exportOrders];
    const current = newExportOrders[eoIndex] as ExportOrder;
    newExportOrders[eoIndex] = {
      ...current,
      ...updates,
      checklist: {
        ...current.checklist,
        ...(updates.checklist || {})
      }
    } as ExportOrder;
    
    const updated = newExportOrders[eoIndex] as ExportOrder;
    
    // Auto-update order status if 100% ready
    const isReady = Object.values(updated.checklist).every(Boolean);
    const newOrders = [...prev.orders];
    const orderIndex = newOrders.findIndex(o => o.id === orderId);
    
    if (isReady && orderIndex !== -1 && newOrders[orderIndex]?.status === 'export_pending') {
      const currentOrder = newOrders[orderIndex] as Order;
      newOrders[orderIndex] = { ...currentOrder, status: 'export_ready' as OrderStatus } as Order;
    }
    
    updatedEo = updated;
    return { ...prev, exportOrders: newExportOrders, orders: newOrders };
  });
  
  return updatedEo;
};


export const generateExportDocuments = async (orderId: string): Promise<ExportOrder | undefined> => {
  let updatedEo: ExportOrder | undefined;
  
  setState(prev => {
    const eoIndex = prev.exportOrders.findIndex(e => e.orderId === orderId);
    if (eoIndex === -1) return prev;
    
    const newExportOrders = [...prev.exportOrders];
    const current = newExportOrders[eoIndex] as ExportOrder;
    newExportOrders[eoIndex] = { ...current, documentsGenerated: true } as ExportOrder;
    updatedEo = newExportOrders[eoIndex] as ExportOrder;
    return { ...prev, exportOrders: newExportOrders };
  });
  
  return updatedEo;
};

export const submitToDNK = async (orderId: string, dnkName: string): Promise<{ exportOrder: ExportOrder, shipment: Shipment } | undefined> => {
  let result: { exportOrder: ExportOrder, shipment: Shipment } | undefined;
  
  setState(prev => {
    const orderIndex = prev.orders.findIndex(o => o.id === orderId);
    const eoIndex = prev.exportOrders.findIndex(e => e.orderId === orderId);
    
    if (orderIndex === -1 || eoIndex === -1) return prev;
    
    const newOrders = [...prev.orders];
    const newExportOrders = [...prev.exportOrders];
    const newShipments = [...prev.shipments];
    
    const currentOrder = newOrders[orderIndex] as Order;
    const currentEo = newExportOrders[eoIndex] as ExportOrder;
    
    newOrders[orderIndex] = { ...currentOrder, status: "dnk_submitted" as OrderStatus } as Order;
    
    newExportOrders[eoIndex] = {
      ...currentEo,
      status: "submitted",
      dnk: dnkName,
      submittedAt: new Date().toISOString(),
      pbeRef: `DNK${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    } as ExportOrder;
    
    const updatedOrder = newOrders[orderIndex] as Order;
    const updatedEo = newExportOrders[eoIndex] as ExportOrder;
    
    const shipment: Shipment = {
      id: `SHP-${Date.now()}`,
      orderId: updatedOrder.id,
      exportOrderId: updatedEo.id,
      trackingId: `DNK-TRK-${new Date().getFullYear()}-${updatedOrder.id.split('-')[1]}`,
      destination: updatedOrder.destinationCountry,
      stage: "preparing",
      eta: "Pending calculation",
      events: [{ date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), label: "DNK submission created", location: dnkName }]
    };
    
    newShipments.push(shipment);
    
    result = { exportOrder: updatedEo, shipment };
    
    return { ...prev, orders: newOrders, exportOrders: newExportOrders, shipments: newShipments };
  });
  
  return result;
};

// Shipments
export const getShipmentByTrackingId = async (trackingId: string): Promise<Shipment | undefined> => {
  return getState().shipments.find(s => s.trackingId === trackingId);
};

export const getShipmentsBySeller = async (sellerId: string): Promise<Shipment[]> => {
  const sellerOrders = await getOrdersBySeller(sellerId);
  const sellerOrderIds = sellerOrders.map(o => o.id);
  return getState().shipments.filter(s => sellerOrderIds.includes(s.orderId));
};
