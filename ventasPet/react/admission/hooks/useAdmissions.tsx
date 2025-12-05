import { useState, useEffect } from 'react';
import { admissionService } from '../../../services/api';

export const useAdmissions = () => {
    const [admissions, setAdmissions] = useState<any[]>([]);

    const fetchAdmissions = async () => {
        const data = await admissionService.active() as any[];

        console.log(data);

        setAdmissions(
            data.map(admission => {
                return admission
            })
        );
    }

    useEffect(() => {
        fetchAdmissions()
    }, []);

    return { admissions, fetchAdmissions };
};
