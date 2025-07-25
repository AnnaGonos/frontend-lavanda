import React from 'react';
import './Partials.css';

interface SectionHeaderProps {
    title: string;
    comment?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, comment }) => {
    return (
        <div className="section-header">
            <h1 className="section-header__title">{title}</h1>
            {comment && <p className="section-header__comment">{comment}</p>}
        </div>
    );
};

export default SectionHeader;
