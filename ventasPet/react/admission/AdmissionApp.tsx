import React from 'react';
import { useAdmissions } from './hooks/useAdmissions';
import { PrimeReactProvider } from 'primereact/api';
import { AdmissionTable } from './AdmissionTable';

export const AdmissionApp: React.FC = () => {

    const { admissions, fetchAdmissions } = useAdmissions();

    const onReload = () => {
        fetchAdmissions();
    }

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <AdmissionTable
                    items={admissions}
                    onReload={onReload}
                >
                </AdmissionTable>
            </PrimeReactProvider>
        </>
    );
};
