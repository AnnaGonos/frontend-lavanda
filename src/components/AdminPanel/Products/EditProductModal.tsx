import React, {useState} from 'react';
import {Category, CategoryList} from '../../../types/category.type';
import {Product} from '../../../types/product.types';
import {AutoResizeTextarea} from "../../Forms/AutoResizeTextarea";

interface EditProductModalProps {
    product: Product;
    onSubmit: (product: Product) => void;
    onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({product, onSubmit, onClose}) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState<number>(product.price);
    const [discount, setDiscount] = useState<number | null>(product.discount || null);
    const [description, setDescription] = useState<string>(product.description || '');
    const [composition, setComposition] = useState<string>(product.composition || '');
    const [category, setCategory] = useState<Category>(product.category as Category);
    const [stock, setStock] = useState<number>(product.stock);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newErrors: string[] = [];

            if (!name.trim()) {
                newErrors.push('Название обязательно');
            }

            if (isNaN(price) || price <= 0) {
                newErrors.push('Цена должна быть положительным числом');
            }

            if (discount !== null && (isNaN(discount) || discount < 0)) {
                newErrors.push('Скидка должна быть положительным числом или не указана');
            }

            if (isNaN(stock) || stock < 0) {
                newErrors.push('Количество на складе должно быть неотрицательным');
            }

            if (newErrors.length > 0) {
                setErrors(newErrors);
                return;
            }

            const updatedProduct = {
                name,
                price,
                discount,
                description,
                composition,
                category,
                stock,
                image: product.image,

            };

            await onSubmit(updatedProduct as Product);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal_type_edit-product" onClick={(e) => e.stopPropagation()}>
                <h3>Редактировать товар</h3>

                {errors.length > 0 && (
                    <ul className="error-list">
                        {errors.map((err, index) => (
                            <li key={index} style={{color: 'red'}}>
                                {err}
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleSubmit} className="modal__form">
                    <div className="form__group">
                        <label htmlFor="name" className="form__label">Название</label>
                        <input id="name" className="form__control" type="text" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="price" className="form__label">Цена</label>
                        <input id="price" className="form__control" type="number" value={price}
                               onChange={(e) => setPrice(Number(e.target.value))}/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="discount" className="form__label">Скидка</label>
                        <input id="discount" className="form__control" type="number"
                               value={discount === null ? '' : discount}
                               onChange={(e) => setDiscount(e.target.value ? Number(e.target.value) : null)}/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="category" className="form__label">Категория</label>
                        <select id="category" className="form__control" value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}>
                            {CategoryList.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <AutoResizeTextarea
                        id="description" label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={254}/>

                    <AutoResizeTextarea
                        id="composition" label="Состав"
                        value={composition}
                        onChange={(e) => setComposition(e.target.value)}
                        maxLength={150}/>

                    <div className="form__group">
                        <label htmlFor="stock" className="form__label">На складе</label>
                        <input id="stock" className="form__control" type="number" value={stock}
                               onChange={(e) => setStock(Number(e.target.value))}/>
                    </div>

                    <div className="modal__actions">
                        <button type="submit" className="modal__button modal__button_type_save button"
                                disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </button>

                        <button type="button" className="modal__button modal__button_type_cancel button"
                                onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
