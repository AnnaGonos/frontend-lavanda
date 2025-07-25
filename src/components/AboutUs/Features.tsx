import React from 'react';
import '../Partials/Partials.css';

interface FeatureItem {
    title: string;
    text: string;
}

interface FeaturesProps {
    items: FeatureItem[];
}

const Features: React.FC<FeaturesProps> = ({ items }) => {
    return (
        <div className="features">
            {items.map((item, index) => (
                <div className="features__item" key={index}>
                    <h3 className="features__title">{item.title}</h3>
                    <p className="features__text">{item.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Features;
