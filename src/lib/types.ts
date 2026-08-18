export type Role = "seller" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  sellerId?: string;
}

export interface Seller {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  country: string;
  category: string;
  businessType: string;
  story: string;
  identityVerified: boolean;
  businessVerified: boolean;
  originDeclared: boolean;
  exportEnabled: boolean;
  orders: number;
  deliveries: number;
  rating: number;
  joined: string;
}

export type ProductStatus = "draft" | "published";

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  weightKg: number;
  dimensions: { length: number; width: number; height: number };
  quantity: number;
  origin: string;
  image: string;
  status: ProductStatus;
  views: number;
  keywords: string[];
  highlights: string[];
  createdAt: string;
}

export type OrderStatus =
  | "placed"
  | "export_pending"
  | "dnk_submitted"
  | "customs"
  | "in_transit"
  | "delivered";

export interface Order {
  id: string;
  productId: string;
  sellerId: string;
  buyerName: string;
  buyerEmail: string;
  destinationCountry: string;
  address: string;
  quantity: number;
  unitPrice: number;
  shipping: number;
  fees: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type ChecklistKey =
  | "seller"
  | "product"
  | "destination"
  | "packageInfo"
  | "exportInfo"
  | "documents"
  | "dnk";

export interface ExportOrder {
  id: string;
  orderId: string;
  checklist: Record<ChecklistKey, boolean>;
  packageInfo: { length: string; width: string; height: string; weight: string };
  exportInfo: { hsCode: string; declaredValue: string; purpose: string };
  documents: { invoice: boolean; originDeclaration: boolean };
  documentsGenerated?: boolean;
  dnk: string;
  pbeRef?: string;
  status: "draft" | "submitted" | "customs" | "cleared";
  submittedAt?: string;
}

export type ShipmentStage =
  | "order_confirmed"
  | "export_processing"
  | "dnk_submitted"
  | "customs"
  | "preparing"
  | "dispatched"
  | "in_transit"
  | "delivered";

export interface TrackingEvent {
  date: string;
  label: string;
  location?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  exportOrderId: string;
  trackingId: string;
  destination: string;
  stage: ShipmentStage;
  eta: string;
  events: TrackingEvent[];
}

export interface AppState {
  users: User[];
  sellers: Seller[];
  products: Product[];
  orders: Order[];
  exportOrders: ExportOrder[];
  shipments: Shipment[];
  currentUserId: string | null;
}
