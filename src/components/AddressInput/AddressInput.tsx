import React, { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
    onAddressChange: (fullAddress: string) => void;
    initialAddress?: string;
}

export const YandexMap: React.FC<YandexMapProps> = ({ onAddressChange, initialAddress = '' }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [ymaps, setYmaps] = useState<any>(null);
    const [map, setMap] = useState<any>(null);
    const [placemark, setPlacemark] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [address, setAddress] = useState(initialAddress || '');
    const [entrance, setEntrance] = useState('');
    const [floor, setFloor] = useState('');
    const [apartment, setApartment] = useState('');
    const [intercom, setIntercom] = useState('');

    useEffect(() => {
        const loadYmaps = () => {
            if (window.ymaps) {
                window.ymaps.ready().then(() => {
                    setYmaps(window.ymaps);
                    setLoading(false);
                }).catch((err: any) => {
                    setError('Ошибка загрузки карты: ' + err.message);
                    setLoading(false);
                });
            } else {
                setTimeout(loadYmaps, 500);
            }
        };

        loadYmaps();
    }, []);

    useEffect(() => {
        if (!ymaps || !mapRef.current) return;

        let newMap: any;
        let newPlacemark: any;
        const initialCoords: [number, number] = [43.118280, 133.117273];

        const initMap = (coords: [number, number]) => {
            newMap = new ymaps.Map(mapRef.current!, {
                center: coords,
                zoom: 16,
                controls: ['zoomControl'],
            });

            newPlacemark = new ymaps.Placemark(coords, {}, {
                draggable: true,
                iconColor: '#ff4d4d',
            });

            newMap.geoObjects.add(newPlacemark);
            setMap(newMap);
            setPlacemark(newPlacemark);

            newPlacemark.events.add('dragend', () => {
                const coords = newPlacemark.geometry.getCoordinates();
                reverseGeocode(coords);
            });

            newMap.events.add('click', (e: any) => {
                const coords = e.get('coords');
                newPlacemark.geometry.setCoordinates(coords);
                reverseGeocode(coords);
            });

            if (initialAddress && address) {
                newMap.setCenter(coords);
            }
        };

        const reverseGeocode = (coords: [number, number]) => {
            ymaps.geocode(coords, { results: 1 }).then((res: any) => {
                const firstObj = res.geoObjects.get(0);
                if (firstObj) {
                    const fullAddr = firstObj.getAddressLine();
                    setAddress(fullAddr);
                    buildFullAddress(fullAddr);
                }
            });
        };

        if (initialAddress) {
            ymaps.geocode(initialAddress).then((res: any) => {
                const firstObj = res.geoObjects.get(0);
                if (firstObj) {
                    const coords = firstObj.geometry.getCoordinates();
                    initMap(coords);
                    setAddress(firstObj.getAddressLine());
                } else {
                    initMap(initialCoords);
                }
            });
        } else {
            initMap(initialCoords);
        }

        return () => {
            if (newMap) newMap.destroy();
        };
    }, [ymaps, initialAddress, address]);

    const buildFullAddress = (addr: string = address) => {
        let full = addr.trim();
        const details: string[] = [];

        if (entrance) {
            details.push(`подъезд ${entrance}`);
        }

        if (floor) {
            details.push(`этаж ${floor}`);
        }

        if (apartment) {
            details.push(`кв. ${apartment}`);
        }

        if (intercom) {
            details.push(`код: ${intercom}`);
        }

        if (details.length > 0) {
            full += ', ' + details.join(', ');
        }

        onAddressChange(full);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(value);
        buildFullAddress(value);
    };

    const handleDetailChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value);
        setTimeout(() => buildFullAddress(), 0);
    };

    if (loading) return <div className="yandex-map__loading">Загрузка карты...</div>;
    if (error) return <div className="yandex-map__error">{error}</div>;

    return (
        <div className="yandex-map">
            <div ref={mapRef} className="yandex-map__container" />

            <input type="text" value={address} onChange={handleAddressChange}
                placeholder="Введите адрес или выберите на карте" className="yandex-map__input"
            />

            <div className="yandex-map__details">
                <input type="text" placeholder="Подъезд" value={entrance}
                    onChange={(e) => handleDetailChange(setEntrance, e.target.value)}
                    className="yandex-map__detail-input"/>
                <input type="text" placeholder="Этаж" value={floor}
                    onChange={(e) => handleDetailChange(setFloor, e.target.value)}
                    className="yandex-map__detail-input"/>
                <input type="text" placeholder="Квартира" value={apartment}
                    onChange={(e) => handleDetailChange(setApartment, e.target.value)}
                    className="yandex-map__detail-input"/>
                <input type="text" placeholder="Код домофона" value={intercom}
                    onChange={(e) => handleDetailChange(setIntercom, e.target.value)}
                    className="yandex-map__detail-input"/>
            </div>
        </div>
    );
};

