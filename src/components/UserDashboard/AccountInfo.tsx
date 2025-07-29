import React from 'react';
import moreInformation from "../../assets/images/i (2).webp";
import imgBonusCard from "../../assets/images/logotype.jpg";
import './Dashboard.css'
import {User} from "../../types/user.type";
import backgroundImage from "../../assets/images/1234.png";
import { useNavigate } from 'react-router-dom';

interface AccountInfoProps {
    user: User;
    onLogout: () => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();

        navigate('/', { replace: true });
    };

    return (
        <div className="dashboard__user-info" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="dashboard__user-header user-header">
                <img src={moreInformation} alt="Фото пользователя" className="user-header__avatar" />
                <div className="user-header__description">
                    <p className="user-header__name">
                        <strong>{user.firstName} {user.lastName}</strong>
                    </p>
                    <p className="user-header__phone">{user.phone}</p>
                    <p className="user-header__email">{user.email}</p>

                    <button
                        type="button"
                        className="dashboard__logout-button"
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>
                </div>
            </div>

            <div className="dashboard__user-bonus-card user-bonus-card">
                <img src={imgBonusCard} alt="Бонусная карта" className="user-bonus-card__image" />
                <p className="user-bonus-card__title"><strong>Эмоции в нужный момент</strong></p>
                <div className="user-bonus-card__info">
                    <p className="user-bonus-card__level"><strong>Уровень {user.bonusCardLevel}</strong></p>
                    <p className="user-bonus-card__points"><strong>Бонусные баллы {user.bonusPoints}</strong></p>
                </div>
            </div>
        </div>
    );
};

