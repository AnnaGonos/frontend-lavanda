import React, { useState, useEffect } from 'react';

import './Slider.css';
import {slides} from "./Slides.data";


const Slider: React.FC = () => {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlideIndex((prev) => (prev + 1) % slides.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setActiveSlideIndex(index);
    };

    const currentSlide = slides[activeSlideIndex];

    return (
        <section className="slider">
            <div className="slider-wrapper">
                <div className="slider-image left">
                    <img src={currentSlide.images[0]} alt="Left" />
                </div>

                <div className="slider-center">
                    <h2>{currentSlide.title}</h2>
                    <p>{currentSlide.description}</p>
                    <a href={currentSlide.link} className="slider-link__button">Перейти</a>
                </div>

                <div className="slider-image right">
                    <img src={currentSlide.images[1]} alt="Right" />
                </div>
            </div>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === activeSlideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </section>
    );
};

export default Slider;
