import React, { memo } from 'react';
import {YandexMap} from "./AddressInput";

export const DeliveryAddressSection = memo(({ onAddressChange, initialAddress }: {
    onAddressChange: (full: string) => void;
    initialAddress?: string;
}) => {
    return (
        <div className="checkout__subsection">
            <h4>Адрес доставки</h4>
            <YandexMap onAddressChange={onAddressChange} initialAddress={initialAddress} />
        </div>
    );
});