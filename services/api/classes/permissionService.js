import BaseApiService from "./baseApiService";

export class PermissionService extends BaseApiService {
    async getAll() {
        return Promise.resolve([
            {
                name: 'Gestión de pacientes',
                key_: 'patients_management',
                permissions: [
                    { name: 'Ver pacientes', key_: 'patient_view' },
                    { name: 'Crear pacientes', key_: 'patient_create' },
                    { name: 'Editar pacientes', key_: 'patient_edit' },
                    { name: 'Eliminar pacientes', key_: 'patient_delete' },
                    { name: 'Ver información sensible de pacientes', key_: 'patient_view_sensitive' },
                ]
            },
            {
                name: 'Gestión de citas',
                key_: 'appointments_management',
                permissions: [
                    { name: 'Ver citas', key_: 'appointment_view' },
                    { name: 'Crear citas', key_: 'appointment_create' },
                    { name: 'Editar citas', key_: 'appointment_edit' },
                    { name: 'Eliminar citas', key_: 'appointment_delete' },
                ]
            },
            {
                name: 'Gestión de facturas',
                key_: 'invoices_management',
                permissions: [
                    { name: 'Ver facturas', key_: 'invoice_view' },
                    { name: 'Crear facturas', key_: 'invoice_create' },
                    { name: 'Editar facturas', key_: 'invoice_edit' },
                    { name: 'Eliminar facturas', key_: 'invoice_delete' },
                ]
            },
            {
                name: 'Gestión de configuración',
                key_: 'settings_management',
                permissions: [
                    { name: 'Editar configuración', key_: 'settings_edit' },
                ]
            },
            {
                name: 'Gestión de reportes',
                key_: 'reports_management',
                permissions: [
                    { name: 'Ver reportes', key_: 'reports_view' },
                ]
            },
            {
                name: 'Gestión de usuarios',
                key_: 'users_management',
                permissions: [
                    { name: 'Ver usuarios', key_: 'user_view' },
                    { name: 'Crear usuarios', key_: 'user_create' },
                    { name: 'Editar usuarios', key_: 'user_edit' },
                    { name: 'Eliminar usuarios', key_: 'user_delete' },
                ]
            },
            {
                name: 'Gestión de roles',
                key_: 'roles_management',
                permissions: [
                    { name: 'Ver roles', key_: 'user_role_view' },
                    { name: 'Crear roles', key_: 'user_role_create' },
                    { name: 'Editar roles', key_: 'user_role_edit' },
                    { name: 'Eliminar roles', key_: 'user_role_delete' },
                ]
            },
        ]);
    }
}