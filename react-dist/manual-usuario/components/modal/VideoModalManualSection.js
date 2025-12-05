import React from "react";
import { Dialog } from "primereact/dialog";
export function VideoModalManualSection({
  videoDialog,
  setVideoDialog,
  selectedVideo
}) {
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: videoDialog,
    onHide: () => setVideoDialog(false),
    className: "video-modal",
    header: selectedVideo?.title,
    modal: true,
    style: {
      width: '95vw',
      maxWidth: '1200px'
    }
  }, selectedVideo && /*#__PURE__*/React.createElement("div", {
    className: "ratio ratio-16x9"
  }, /*#__PURE__*/React.createElement("iframe", {
    src: `${selectedVideo.url}?autoplay=1&rel=0&modestbranding=1`,
    title: selectedVideo.title,
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true,
    style: {
      borderRadius: '10px'
    }
  })), selectedVideo?.description && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("h6", null, "Descripci\xF3n:"), /*#__PURE__*/React.createElement("div", {
    className: "text-muted",
    dangerouslySetInnerHTML: {
      __html: selectedVideo.description
    }
  })), /*#__PURE__*/React.createElement("style", null, `
          .video-modal .p-dialog {
            max-width: 95vw;
            width: 1200px;
          }
          
          .video-modal iframe {
            width: 100%;
            height: 70vh;
            border-radius: 10px;
          }
        `));
}