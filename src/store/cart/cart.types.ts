export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveForUser: (userId: string) => void;
  restoreForUser: (userId: string) => void;
}
