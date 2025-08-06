import React, {useState} from 'react';
import '../AdminPanel.css';
import {Category, CategoryList} from "../../../types/category.type";

import {AutoResizeTextarea} from "../../Forms/AutoResizeTextarea";

interface AddProductModalProps {
    onSubmit: (formData: FormData) => void;
    onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({onSubmit, onClose}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0.00);
    const [discount, setDiscount] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('');
    const [composition, setComposition] = useState('');
    const [category, setCategory] = useState<Category>(Category.MONOBUKET);
    const [stock, setStock] = useState<number>(1);
    const [images, setImages] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!name.trim()) {
            newErrors.push('Название обязательно');
        }

        if (isNaN(price) || price <= 0) {
            newErrors.push('Цена должна быть положительным числом');
        }

        if (discount !== undefined && (isNaN(discount) || discount < 0)) {
            newErrors.push('Скидка должна быть положительным числом или не указана');
        }

        if (!images.length) {
            newErrors.push('Выберите изображение');
        }

        if (isNaN(stock) || stock < 0) {
            newErrors.push('Количество на складе должно быть неотрицательным');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('price', price.toString());

        if (discount !== undefined && !isNaN(discount) && discount >= 0) {
            formData.append('discount', discount.toString());
        }

        if (description.trim()) {
            formData.append('description', description.trim());
        }

        if (composition.trim()) {
            formData.append('composition', composition.trim());
        }

        formData.append('category', category);
        formData.append('stock', Math.max(0, stock).toString());
        formData.append('image', images[0]);

        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal_type_add-product">
                <h3>Добавить товар</h3>

                {errors.length > 0 && (
                    <ul className="error-list">
                        {errors.map((err, index) => (
                            <li key={index} style={{color: 'red'}}>{err}</li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleSubmit} className="modal__form">
                    <div className="form__group">
                        <label htmlFor="name" className="form__label">Название</label>
                        <input id="name" className="form__control" type="text" value={name}
                               onChange={(e) => setName(e.target.value)} required/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="price" className="form__label">Цена</label>
                        <input id="price" className="form__control" type="number" value={price}
                               onChange={(e) => setPrice(Number(e.target.value))} required/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="discount" className="form__label">Скидка</label>
                        <input id="discount" className="form__control" type="number" value={discount || ''}
                               onChange={(e) => setDiscount(Number(e.target.value))}/>
                    </div>

                    <div className="form__group">
                        <label htmlFor="category" className="form__label">Категория</label>
                        <select id="category" className="form__control" value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}>
                            {CategoryList.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
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

                    <div className="form__group">
                        <label htmlFor="image" className="form__label">Изображение</label>
                        <div className="form__group-image-form">
                            <input id="image" className="form__control" type="file" accept="image/*"
                                   onChange={(e) => {
                                       const files = e.target.files;
                                       if (files && files.length > 0) {
                                           setImages([files[0]]);
                                       }
                                   }}
                            />

                            <div className="modal__preview image-preview">
                                {images.length > 0 && (
                                    <img src={URL.createObjectURL(images[0])} alt="Превью"
                                         className="image-preview__image"/>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="modal__actions">
                        <button type="submit" className="modal__button modal__button_type_submit button">
                            Добавить товар
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