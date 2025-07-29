import React from 'react';
import SectionHeader from "../../components/Partials/SectionHeader";
import "./Contacts.css"
import PageMeta from "../../components/PageMeta/PageMeta";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const contactItems = [
    {title: 'Телефон', link: 'tel:+79146627911', text: '+7 914 662-79-11'},
    {title: 'Telegram', link: 'https://t.me/lavandapartizansk', text: '@lavandapartizansk'},
    {title: 'WhatsApp', link: 'https://wa.me/79146627911?text=Здравствуйте', text: '+7 914 662-79-11'},
    {title: 'Instagram*', link: 'https://www.instagram.com/lavanda_prt/', text: '@lavanda_prt'},
    {title: 'Email', link: 'mailto:lavanda.ptz@mail.ru', text: 'lavanda.ptz@mail.ru'}
];

const Contacts = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <PageMeta title="Контакты" description="Свяжитесь с нами по телефону, email или в мессенджерах"/>

            <Breadcrumbs/>
            <section>
                <SectionHeader title="Контакты" comment="Мы на связи с 8:00 до 19:00"/>

                <div className="contacts__info contacts-info">
                    <div className="contacts-info__item">
                        <p className="contacts-info__label">Адрес магазина</p>
                        <p className="contacts-info__value">ул. Замараева, 5</p>
                    </div>
                    {contactItems.map((contact, index) => (
                        <div className="contacts-info__item" key={index}>
                            <p className="contacts-info__label">{contact.title}</p>
                            <a href={contact.link} className="contacts-info__value">{contact.text}</a>
                        </div>
                    ))}
                </div>

                <div className="contacts__map">
                    <div className="about-us__map-yandex">
                        <iframe
                            src="https://yandex.ru/map-widget/v1/?um=constructor%3A04372f220e817e42113272e1b01f2c7800bf6b0612480513330a82c87dc3592e&amp;source=constructor"
                            width="100%" height="457" frameBorder="0"></iframe>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contacts;

