import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useManualUsuarioVideoCategories } from "./hooks/useManualUsuarioVideoCategories";
import { StatsSection } from "./components/StatsSection";
import { NewCategoryModal } from "./NewCategoryModal";
import { NewVideoModal } from "./NewVideoModal";
import { VideoModalManualSection } from "./components/modal/VideoModalManualSection";
import { UserManualSection } from "./components/UserManualSection";
import { StickyHeaderManualSection } from "./components/StickyHeaderManualSection";
import { CategoriesAccordionManualSection } from "./components/CategoriesAccordionManualSection";
import { QuickHelpManualSection } from "./components/QuickHelpManualSection";
import { FooterManualSection } from "./components/FooterManualSection";
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

  const { categories, loading, addCategory, addVideo } = useManualUsuarioVideoCategories();
  const toast = useRef(null);

  // Filtrado de categorías y videos
  useEffect(() => {
    if (categories && categories.length > 0) {
      const filtered = categories.map(category => ({
        ...category,
        videos: category.videos.filter(video =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category =>
        category.videos.length > 0 ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const handleAddCategory = async (category) => {
    try {
      await addCategory(category);
      showToast("success", "Éxito", "Categoría creada correctamente");
    } catch {
      showToast("error", "Error", "No se pudo crear la categoría");
    }
  };

  const handleAddVideo = async (video) => {
    try {
      await addVideo(video);
      showToast("success", "Éxito", "Video agregado correctamente");
    } catch {
      showToast("error", "Error", "No se pudo agregar el video");
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setVideoDialog(true);
  };

  const totalVideos = categories.reduce((total, cat) => total + cat.videos.length, 0);
  const totalMinutes = categories.reduce((total, cat) => total + cat.videos.length * 5, 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manual-usuario-container">
      <GlobalStyles />

      <Toast ref={toast} />
      <ConfirmDialog />

      <VideoModalManualSection
        videoDialog={videoDialog}
        setVideoDialog={setVideoDialog}
        selectedVideo={selectedVideo}
      />

      <div className="manual-content">
        <UserManualSection
          totalVideos={totalVideos}
          totalMinutes={totalMinutes}
          categoriesCount={categories.length}
        />

        <div className="content-wrapper">
          <StickyHeaderManualSection
            isScrolled={isScrolled}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowCategoryModal={setShowCategoryModal}
            setShowVideoModal={setShowVideoModal}
          />

          <StatsSection
            categories={categories}
            totalVideos={totalVideos}
            totalMinutes={totalMinutes}
          />

          <CategoriesAccordionManualSection
            filteredCategories={filteredCategories}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            searchTerm={searchTerm}
            openVideoModal={openVideoModal}
            setShowCategoryModal={setShowCategoryModal}
            setShowVideoModal={setShowVideoModal}
            showToast={showToast}
          />

          <QuickHelpManualSection />
          <FooterManualSection />
        </div>
      </div>

      <FloatingActionButton setShowVideoModal={setShowVideoModal} />

      <NewCategoryModal
        visible={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSubmit={handleAddCategory}
      />

      <NewVideoModal
        visible={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        onSubmit={handleAddVideo}
        categories={categories}
      />
    </div>
  );
}

// Componentes auxiliares
const LoadingSpinner = () => (
  <div className="flex justify-content-center align-items-center min-h-screen">
    <div className="text-center">
      <ProgressSpinner
        style={{ width: '60px', height: '60px' }}
        strokeWidth="4"
        animationDuration=".5s"
      />
      <p className="mt-3 text-muted fs-5">
        <i className="fas fa-spinner fa-spin me-2"></i>
        Cargando manual de usuario...
      </p>
    </div>
  </div>
);

const GlobalStyles = () => (
  <style>
    {`
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
    `}
  </style>
);

const FloatingActionButton = ({ setShowVideoModal }) => (
  <div className="floating-action-btn">
    <Button
      className="p-button-success p-button-raised p-button-circle"
      style={{ width: '60px', height: '60px' }}
      onClick={() => setShowVideoModal(true)}
    ><i className="fa-solid fa-video"></i></Button>

  </div>
);