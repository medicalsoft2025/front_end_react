import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useManualUsuarioVideoCategories } from "./hooks/useManualUsuarioVideoCategories.js";
import { StatsSection } from "./components/StatsSection.js";
import { NewCategoryModal } from "./NewCategoryModal.js";
import { NewVideoModal } from "./NewVideoModal.js";
import { VideoModalManualSection } from "./components/modal/VideoModalManualSection.js";
import { UserManualSection } from "./components/UserManualSection.js";
import { StickyHeaderManualSection } from "./components/StickyHeaderManualSection.js";
import { CategoriesAccordionManualSection } from "./components/CategoriesAccordionManualSection.js";
import { QuickHelpManualSection } from "./components/QuickHelpManualSection.js";
import { FooterManualSection } from "./components/FooterManualSection.js";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
export function ManualUsuario() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDialog, setVideoDialog] = useState(false);
  const {
    categories,
    loading,
    addCategory,
    addVideo
  } = useManualUsuarioVideoCategories();
  const toast = useRef(null);

  // Filtrado de categorías y videos
  useEffect(() => {
    if (categories && categories.length > 0) {
      const filtered = categories.map(category => ({
        ...category,
        videos: category.videos.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()) || video.description.toLowerCase().includes(searchTerm.toLowerCase()))
      })).filter(category => category.videos.length > 0 || category.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredCategories(filtered);
    }
  }, [categories, searchTerm]);

  // Efecto para el header sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleAddCategory = async category => {
    try {
      await addCategory(category);
      showToast("success", "Éxito", "Categoría creada correctamente");
    } catch {
      showToast("error", "Error", "No se pudo crear la categoría");
    }
  };
  const handleAddVideo = async video => {
    try {
      await addVideo(video);
      showToast("success", "Éxito", "Video agregado correctamente");
    } catch {
      showToast("error", "Error", "No se pudo agregar el video");
    }
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const openVideoModal = video => {
    setSelectedVideo(video);
    setVideoDialog(true);
  };
  const totalVideos = categories.reduce((total, cat) => total + cat.videos.length, 0);
  const totalMinutes = categories.reduce((total, cat) => total + cat.videos.length * 5, 0);
  if (loading) {
    return /*#__PURE__*/React.createElement(LoadingSpinner, null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "manual-usuario-container"
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(ConfirmDialog, null), /*#__PURE__*/React.createElement(VideoModalManualSection, {
    videoDialog: videoDialog,
    setVideoDialog: setVideoDialog,
    selectedVideo: selectedVideo
  }), /*#__PURE__*/React.createElement("div", {
    className: "manual-content"
  }, /*#__PURE__*/React.createElement(UserManualSection, {
    totalVideos: totalVideos,
    totalMinutes: totalMinutes,
    categoriesCount: categories.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "content-wrapper"
  }, /*#__PURE__*/React.createElement(StickyHeaderManualSection, {
    isScrolled: isScrolled,
    searchTerm: searchTerm,
    setSearchTerm: setSearchTerm,
    setShowCategoryModal: setShowCategoryModal,
    setShowVideoModal: setShowVideoModal
  }), /*#__PURE__*/React.createElement(StatsSection, {
    categories: categories,
    totalVideos: totalVideos,
    totalMinutes: totalMinutes
  }), /*#__PURE__*/React.createElement(CategoriesAccordionManualSection, {
    filteredCategories: filteredCategories,
    activeIndex: activeIndex,
    setActiveIndex: setActiveIndex,
    searchTerm: searchTerm,
    openVideoModal: openVideoModal,
    setShowCategoryModal: setShowCategoryModal,
    setShowVideoModal: setShowVideoModal,
    showToast: showToast
  }), /*#__PURE__*/React.createElement(QuickHelpManualSection, null), /*#__PURE__*/React.createElement(FooterManualSection, null))), /*#__PURE__*/React.createElement(FloatingActionButton, {
    setShowVideoModal: setShowVideoModal
  }), /*#__PURE__*/React.createElement(NewCategoryModal, {
    visible: showCategoryModal,
    onHide: () => setShowCategoryModal(false),
    onSubmit: handleAddCategory
  }), /*#__PURE__*/React.createElement(NewVideoModal, {
    visible: showVideoModal,
    onHide: () => setShowVideoModal(false),
    onSubmit: handleAddVideo,
    categories: categories
  }));
}

// Componentes auxiliares
const LoadingSpinner = () => /*#__PURE__*/React.createElement("div", {
  className: "flex justify-content-center align-items-center min-h-screen"
}, /*#__PURE__*/React.createElement("div", {
  className: "text-center"
}, /*#__PURE__*/React.createElement(ProgressSpinner, {
  style: {
    width: '60px',
    height: '60px'
  },
  strokeWidth: "4",
  animationDuration: ".5s"
}), /*#__PURE__*/React.createElement("p", {
  className: "mt-3 text-muted fs-5"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-spinner fa-spin me-2"
}), "Cargando manual de usuario...")));
const GlobalStyles = () => /*#__PURE__*/React.createElement("style", null, `
      .manual-usuario-container {
        background: #f8f9fa;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .manual-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        overflow: hidden;
        margin: 1rem;
        min-height: calc(100vh - 2rem);
      }
      
      .content-wrapper {
        padding: 0 3rem;
      }

      @media (max-width: 768px) {
        .manual-content {
          margin: 0.5rem;
          border-radius: 8px;
        }
        
        .content-wrapper {
          padding: 0 1.5rem;
        }
      }
    `);
const FloatingActionButton = ({
  setShowVideoModal
}) => /*#__PURE__*/React.createElement("div", {
  className: "floating-action-btn"
}, /*#__PURE__*/React.createElement(Button, {
  className: "p-button-success p-button-raised p-button-circle",
  style: {
    width: '60px',
    height: '60px'
  },
  onClick: () => setShowVideoModal(true)
}, /*#__PURE__*/React.createElement("i", {
  className: "fa-solid fa-video"
})));