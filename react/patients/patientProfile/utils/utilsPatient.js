export const bloodTypeMap = {
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-'
};

export const formatDate = (dateString) => {
    if (!dateString) return "No disponible";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return "Fecha inválida";
    }
};

export const getAvatarUrl = (minioUrl) => {
    console.log('🔍 getAvatarUrl called with:', minioUrl);
    
    const possibleUrls = [];
    
    if (!minioUrl || minioUrl === 'null' || minioUrl === 'undefined' || minioUrl.trim() === '') {
        return "/assets/img/profile/profile_default.jpg";
    }
    
    possibleUrls.push(minioUrl);
    
    if (!minioUrl.startsWith('http') && !minioUrl.startsWith('/')) {
        possibleUrls.push(`/${minioUrl}`);
        possibleUrls.push(`/storage/${minioUrl}`);
        possibleUrls.push(`/uploads/${minioUrl}`);
        possibleUrls.push(`/api/images/${minioUrl}`);
    }
    
    console.log('URLs a intentar:', possibleUrls);
    
    return possibleUrls[0];
};

export const getLastAppointment = (appointments = []) => {
    if (appointments.length === 0) return null;

    const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
    );

    return sortedAppointments[0];
};

export const updateBreadcrumbAndLinks = (patient) => {
    const nameBreadcumb = document.getElementById("nameBradcumb");
    if (nameBreadcumb) {
        nameBreadcumb.textContent = patient.full_name;
    }

    document.querySelectorAll(".patientName").forEach(element => {
        element.textContent = patient.full_name;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`;
        }
    });
};