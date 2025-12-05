import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { confirmDialog } from "primereact/confirmdialog";
export function VideoCardManualSection({
  video,
  category,
  vidIndex,
  openVideoModal,
  showToast
}) {
  const getYouTubeVideoId = url => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };
  const confirmDeleteVideo = video => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar el video "${video.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'fas fa-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteVideo(video.id),
      reject: () => {}
    });
  };
  const handleDeleteVideo = async videoId => {
    try {
      showToast("success", "Éxito", "Video eliminado correctamente");
    } catch {
      showToast("error", "Error", "No se pudo eliminar el video");
    }
  };
  const videoId = getYouTubeVideoId(video.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-video-thumbnail.jpg';
  return /*#__PURE__*/React.createElement("div", {
    className: "col-xxl-3 col-xl-4 col-lg-6 col-md-6"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "video-card fade-in",
    style: {
      animationDelay: `${vidIndex * 0.1}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "video-actions"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    target: `.edit-vid-${video.id}`,
    content: "Editar video"
  }), /*#__PURE__*/React.createElement(Button, {
    className: `p-button-rounded p-button-text p-button-sm edit-vid-${video.id}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  })), /*#__PURE__*/React.createElement(Tooltip, {
    target: `.delete-vid-${video.id}`,
    content: "Eliminar video"
  }), /*#__PURE__*/React.createElement(Button, {
    className: `p-button-rounded p-button-text p-button-danger p-button-sm delete-vid-${video.id}`,
    onClick: () => confirmDeleteVideo(video)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 h-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-3 text-truncate"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-play-circle text-primary me-2"
  }), video.title), /*#__PURE__*/React.createElement("div", {
    className: "text-muted small mb-3 flex-grow-1",
    dangerouslySetInnerHTML: {
      __html: video.description
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "video-preview",
    onClick: () => openVideoModal(video)
  }, /*#__PURE__*/React.createElement("img", {
    src: thumbnailUrl,
    alt: `Thumbnail de ${video.title}`,
    onError: e => {
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKoiBWaWRlbyDiiqI8L3RleHQ+PC9zdmc+';
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "play-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "play-button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-play"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "video-duration"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clock me-1"
  }), video.duration || '5:30')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mt-auto pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-tag text-muted me-2"
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, category.name)), /*#__PURE__*/React.createElement(Button, {
    label: "Ver Video",
    className: "p-button-primary p-button-sm",
    onClick: () => openVideoModal(video)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-play"
  }))))));
}