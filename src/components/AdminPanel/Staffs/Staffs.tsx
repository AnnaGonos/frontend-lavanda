import React, {useState, useEffect} from 'react';
import './../AdminPanel.css';
import SectionHeader from '../../Partials/SectionHeader';
import {User, UserRole} from "../../../types/user.type";
import {roleLabels} from "../../../types/staff-response.dto";


export const StaffsTab: React.FC = () => {
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/staff', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Ошибка загрузки');

                const data: User[] = await res.json();
                setStaff(data);
            } catch (err) {
                setError('Не удалось загрузить сотрудников');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    if (loading) return <p>Загружаем данные...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="admin-panel">
            <SectionHeader title="Сотрудники" comment=""/>

            {staff.length === 0 ? (
                <p>Нет сотрудников</p>
            ) : (
                <table className="staff-table">
                    <thead>
                    <tr>
                        <th>Сотрудник</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Бонусы</th>
                        <th>Уровень</th>
                        <th>Заказов</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staff.map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`role-badge role-${user.role}`}>
                                {roleLabels[user.role as UserRole]}
                              </span>
                            </td>
                            <td>{user.bonusPoints}</td>
                            <td>{user.bonusCardLevel}</td>
                            <td>{user.totalOrders}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

