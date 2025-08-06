import {UserRole} from "./user.type";

export const roleLabels: Record<UserRole, string> = {
    [UserRole.USER]: 'Пользователь',
    [UserRole.ADMIN]: 'Администратор',
    [UserRole.FLORIST]: 'Флорист',
};
