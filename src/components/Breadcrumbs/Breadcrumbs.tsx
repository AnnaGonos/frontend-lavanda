import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '../../assets/images/chevron-left.svg';


interface BreadcrumbsProps {
    currentTitle?: string;
}

const pathMap: Record<string, string> = {
    '/': 'Главная',
    '/catalog': 'Каталог',
    '/contacts': 'Контакты',
    '/delivery': 'Доставка',
    '/care': 'Уход за букетом',
    '/payment': 'Оплата',
    '/faq': 'Вопрос-ответ',
    '/lk': 'Личный кабинет',
    '/lk/orders': 'Заказы',
    '/lk/edit': 'Настройки',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentTitle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const isProductPage = pathnames[0] === 'product';
    const displayPathnames = isProductPage ? ['catalog', ...pathnames.slice(1)] : pathnames;

    return (
        <div className="breadcrumbs">
            <button onClick={() => navigate(-1)} className="breadcrumbs__back">
                <img src={chevronLeft} alt="Назад" />
            </button>

            <span onClick={() => navigate('/')} className="breadcrumbs__link">
                Главная
            </span>

            {displayPathnames.map((name, index) => {
                const routeTo = `/${displayPathnames.slice(0, index + 1).join('/')}`;
                const breadcrumbName = pathMap[routeTo] || (isProductPage && index === displayPathnames.length - 1 ? currentTitle : name);

                if (isProductPage && name === 'product') {
                    return null;
                }

                const isLast = index === displayPathnames.length - 1;

                return (
                    <React.Fragment key={breadcrumbName}>
                        <span className="breadcrumbs__separator">/</span>
                        {isLast ? (
                            <span className="breadcrumbs__current">{currentTitle || breadcrumbName}</span>
                        ) : (
                            <span className="breadcrumbs__link"
                                onClick={() => navigate(routeTo)}
                                style={{ cursor: 'pointer' }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Перейти в ${breadcrumbName}`}>
                {breadcrumbName}
              </span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
