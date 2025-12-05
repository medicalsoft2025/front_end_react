// components/PatientProfileCard/PatientProfileSkeleton.jsx
import React from 'react';
import { Skeleton } from 'primereact/skeleton';
const PatientProfileSkeleton = () => /*#__PURE__*/React.createElement("div", {
  className: "patient-profile-card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-body"
}, /*#__PURE__*/React.createElement(ProfileHeaderSkeleton, null), /*#__PURE__*/React.createElement("div", {
  className: "profile-divider"
}), /*#__PURE__*/React.createElement(MedicalSectionSkeleton, null), /*#__PURE__*/React.createElement("div", {
  className: "profile-divider"
}), /*#__PURE__*/React.createElement(ContactSectionSkeleton, null)));
const ProfileHeaderSkeleton = () => /*#__PURE__*/React.createElement("div", {
  className: "profile-header"
}, /*#__PURE__*/React.createElement("div", {
  className: "avatar-section"
}, /*#__PURE__*/React.createElement(Skeleton, {
  shape: "circle",
  size: "80px"
})), /*#__PURE__*/React.createElement("div", {
  className: "profile-info flex-grow-1"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "70%",
  height: "28px",
  className: "mb-2"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "40%",
  height: "18px",
  className: "mb-3"
}), /*#__PURE__*/React.createElement("div", {
  className: "contact-info-grid"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "100%",
  height: "16px",
  className: "mb-2"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "100%",
  height: "16px",
  className: "mb-2"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "100%",
  height: "16px"
}))));
const MedicalSectionSkeleton = () => /*#__PURE__*/React.createElement("div", {
  className: "medical-section"
}, /*#__PURE__*/React.createElement("div", {
  className: "section-header mb-3"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "160px",
  height: "22px"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "30px",
  height: "22px"
})), [...Array(3)].map((_, index) => /*#__PURE__*/React.createElement("div", {
  key: index,
  className: "medical-item mb-2"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "120px",
  height: "18px",
  className: "me-2"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "60%",
  height: "18px"
}))));
const ContactSectionSkeleton = () => /*#__PURE__*/React.createElement("div", {
  className: "contact-section"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "180px",
  height: "22px",
  className: "mb-3"
}), [...Array(4)].map((_, index) => /*#__PURE__*/React.createElement("div", {
  key: index,
  className: "contact-detail-item mb-2"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "80px",
  height: "18px",
  className: "me-2"
}), /*#__PURE__*/React.createElement(Skeleton, {
  width: "70%",
  height: "18px"
}))), /*#__PURE__*/React.createElement("div", {
  className: "insurance-section mt-3"
}, /*#__PURE__*/React.createElement(Skeleton, {
  width: "120px",
  height: "32px",
  borderRadius: "16px"
})));
export default PatientProfileSkeleton;