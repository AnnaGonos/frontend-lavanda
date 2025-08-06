import { User } from './user.type';
import { Product } from './product.types';

export interface Review {
    id: number;
    rating: number;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    author: User;
    product: Product;
    comments: ReviewComment[];
}

export interface ReviewComment {
    id: number;
    text: string;
    createdAt: string;
    authorName: string;
}

