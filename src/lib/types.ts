export type Product = {
  id: string;
  name: string;
  description: string;
  priceKobo: number;
  image: string;
  inventory: number | null;
  sold: number;
  unit?: string;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: string;
  itemCount: number;
  amountKobo: number;
  payment: "Paid" | "Pending";
  fulfillment: "Pending" | "Fulfilled";
  date: string;
};
