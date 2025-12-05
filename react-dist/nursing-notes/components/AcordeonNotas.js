import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
const NotasCards = ({
  notas,
  loading,
  onEdit,
  onDelete
}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatDateShort = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  const getTimeAgo = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatDateShort(dateString);
  };

  // Estilos inline
  const styles = {
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'flex-start',
      alignItems: 'stretch'
    },
    card: {
      flex: '1 1 300px',
      maxWidth: '350px',
      minWidth: '280px',
      transition: 'all 0.3s ease',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    },
    header: {
      background: 'linear-gradient(90deg, #1A99FB, #29F6C1)',
      color: 'white',
      padding: '1rem',
      borderRadius: '12px 12px 0 0',
      borderBottom: 'none'
    },
    content: {
      padding: '1.25rem',
      flexGrow: 1
    },
    footer: {
      padding: '1rem 1.25rem',
      borderTop: '1px solid #f8f9fa',
      background: '#fafbfc'
    },
    noteText: {
      display: '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      lineHeight: '1.6',
      color: '#495057',
      fontSize: '0.9rem'
    },
    skeletonCard: {
      flex: '1 1 300px',
      maxWidth: '350px',
      minWidth: '280px'
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      style: styles.cardContainer
    }, [...Array(6)].map((_, index) => /*#__PURE__*/React.createElement(Card, {
      key: index,
      style: {
        ...styles.card,
        ...styles.skeletonCard
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column h-100"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "1.5rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "80%",
      height: "1rem",
      className: "mb-3"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "4rem",
      className: "mb-3 flex-grow-1"
    }), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mt-auto"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "6rem",
      height: "1.5rem"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "6rem",
      height: "1.5rem"
    }))))));
  }
  if (notas.length === 0) {
    return /*#__PURE__*/React.createElement(Card, {
      className: "text-center border-0 bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-auto mb-4",
      style: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-clipboard text-white",
      style: {
        fontSize: '2rem'
      }
    })), /*#__PURE__*/React.createElement("h3", {
      className: "text-muted mb-3"
    }, "No hay notas registradas"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted mb-0"
    }, "Comience agregando la primera nota de enfermer\xEDa para este paciente.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: styles.cardContainer
  }, notas.map((nota, index) => /*#__PURE__*/React.createElement(Card, {
    key: nota.id || index,
    className: "h-100 position-relative",
    style: styles.card,
    onMouseEnter: e => {
      e.currentTarget.style.transform = styles.cardHover.transform;
      e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = styles.card.boxShadow;
    },
    title: undefined
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.header,
    className: "position-relative"
  }, /*#__PURE__*/React.createElement(Badge, {
    value: index + 1,
    className: "position-absolute",
    style: {
      top: '-8px',
      right: '-8px',
      background: 'rgba(224, 219, 219, 0.59)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(224, 219, 219, 0.23)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-start"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-black mb-0 fw-semibold",
    style: {
      fontSize: '0.95rem',
      lineHeight: '1.3'
    }
  }, nota.titulo))), /*#__PURE__*/React.createElement("div", {
    style: styles.content,
    className: "d-flex flex-column h-100"
  }, /*#__PURE__*/React.createElement("p", {
    style: styles.noteText,
    className: "flex-grow-1 mb-3"
  }, nota.nota), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 p-2 rounded bg-light"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user me-2 text-primary"
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted fw-medium"
  }, nota.enfermera)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center text-xs text-muted"
  }, /*#__PURE__*/React.createElement(Tag, {
    value: getTimeAgo(nota.created_at),
    icon: "pi pi-clock",
    severity: "info",
    className: "border-0 px-2 py-1",
    style: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      fontSize: '0.75rem'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: styles.footer,
    className: "rounded-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, formatDateShort(nota.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-1"
  }, onEdit && /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-pencil",
    className: "p-button-sm p-button-rounded p-button-text p-button-secondary",
    tooltip: "Editar nota",
    tooltipOptions: {
      position: 'top'
    },
    onClick: () => onEdit(nota.id),
    style: {
      width: '32px',
      height: '32px'
    }
  }), onDelete && /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-trash",
    className: "p-button-sm p-button-rounded p-button-text p-button-danger",
    tooltip: "Eliminar nota",
    tooltipOptions: {
      position: 'top'
    },
    onClick: () => onDelete(nota.id),
    style: {
      width: '32px',
      height: '32px'
    }
  })))))));
};
export default NotasCards;