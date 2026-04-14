export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}
