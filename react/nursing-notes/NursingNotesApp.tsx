import React from 'react';
import NursingNotes from './NursingNotes';

interface NotasEnfermeriaAppProps {
    patientId?: string;
}

export const NursingNotesApp: React.FC<NotasEnfermeriaAppProps> = ({ patientId }) => {
    return <NursingNotes patientId={patientId} />;
};

export default NursingNotesApp;