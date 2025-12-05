import { Button } from 'primereact/button';
import React from 'react';
const PatientNotesImportant = ({
  patient,
  onAddNote,
  onEditNote
}) => {
  if (!patient) return null;
  const importantNotes = patient.important_notes || [{
    id: 1,
    title: "Alergias",
    content: "Alérgico a la penicilina y antiinflamatorios no esteroideos",
    priority: "high",
    date: "2024-01-15",
    author: "Dr. García"
  }, {
    id: 2,
    title: "Condición Crónica",
    content: "Paciente con diabetes tipo 2. Controlar niveles de glucosa regularmente",
    priority: "medium",
    date: "2024-01-10",
    author: "Dr. Martínez"
  }, {
    id: 3,
    title: "Medicación Actual",
    content: "Tomando metformina 500mg cada 12 horas y losartán 50mg diarios",
    priority: "medium",
    date: "2024-01-08",
    author: "Enf. Rodríguez"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "important-notes-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "section-title mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle me-2"
  }), "Notas Importantes", /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    style: {
      width: "100%",
      marginLeft: "10px",
      fontSize: "10px",
      marginTop: "10px"
    },
    onClick: onAddNote
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "notes-container"
  }, importantNotes.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "no-notes-message"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-info-circle me-2"
  }), "No hay notas importantes registradas") : importantNotes.map(note => /*#__PURE__*/React.createElement(NoteCard, {
    key: note.id,
    note: note,
    onEdit: () => onEditNote && onEditNote(note)
  }))));
};
const NoteCard = ({
  note,
  onEdit
}) => {
  const getPriorityIcon = priority => {
    switch (priority) {
      case 'high':
        return 'fas fa-exclamation-triangle text-danger';
      case 'medium':
        return 'fas fa-exclamation-circle text-warning';
      case 'low':
        return 'fas fa-info-circle text-info';
      default:
        return 'fas fa-sticky-note text-secondary';
    }
  };
  const getPriorityText = priority => {
    switch (priority) {
      case 'high':
        return 'Alta Prioridad';
      case 'medium':
        return 'Media Prioridad';
      case 'low':
        return 'Baja Prioridad';
      default:
        return 'Nota';
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `note-card priority-${note.priority}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "note-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "note-title-section"
  }, /*#__PURE__*/React.createElement("i", {
    className: getPriorityIcon(note.priority)
  }), /*#__PURE__*/React.createElement("span", {
    className: "note-title"
  }, note.title), /*#__PURE__*/React.createElement("span", {
    className: `priority-badge priority-${note.priority}`
  }, getPriorityText(note.priority))), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-text p-button-sm",
    onClick: onEdit
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  }), "  ")), /*#__PURE__*/React.createElement("div", {
    className: "note-content"
  }, note.content), /*#__PURE__*/React.createElement("div", {
    className: "note-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "note-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "note-author"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user-md me-1"
  }), note.author), /*#__PURE__*/React.createElement("span", {
    className: "note-date"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fcalendara- me-1"
  }), new Date(note.date).toLocaleDateString()))));
};
export default PatientNotesImportant;