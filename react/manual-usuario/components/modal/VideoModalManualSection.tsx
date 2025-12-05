import React from "react";
import { Dialog } from "primereact/dialog";

export function VideoModalManualSection({ videoDialog, setVideoDialog, selectedVideo }) {
    return (
        <Dialog
            visible={videoDialog}
            onHide={() => setVideoDialog(false)}
            className="video-modal"
            header={selectedVideo?.title}
            modal
            style={{ width: '95vw', maxWidth: '1200px' }}
        >
            {selectedVideo && (
                <div className="ratio ratio-16x9">
                    <iframe
                        src={`${selectedVideo.url}?autoplay=1&rel=0&modestbranding=1`}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '10px' }}
                    ></iframe>
                </div>
            )}
            {selectedVideo?.description && (
                <div className="mt-3 p-3 bg-light rounded">
                    <h6>Descripción:</h6>
                    <div
                        className="text-muted"
                        dangerouslySetInnerHTML={{ __html: selectedVideo.description }}
                    />
                </div>
            )}

            <style>
                {`
          .video-modal .p-dialog {
            max-width: 95vw;
            width: 1200px;
          }
          
          .video-modal iframe {
            width: 100%;
            height: 70vh;
            border-radius: 10px;
          }
        `}
            </style>
        </Dialog>
    );
}