import type { Order, Product } from "./types";

export const foodProducts: Product[] = [
  { id: "jollof", name: "Smoky Jollof + Chicken", description: "Smoky party jollof served with juicy grilled chicken and slaw.", priceKobo: 550000, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85", inventory: 50, sold: 42, unit: "portions" },
  { id: "fried-rice", name: "Fried Rice + Turkey", description: "Colourful fried rice with our peppered turkey and sweet plantain.", priceKobo: 650000, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85", inventory: 36, sold: 28, unit: "portions" },
  { id: "plantain", name: "Sweet Fried Plantain", description: "A generous side of perfectly caramelised ripe plantain.", priceKobo: 150000, image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb3?auto=format&fit=crop&w=1000&q=85", inventory: 45, sold: 34, unit: "portions" },
  { id: "chapman", name: "House Chapman", description: "Our bright, cold house blend with citrus and cucumber.", priceKobo: 200000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=85", inventory: 30, sold: 21, unit: "bottles" },
];

export const fashionProducts: Product[] = [
  { id: "tee", name: "Vintage Racing Tee", description: "Sun-faded graphic tee, hand-picked in Lagos. One of one.", priceKobo: 1850000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85", inventory: 8, sold: 5 },
  { id: "cargo", name: "Utility Cargo", description: "Relaxed stone-wash cargo with a structured silhouette.", priceKobo: 2800000, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85", inventory: 6, sold: 2 },
  { id: "denim", name: "Archive Denim", description: "Heavyweight vintage denim with a wide, easy fit.", priceKobo: 3200000, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85", inventory: 10, sold: 7 },
];

const names = ["Tolu Ajayi", "Chioma Okafor", "Damilola Ojo", "Ifeanyi Nwosu", "Zainab Bello", "Kemi Adeyemi", "Seun Balogun", "Amina Musa"];
const combos = ["Jollof ×2, Chapman", "Fried Rice ×1", "Jollof, Plantain ×2", "Fried Rice, Chapman"];

export const orders: Order[] = Array.from({ length: 20 }, (_, index) => ({
  id: `HMG-${1023 - index}`,
  customer: names[index % names.length],
  phone: `080${(32145670 + index * 123).toString().slice(0, 8)}`,
  items: combos[index % combos.length],
  itemCount: (index % 3) + 1,
  amountKobo: [1250000, 650000, 850000, 1050000][index % 4],
  payment: index === 7 ? "Pending" : "Paid",
  fulfillment: index % 4 === 2 ? "Fulfilled" : "Pending",
  date: index < 5 ? `Today ${11 - index}:4${index}` : `${index} Sep`,
}));

export const navItems = [
  ["Overview", "/dashboard"],
  ["Windows", "/dashboard/windows"],
  ["Products", "/dashboard/products"],
  ["Orders", "/dashboard/orders"],
  ["Customers", "/dashboard/customers"],
  ["Payouts", "/dashboard/payouts"],
] as const;
