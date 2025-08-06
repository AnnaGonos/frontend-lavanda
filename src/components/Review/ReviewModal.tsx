import React, { useState } from 'react';
import './Review.css';
import {FaStar} from "@react-icons/all-files/fa/FaStar";
import {FaTimes} from "@react-icons/all-files/fa/FaTimes";
import axios from 'axios';
import {AutoResizeTextarea} from "../Forms/AutoResizeTextarea";

interface ReviewModalProps {
    productId: number;
    productName: string;
    productImage: string;
    onClose: () => void;
    onSubmit: (rating: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
                                                            productId,
                                                            productName,
                                                            productImage,
                                                            onClose,
                                                            onSubmit,
                                                        }) => {

    const [rating, setRating] = useState<number>(5);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('productId', productId.toString());
            formData.append('rating', rating.toString());
            formData.append('description', description);
            if (image) formData.append('image', image);

            await axios.post('http://localhost:5000/api/reviews', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            onSubmit(rating);
            onClose();
        } catch (err: any) {
            console.error('Ошибка отправки отзыва:', err);
            const message = err.response?.data?.message || 'Не удалось отправить отзыв';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
                <h3>Оцените товар</h3>

                <div className="review-modal__product-details">
                    <img src={productImage} alt={productName} />
                    <span>{productName}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star}
                                size={32}
                                className={star <= rating ? 'star-active' : 'star-inactive'}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>


                    <AutoResizeTextarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={1000}
                        placeholder="Напишите отзыв о товаре... "
                    />

                    <div className="image-upload">
                        <label>
                            Фото
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </label>
                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Предпросмотр" />
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn__button">
                        {loading ? 'Отправляем...' : 'Отправить отзыв'}
                    </button>
                </form>
            </div>
        </div>
    );
};


