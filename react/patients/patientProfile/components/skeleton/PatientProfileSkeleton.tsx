// components/PatientProfileCard/PatientProfileSkeleton.jsx
import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const PatientProfileSkeleton = () => (
    <div className="patient-profile-card">
        <div className="card-body">
            <ProfileHeaderSkeleton />
            <div className="profile-divider"></div>
            <MedicalSectionSkeleton />
            <div className="profile-divider"></div>
            <ContactSectionSkeleton />
        </div>
    </div>
);

const ProfileHeaderSkeleton = () => (
    <div className="profile-header">
        <div className="avatar-section">
            <Skeleton shape="circle" size="80px" />
        </div>

        <div className="profile-info flex-grow-1">
            <Skeleton width="70%" height="28px" className="mb-2" />
            <Skeleton width="40%" height="18px" className="mb-3" />

            <div className="contact-info-grid">
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="100%" height="16px" />
            </div>
        </div>
    </div>
);

const MedicalSectionSkeleton = () => (
    <div className="medical-section">
        <div className="section-header mb-3">
            <Skeleton width="160px" height="22px" />
            <Skeleton width="30px" height="22px" />
        </div>

        {[...Array(3)].map((_, index) => (
            <div key={index} className="medical-item mb-2">
                <Skeleton width="120px" height="18px" className="me-2" />
                <Skeleton width="60%" height="18px" />
            </div>
        ))}
    </div>
);

const ContactSectionSkeleton = () => (
    <div className="contact-section">
        <Skeleton width="180px" height="22px" className="mb-3" />

        {[...Array(4)].map((_, index) => (
            <div key={index} className="contact-detail-item mb-2">
                <Skeleton width="80px" height="18px" className="me-2" />
                <Skeleton width="70%" height="18px" />
            </div>
        ))}

        <div className="insurance-section mt-3">
            <Skeleton width="120px" height="32px" borderRadius="16px" />
        </div>
    </div>
);

export default PatientProfileSkeleton;