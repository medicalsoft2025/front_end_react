import React from 'react';
import NotasEnfermeria from './NotasEnfermeria';

interface NotasEnfermeriaAppProps {
    patientId?: string;
}

export const NotasEnfermeriaApp: React.FC<NotasEnfermeriaAppProps> = ({ patientId }) => {
    return <NotasEnfermeria patientId={patientId} />;
};

export default NotasEnfermeriaApp;