import type { Product, Seller, Order, User, ExportOrder, Shipment, AppState } from "@/lib/types";
import { INITIAL_DNK_LOCATIONS } from "./dnkData";
import { getProductImage } from "./assets";

export const CATEGORIES = [
  "Handicrafts",
  "Textiles & Handloom",
  "Home Decor",
  "Jewellery & Accessories",
  "Art & Paintings",
  "Bags & Accessories",
  "Pottery & Terracotta",
  "Woodcraft",
  "Metalcraft",
  "Traditional & Cultural Products",
  "Gifts & Collectibles",
  "Specialty Products",
];


export const DESTINATIONS = ["United States", "United Kingdom", "Germany", "Australia", "Canada"];

export const DNK_CENTRES = ["Anand DNK", "Ahmedabad DNK", "Jaipur DNK", "Kolkata DNK", "Chennai DNK"];

const seller = (
  id: string,
  name: string,
  ownerName: string,
  location: string,
  category: string,
  story: string,
  stats: [number, number, number],
): Seller => ({
  id,
  name,
  ownerName,
  location,
  country: "India",
  category,
  businessType: "Artisan / MSME",
  story,
  identityVerified: true,
  businessVerified: true,
  originDeclared: true,
  exportEnabled: true,
  orders: stats[0],
  deliveries: stats[1],
  rating: stats[2],
  joined: "2024",
});

export const sellers: Seller[] = [
  seller(
    "slr-1",
    "Meena Handicrafts",
    "Meena Patel",
    "Kutch, Gujarat",
    "Handcrafted Bags",
    "Meena leads a collective of 24 women artisans in Kutch who have practised mirror-work embroidery for three generations. Every bag is hand-stitched over four days using naturally dyed cotton.",
    [128, 124, 4.9],
  ),
  seller(
    "slr-2",
    "Bhuj Handloom Co-op",
    "Ramesh Vankar",
    "Bhuj, Gujarat",
    "Handloom Textiles",
    "A weaver co-operative producing handloom stoles on pit looms, working with natural indigo since 1978.",
    [96, 92, 4.8],
  ),
  seller(
    "slr-3",
    "Kumhar Clay Studio",
    "Sita Devi",
    "Khurja, Uttar Pradesh",
    "Terracotta & Decor",
    "A family terracotta studio shaping and kiln-firing decor pieces using local river clay.",
    [74, 70, 4.7],
  ),
  seller(
    "slr-4",
    "Saharanpur Woodworks",
    "Imran Sheikh",
    "Saharanpur, Uttar Pradesh",
    "Wood Craft",
    "Third-generation carvers producing sheesham wood pieces with traditional jali carving.",
    [61, 59, 4.6],
  ),
  seller(
    "slr-5",
    "Madhubani Art House",
    "Anjali Jha",
    "Madhubani, Bihar",
    "Indian Paintings",
    "Mithila painters creating hand-painted works on handmade paper with natural pigments.",
    [52, 50, 4.9],
  ),
  seller(
    "slr-6",
    "Jaipur Silver Craft",
    "Vikram Soni",
    "Jaipur, Rajasthan",
    "Traditional Jewelry",
    "Silversmiths producing meenakari and oxidised silver jewellery in the old city of Jaipur.",
    [143, 138, 4.8],
  ),
  seller(
    "slr-7",
    "Channapatna Toys",
    "Lakshmi Rao",
    "Channapatna, Karnataka",
    "Wood Craft",
    "Lacquerware turners making non-toxic, vegetable-dyed wooden pieces.",
    [39, 37, 4.5],
  ),
  seller(
    "slr-8",
    "Pochampally Weaves",
    "Sridevi Reddy",
    "Pochampally, Telangana",
    "Handloom Textiles",
    "Ikat weavers producing GI-tagged Pochampally textiles for global buyers.",
    [88, 85, 4.7],
  ),
];

const P = (
  id: string,
  sellerId: string,
  name: string,
  category: string,
  price: number,
  origin: string,
  image: string,
  description: string,
  views: number,
  status: "draft" | "published" = "published",
): Product => ({
  id,
  sellerId,
  name,
  category,
  description,
  price,
  currency: "INR",
  weightKg: 0.6,
  dimensions: { length: 30, width: 22, height: 10 },
  quantity: 25,
  origin,
  image,
  status,
  views,
  keywords: [],
  highlights: [],
  createdAt: "2026-07-12",
});

export const products: Product[] = [
  {
    ...P("prd-1", "slr-1", "Handcrafted Kutch Embroidery Bag", "Bags & Accessories", 1999, "Gujarat, India", getProductImage("prd-1"), "A hand-embroidered shoulder bag made in Kutch using traditional mirror work and naturally dyed cotton.", 1284),
    weightKg: 1.0
  },
  P("prd-2", "slr-1", "Mirror Work Potli Pouch", "Bags & Accessories", 899, "Gujarat, India", getProductImage("prd-2"), "A small drawstring potli pouch with hand-set mirror work.", 642),
  P("prd-3", "slr-1", "Kutch Embroidered Tote", "Bags & Accessories", 2499, "Gujarat, India", getProductImage("prd-3"), "A roomy everyday tote with dense hand embroidery across the front panel.", 431),
  P("prd-4", "slr-2", "Indigo Handloom Stole", "Textiles & Handloom", 1650, "Gujarat, India", getProductImage("prd-4"), "Handwoven cotton stole dyed with natural indigo on a traditional pit loom.", 902),
  P("prd-5", "slr-2", "Handloom Cotton Runner", "Textiles & Handloom", 1250, "Gujarat, India", getProductImage("prd-5"), "A handwoven table runner in undyed cotton with indigo borders.", 318),
  P("prd-6", "slr-3", "Terracotta Decorative Vase", "Pottery & Terracotta", 1450, "Uttar Pradesh, India", getProductImage("prd-6"), "Wheel-thrown terracotta vase with hand-carved geometric bands.", 522),
  P("prd-7", "slr-3", "Terracotta Tea Light Set", "Pottery & Terracotta", 750, "Uttar Pradesh, India", getProductImage("prd-7"), "Set of six hand-shaped terracotta tea light holders.", 289),
  P("prd-8", "slr-4", "Carved Sheesham Wall Panel", "Woodcraft", 4200, "Uttar Pradesh, India", getProductImage("prd-8"), "Hand-carved sheesham wood jali panel finished with natural wax.", 401),
  P("prd-9", "slr-4", "Wooden Spice Box", "Woodcraft", 1850, "Uttar Pradesh, India", getProductImage("prd-9"), "Traditional masala dabba turned and carved from sheesham wood.", 265),
  P("prd-10", "slr-5", "Madhubani Fish Motif Painting", "Art & Paintings", 3600, "Bihar, India", getProductImage("prd-10"), "Hand-painted Mithila artwork on handmade paper using natural pigments.", 613),
  P("prd-11", "slr-5", "Mithila Tree of Life Artwork", "Art & Paintings", 5200, "Bihar, India", getProductImage("prd-11"), "A large Tree of Life composition painted in the Madhubani tradition.", 344),
  P("prd-12", "slr-6", "Oxidised Silver Meenakari Set", "Jewellery & Accessories", 5400, "Rajasthan, India", getProductImage("prd-12"), "Necklace and earring set in oxidised silver with hand-applied meenakari enamel.", 1123),
  P("prd-13", "slr-6", "Silver Jhumka Earrings", "Jewellery & Accessories", 2200, "Rajasthan, India", getProductImage("prd-13"), "Classic Jaipur jhumkas in oxidised silver with pearl drops.", 774),
  P("prd-14", "slr-7", "Channapatna Lacquered Bowl Set", "Woodcraft", 1350, "Karnataka, India", getProductImage("prd-14"), "Turned wooden bowls finished with non-toxic vegetable lacquer.", 208),
  P("prd-15", "slr-8", "Pochampally Ikat Scarf", "Textiles & Handloom", 2100, "Telangana, India", getProductImage("prd-15"), "GI-tagged Pochampally ikat scarf handwoven in mercerised cotton.", 486),
  P("prd-16", "slr-6", "Brass Diya Set", "Metalcraft", 1200, "Uttar Pradesh, India", getProductImage("prd-16"), "Traditional handcrafted brass diyas for festive occasions.", 340),
  P("prd-17", "slr-2", "Handcrafted Textile Cushion", "Home Decor", 850, "Rajasthan, India", getProductImage("prd-17"), "Cotton cushion cover with traditional block prints.", 412),
  P("prd-18", "slr-1", "Handmade Jute Bag", "Bags & Accessories", 1100, "West Bengal, India", getProductImage("prd-18"), "Eco-friendly handmade jute bag with ethnic motifs.", 298),
  P("prd-19", "slr-3", "Artisan Wall Decor", "Home Decor", 2800, "Madhya Pradesh, India", getProductImage("prd-19"), "Tribal art inspired wall hanging decor.", 156),
  P("prd-20", "slr-8", "Handloom Cotton Stole", "Textiles & Handloom", 1400, "Tamil Nadu, India", getProductImage("prd-20"), "Lightweight cotton stole with contrasting borders.", 385),
];

const daysAgo = (n: number) => {
  const d = new Date("2026-08-18T10:00:00Z");
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const initialState: AppState = {
  users: [
    { id: "usr-1", name: "Meena Patel", email: "meena@DNK.in", role: "seller", sellerId: "slr-1" },
    { id: "usr-2", name: "Emily Carter", email: "emily@buyer.com", role: "buyer" },
    { id: "usr-3", name: "Operations Admin", email: "admin@DNK.in", role: "admin" },
  ],
  sellers,
  products,
  currentUserId: null,
  orders: [
    { 
      id: "ORD-10231", 
      productId: "prd-1", 
      sellerId: "slr-1", 
      buyerName: "Emily Carter", 
      buyerEmail: "emily@buyer.com", 
      destinationCountry: "United States", 
      address: "418 Beacon St, Boston, MA 02115", 
      quantity: 1, 
      unitPrice: 1999, 
      
      sellerAmount: 1999,
      sellerCurrency: "INR",
      buyerAmount: 20.89, // ~ 1999 / 95.70
      buyerCurrency: "USD",
      exchangeRate: 1 / 95.70,
      
      shippingAmount: 2100,
      shippingCurrency: "INR",
      dutyAmount: 999.50,
      dutyCurrency: "INR",
      platformFee: 100,
      platformFeeCurrency: "INR",
      
      shipping: 2100, 
      fees: 100, 
      total: 5198.50, // 1999 + 2100 + 999.50 + 100
      totalBuyerCurrency: 54.32,
      
      status: "export_pending", 
      createdAt: daysAgo(2) 
    },
    { 
      id: "ORD-10232", productId: "prd-4", sellerId: "slr-2", buyerName: "James Whitfield", buyerEmail: "james@buyer.co.uk", destinationCountry: "United Kingdom", address: "22 Camden High St, London", quantity: 2, unitPrice: 1650, 
      sellerAmount: 3300, sellerCurrency: "INR", buyerAmount: 3300/118.50, buyerCurrency: "GBP", exchangeRate: 1/118.50, shippingAmount: 900, shippingCurrency: "INR", dutyAmount: 330, dutyCurrency: "INR", platformFee: 140, platformFeeCurrency: "INR",
      shipping: 900, fees: 140, total: 4670, totalBuyerCurrency: 4670/118.50, status: "dnk_submitted", createdAt: daysAgo(4) 
    },
    { 
      id: "ORD-10233", productId: "prd-12", sellerId: "slr-6", buyerName: "Lena Fischer", buyerEmail: "lena@buyer.de", destinationCountry: "Germany", address: "Hauptstrasse 14, Berlin", quantity: 1, unitPrice: 5400, 
      sellerAmount: 5400, sellerCurrency: "INR", buyerAmount: 5400/102.20, buyerCurrency: "EUR", exchangeRate: 1/102.20, shippingAmount: 950, shippingCurrency: "INR", dutyAmount: 540, dutyCurrency: "INR", platformFee: 210, platformFeeCurrency: "INR",
      shipping: 950, fees: 210, total: 7100, totalBuyerCurrency: 7100/102.20, status: "customs", createdAt: daysAgo(6) 
    },
    { 
      id: "ORD-10234", productId: "prd-6", sellerId: "slr-3", buyerName: "Olivia Brown", buyerEmail: "olivia@buyer.au", destinationCountry: "Australia", address: "9 Harbour Rd, Sydney", quantity: 1, unitPrice: 1450, 
      sellerAmount: 1450, sellerCurrency: "INR", buyerAmount: 1450/62.10, buyerCurrency: "AUD", exchangeRate: 1/62.10, shippingAmount: 890, shippingCurrency: "INR", dutyAmount: 145, dutyCurrency: "INR", platformFee: 110, platformFeeCurrency: "INR",
      shipping: 890, fees: 110, total: 2595, totalBuyerCurrency: 2595/62.10, status: "in_transit", createdAt: daysAgo(9) 
    },
    { 
      id: "ORD-10235", productId: "prd-10", sellerId: "slr-5", buyerName: "Daniel Roy", buyerEmail: "daniel@buyer.ca", destinationCountry: "Canada", address: "77 King St W, Toronto", quantity: 1, unitPrice: 3600, 
      sellerAmount: 3600, sellerCurrency: "INR", buyerAmount: 3600/70.30, buyerCurrency: "CAD", exchangeRate: 1/70.30, shippingAmount: 920, shippingCurrency: "INR", dutyAmount: 360, dutyCurrency: "INR", platformFee: 180, platformFeeCurrency: "INR",
      shipping: 920, fees: 180, total: 5060, totalBuyerCurrency: 5060/70.30, status: "delivered", createdAt: daysAgo(16) 
    },
    { 
      id: "ORD-10236", productId: "prd-2", sellerId: "slr-1", buyerName: "Sophie Martin", buyerEmail: "sophie@buyer.com", destinationCountry: "United States", address: "1200 Market St, San Francisco, CA", quantity: 3, unitPrice: 899, 
      sellerAmount: 2697, sellerCurrency: "INR", buyerAmount: 2697/95.70, buyerCurrency: "USD", exchangeRate: 1/95.70, shippingAmount: 870, shippingCurrency: "INR", dutyAmount: 269.7, dutyCurrency: "INR", platformFee: 130, platformFeeCurrency: "INR",
      shipping: 870, fees: 130, total: 3966.7, totalBuyerCurrency: 3966.7/95.70, status: "export_pending", createdAt: daysAgo(1) 
    },
    { 
      id: "ORD-10237", productId: "prd-15", sellerId: "slr-8", buyerName: "Mark Evans", buyerEmail: "mark@buyer.co.uk", destinationCountry: "United Kingdom", address: "5 Queen St, Manchester", quantity: 1, unitPrice: 2100, 
      sellerAmount: 2100, sellerCurrency: "INR", buyerAmount: 2100/118.50, buyerCurrency: "GBP", exchangeRate: 1/118.50, shippingAmount: 880, shippingCurrency: "INR", dutyAmount: 210, dutyCurrency: "INR", platformFee: 120, platformFeeCurrency: "INR",
      shipping: 880, fees: 120, total: 3310, totalBuyerCurrency: 3310/118.50, status: "placed", createdAt: daysAgo(1) 
    },
    { 
      id: "ORD-10238", productId: "prd-13", sellerId: "slr-6", buyerName: "Ana Silva", buyerEmail: "ana@buyer.com", destinationCountry: "United States", address: "600 Brickell Ave, Miami, FL", quantity: 2, unitPrice: 2200, 
      sellerAmount: 4400, sellerCurrency: "INR", buyerAmount: 4400/95.70, buyerCurrency: "USD", exchangeRate: 1/95.70, shippingAmount: 910, shippingCurrency: "INR", dutyAmount: 440, dutyCurrency: "INR", platformFee: 150, platformFeeCurrency: "INR",
      shipping: 910, fees: 150, total: 5900, totalBuyerCurrency: 5900/95.70, status: "placed", createdAt: daysAgo(3) 
    },
    { 
      id: "ORD-10239", productId: "prd-3", sellerId: "slr-1", buyerName: "Emily Carter", buyerEmail: "emily@buyer.com", destinationCountry: "United States", address: "418 Beacon St, Boston, MA 02115", quantity: 1, unitPrice: 2499, 
      sellerAmount: 2499, sellerCurrency: "INR", buyerAmount: 2499/95.70, buyerCurrency: "USD", exchangeRate: 1/95.70, shippingAmount: 860, shippingCurrency: "INR", dutyAmount: 249.9, dutyCurrency: "INR", platformFee: 130, platformFeeCurrency: "INR",
      shipping: 860, fees: 130, total: 3738.9, totalBuyerCurrency: 3738.9/95.70, status: "in_transit", createdAt: daysAgo(12) 
    },
    { 
      id: "ORD-10240", productId: "prd-8", sellerId: "slr-4", buyerName: "Peter Novak", buyerEmail: "peter@buyer.de", destinationCountry: "Germany", address: "Ringstrasse 8, Munich", quantity: 1, unitPrice: 4200, 
      sellerAmount: 4200, sellerCurrency: "INR", buyerAmount: 4200/102.20, buyerCurrency: "EUR", exchangeRate: 1/102.20, shippingAmount: 1200, shippingCurrency: "INR", dutyAmount: 420, dutyCurrency: "INR", platformFee: 240, platformFeeCurrency: "INR",
      shipping: 1200, fees: 240, total: 6060, totalBuyerCurrency: 6060/102.20, status: "export_pending", createdAt: daysAgo(2) 
    }
  ],
  exportOrders: [
    { id: "EXP-2001", orderId: "ORD-10232", checklist: { seller: true, product: true, destination: true, packageInfo: true, exportInfo: true, documents: true, dnk: true }, packageInfo: { length: "35", width: "25", height: "8", weight: "0.9" }, exportInfo: { hsCode: "6214.90", declaredValue: "3300", purpose: "Commercial sale" }, documents: { invoice: true, originDeclaration: true }, dnk: "Ahmedabad DNK", pbeRef: "DNK20260042", status: "submitted", submittedAt: daysAgo(3) },
    { id: "EXP-2002", orderId: "ORD-10233", checklist: { seller: true, product: true, destination: true, packageInfo: true, exportInfo: true, documents: true, dnk: true }, packageInfo: { length: "20", width: "18", height: "6", weight: "0.4" }, exportInfo: { hsCode: "7113.11", declaredValue: "5400", purpose: "Commercial sale" }, documents: { invoice: true, originDeclaration: true }, dnk: "Jaipur DNK", pbeRef: "DNK20260051", status: "customs", submittedAt: daysAgo(5) },
    { id: "EXP-2003", orderId: "ORD-10234", checklist: { seller: true, product: true, destination: true, packageInfo: true, exportInfo: true, documents: true, dnk: true }, packageInfo: { length: "28", width: "28", height: "34", weight: "2.4" }, exportInfo: { hsCode: "6914.10", declaredValue: "1450", purpose: "Commercial sale" }, documents: { invoice: true, originDeclaration: true }, dnk: "Anand DNK", pbeRef: "DNK20260033", status: "cleared", submittedAt: daysAgo(8) },
    { id: "EXP-2004", orderId: "ORD-10235", checklist: { seller: true, product: true, destination: true, packageInfo: true, exportInfo: true, documents: true, dnk: true }, packageInfo: { length: "45", width: "35", height: "5", weight: "0.7" }, exportInfo: { hsCode: "9701.10", declaredValue: "3600", purpose: "Commercial sale" }, documents: { invoice: true, originDeclaration: true }, dnk: "Kolkata DNK", pbeRef: "DNK20260018", status: "cleared", submittedAt: daysAgo(15) },
    { id: "EXP-2005", orderId: "ORD-10239", checklist: { seller: true, product: true, destination: true, packageInfo: true, exportInfo: true, documents: true, dnk: true }, packageInfo: { length: "38", width: "30", height: "12", weight: "0.8" }, exportInfo: { hsCode: "4202.22", declaredValue: "2499", purpose: "Commercial sale" }, documents: { invoice: true, originDeclaration: true }, dnk: "Anand DNK", pbeRef: "DNK20260012", status: "cleared", submittedAt: daysAgo(11) },
    { id: "EXP-2006", orderId: "ORD-10231", checklist: { seller: true, product: true, destination: true, packageInfo: false, exportInfo: false, documents: false, dnk: true }, packageInfo: { length: "", width: "", height: "", weight: "" }, exportInfo: { hsCode: "", declaredValue: "", purpose: "" }, documents: { invoice: false, originDeclaration: false }, dnk: "Anand DNK", status: "draft" },
  ],
  shipments: [
    { id: "SHP-3001", orderId: "ORD-10232", exportOrderId: "EXP-2001", trackingId: "IN784512396GB", destination: "United Kingdom", stage: "dnk_submitted", eta: "29 Aug 2026", events: [{ date: "15 Aug", label: "DNK submission created", location: "Ahmedabad DNK" }, { date: "16 Aug", label: "Package accepted", location: "Ahmedabad DNK" }] },
    { id: "SHP-3002", orderId: "ORD-10233", exportOrderId: "EXP-2002", trackingId: "IN552310087DE", destination: "Germany", stage: "customs", eta: "27 Aug 2026", events: [{ date: "12 Aug", label: "DNK submission created", location: "Jaipur DNK" }, { date: "13 Aug", label: "Package accepted", location: "Jaipur DNK" }, { date: "15 Aug", label: "Customs processing", location: "Jaipur FPO" }] },
    { id: "SHP-3003", orderId: "ORD-10234", exportOrderId: "EXP-2003", trackingId: "IN990122456AU", destination: "Australia", stage: "in_transit", eta: "24 Aug 2026", events: [{ date: "09 Aug", label: "DNK submission created", location: "Anand DNK" }, { date: "10 Aug", label: "Package accepted", location: "Anand DNK" }, { date: "12 Aug", label: "Customs processing", location: "Ahmedabad FPO" }, { date: "14 Aug", label: "International dispatch", location: "Mumbai" }] },
    { id: "SHP-3004", orderId: "ORD-10235", exportOrderId: "EXP-2004", trackingId: "IN337781209CA", destination: "Canada", stage: "delivered", eta: "Delivered 14 Aug 2026", events: [{ date: "02 Aug", label: "DNK submission created", location: "Kolkata DNK" }, { date: "03 Aug", label: "Package accepted", location: "Kolkata DNK" }, { date: "05 Aug", label: "Customs processing", location: "Kolkata FPO" }, { date: "07 Aug", label: "International dispatch", location: "Kolkata" }, { date: "14 Aug", label: "Delivered", location: "Toronto, Canada" }] },
  ],
  dnkLocations: INITIAL_DNK_LOCATIONS,
};

