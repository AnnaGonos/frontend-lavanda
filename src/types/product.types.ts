export interface Product {
    id: number;
    name: string;
    price: number;
    discount?: number;
    description?: string;
    composition?: string;
    category: string;
    image: string;
    stock: number;
    createdAt: Date;
}

export interface CartItem {
    id: number;
    quantity: number;
    product: Product;
}
