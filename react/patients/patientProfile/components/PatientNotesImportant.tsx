import { Button } from 'primereact/button';
import React from 'react';

const PatientNotesImportant = ({ patient, onAddNote, onEditNote }) => {
    if (!patient) return null;

    const importantNotes = patient.important_notes || [
        {
            id: 1,
            title: "Alergias",
            content: "Alérgico a la penicilina y antiinflamatorios no esteroideos",
            priority: "high",
            date: "2024-01-15",
            author: "Dr. García"
        },
        {
            id: 2,
            title: "Condición Crónica",
            content: "Paciente con diabetes tipo 2. Controlar niveles de glucosa regularmente",
            priority: "medium",
            date: "2024-01-10",
            author: "Dr. Martínez"
        },
        {
            id: 3,
            title: "Medicación Actual",
            content: "Tomando metformina 500mg cada 12 horas y losartán 50mg diarios",
            priority: "medium",
            date: "2024-01-08",
            author: "Enf. Rodríguez"
        }
    ];

    return (
        <div className="important-notes-section">
            <h3 className="section-title">
                <i className="fas fa-exclamation-circle me-2"></i>
                Notas Importantes
                <div className='d-flex'>
                    <Button
                        className="p-button-primary"
                        style={{ width: "100%", marginLeft: "10px", fontSize: "10px", marginTop: "10px" }}
                        onClick={onAddNote}
                    >
                        <i className='fas fa-plus'></i>
                    </Button>
                </div>
            </h3>

            <div className="notes-container">
                {importantNotes.length === 0 ? (
                    <div className="no-notes-message">
                        <i className="fas fa-info-circle me-2"></i>
                        No hay notas importantes registradas
                    </div>
                ) : (
                    importantNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={() => onEditNote && onEditNote(note)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const NoteCard = ({ note, onEdit }) => {
    const getPriorityIcon = (priority) => {
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

    const getPriorityText = (priority) => {
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

    return (
        <div className={`note-card priority-${note.priority}`}>
            <div className="note-header">
                <div className="note-title-section">
                    <i className={getPriorityIcon(note.priority)}></i>
                    <span className="note-title">{note.title}</span>
                    <span className={`priority-badge priority-${note.priority}`}>
                        {getPriorityText(note.priority)}
                    </span>
                </div>
                <Button
                    className="p-button-text p-button-sm"
                    onClick={onEdit}
                >
                    <i className='fas fa-edit'></i>  </Button>
            </div>

            <div className="note-content">
                {note.content}
            </div>

            <div className="note-footer">
                <div className="note-meta">
                    <span className="note-author">
                        <i className="fas fa-user-md me-1"></i>
                        {note.author}
                    </span>
                    <span className="note-date">
                        <i className="fas fcalendara- me-1"></i>
                        {new Date(note.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PatientNotesImportant;