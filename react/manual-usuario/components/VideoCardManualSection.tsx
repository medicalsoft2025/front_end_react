import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { confirmDialog } from "primereact/confirmdialog";

export function VideoCardManualSection({ video, category, vidIndex, openVideoModal, showToast }) {
    const getYouTubeVideoId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    const confirmDeleteVideo = (video) => {
        confirmDialog({
            message: `¿Estás seguro de que quieres eliminar el video "${video.title}"?`,
            header: 'Confirmar eliminación',
            icon: 'fas fa-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => handleDeleteVideo(video.id),
            reject: () => { }
        });
    };

    const handleDeleteVideo = async (videoId) => {
        try {
            showToast("success", "Éxito", "Video eliminado correctamente");
        } catch {
            showToast("error", "Error", "No se pudo eliminar el video");
        }
    };

    const videoId = getYouTubeVideoId(video.url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : '/default-video-thumbnail.jpg';

    return (
        <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
            <Card className="video-card fade-in" style={{ animationDelay: `${vidIndex * 0.1}s` }}>
                <div className="video-actions">
                    <Tooltip target={`.edit-vid-${video.id}`} content="Editar video" />
                    <Button
                        className={`p-button-rounded p-button-text p-button-sm edit-vid-${video.id}`}
                    ><i className="fas fa-edit"></i></Button>
                    <Tooltip target={`.delete-vid-${video.id}`} content="Eliminar video" />
                    <Button
                        className={`p-button-rounded p-button-text p-button-danger p-button-sm delete-vid-${video.id}`}
                        onClick={() => confirmDeleteVideo(video)}
                    ><i className="fas fa-trash"></i></Button>
                </div>

                <div className="p-3 h-100 d-flex flex-column">
                    <h5 className="fw-bold mb-3 text-truncate">
                        <i className="fas fa-play-circle text-primary me-2"></i>
                        {video.title}
                    </h5>

                    <div
                        className="text-muted small mb-3 flex-grow-1"
                        dangerouslySetInnerHTML={{ __html: video.description }}
                    />

                    <div
                        className="video-preview"
                        onClick={() => openVideoModal(video)}
                    >
                        <img
                            src={thumbnailUrl}
                            alt={`Thumbnail de ${video.title}`}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKoiBWaWRlbyDiiqI8L3RleHQ+PC9zdmc+';
                            }}
                        />
                        <div className="play-overlay">
                            <div className="play-button">
                                <i className="fas fa-play"></i>
                            </div>
                        </div>
                        <div className="video-duration">
                            <i className="fas fa-clock me-1"></i>
                            {video.duration || '5:30'}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-tag text-muted me-2"></i>
                            <small className="text-muted">{category.name}</small>
                        </div>
                        <Button
                            label="Ver Video"
                            className="p-button-primary p-button-sm"
                            onClick={() => openVideoModal(video)}
                        ><i className="fas fa-play"></i></Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}