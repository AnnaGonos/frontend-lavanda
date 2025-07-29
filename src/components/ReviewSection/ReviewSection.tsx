import React, { useState } from 'react';
import './ReviewSection.css';

const reviews = [
    {
        id: 1,
        name: 'Анна',
        text: 'Заказывала букет к юбилею мамы — все в восторге! Спасибо за внимание к деталям и свежие цветы.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Дмитрий',
        text: 'Быстрая доставка, красивая упаковка. Цветы радуют глаз уже третий день — никаких признаков увядания!',
        rating: 5,
    },
    {
        id: 3,
        name: 'Екатерина',
        text: 'Покупаю здесь букеты регулярно. Всегда приятные рекомендации от флориста и аккуратная сборка.',
        rating: 4,
    },
    {
        id: 4,
        name: 'Сергей',
        text: 'Хороший выбор, удобный сайт. Впервые заказал через интернет — всё прошло без проблем.',
        rating: 5,
    },
    {
        id: 5,
        name: 'Ольга',
        text: 'Прекрасный сервис! Заказала букет с доставкой к определённому времени — всё вовремя и точно по адресу.',
        rating: 5,
    },
];

const ReviewsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 2;

    const next = () => {
        if (currentIndex < reviews.length - visibleCount) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <section className="reviews-section">
            <h2>Отзывы наших клиентов</h2>

            <div className="reviews-container">
                <button className="nav-button" onClick={prev} disabled={currentIndex === 0}>
                    &#10094;
                </button>

                <div className="reviews-list">
                    <div
                        className="reviews-wrapper"
                        style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                    >
                        {reviews.map((review, index) => (
                            <div className="review-card" key={review.id}>
                                <p className="review-text">"{review.text}"</p>
                                <h4 className="review-name">{review.name}</h4>
                                <div className="review-rating">
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="nav-button"
                    onClick={next}
                    disabled={currentIndex >= reviews.length - visibleCount}
                >
                    &#10095;
                </button>
            </div>

            <div className="reviews-more">
                <a href="/reviews" className="btn-more">Подробнее</a>
            </div>
        </section>
    );
};

export default ReviewsSection;
