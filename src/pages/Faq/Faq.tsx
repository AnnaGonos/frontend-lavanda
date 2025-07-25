import React, {useState} from 'react';
import PageMeta from "../../components/PageMeta/PageMeta";
import SectionHeader from "../../components/Partials/SectionHeader";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import './Faq.css'
import faqPlus from '../../assets/images/plus-lg.svg'
import faqDash from '../../assets/images/dash-lg.svg'
import {faqItems} from "./FaqItem.data";

const Faq = ({children}: { children: React.ReactNode }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <PageMeta title="Вопрос-ответ"
                      description="Заказать букет стало проще с нашим сайтом. Заказывайте букеты в Партизанске в несколько кликов!"/>

            <Breadcrumbs/>
            <section>
                <SectionHeader title="Популярные вопросы" comment="Найти решение легко"/>
                <div className="faq-info__list">
                    {faqItems.map((item, index) => (
                        <div className="faq-info__item" key={index}>
                            <div onClick={() => toggleAnswer(index)} style={{cursor: 'pointer'}}>
                                <p>{item.question}</p>
                                <img className="faq-info__toggle" src={activeIndex === index ? faqDash : faqPlus}
                                     alt="Toggle"/>
                            </div>
                            {activeIndex === index && <p className="faq-info__answer">{item.answer}</p>}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Faq;
