import React from "react";
export function UserManualSection({
  totalVideos,
  totalMinutes,
  categoriesCount
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "hero-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "display-4 fw-bold mb-3 slide-in-left"
  }, "Manual de Usuario MedicalSoft", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-book-medical me-3",
    style: {
      fontSize: "30px",
      marginLeft: "15px"
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "lead mb-4 fs-8"
  }, "Domina todas las funcionalidades del sistema con nuestra completa documentaci\xF3n en video paso a paso y gu\xEDas interactivas."), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-3 justify-content-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge bg-light text-dark fs-6 p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star me-2 text-warning"
  }), "Tutoriales Actualizados"), /*#__PURE__*/React.createElement("span", {
    className: "badge bg-light text-dark fs-6 p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clock me-2 text-info"
  }), "+", totalMinutes, " Minutos"), /*#__PURE__*/React.createElement("span", {
    className: "badge bg-light text-dark fs-6 p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-video me-2 text-success"
  }), totalVideos, " Videos"))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-4 text-center mt-4 mt-lg-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-circle d-inline-flex align-items-center justify-content-center pulse-animation",
    style: {
      width: '140px',
      height: '140px',
      background: 'rgba(255,255,255,0.2)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-play-circle",
    style: {
      fontSize: '3.5rem',
      color: 'white'
    }
  })))));
}