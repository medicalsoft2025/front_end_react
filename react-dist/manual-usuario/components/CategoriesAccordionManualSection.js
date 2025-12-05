import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CategoryHeaderManualSection } from "./CategoryHeaderManualSection.js";
import { VideoCardManualSection } from "./VideoCardManualSection.js";
import { EmptyStateManualSection } from "./EmptyStateManualSection.js";
export function CategoriesAccordionManualSection({
  filteredCategories,
  activeIndex,
  setActiveIndex,
  searchTerm,
  openVideoModal,
  setShowCategoryModal,
  setShowVideoModal,
  showToast
}) {
  if (filteredCategories.length === 0) {
    return /*#__PURE__*/React.createElement(EmptyStateManualSection, {
      searchTerm: searchTerm,
      setShowCategoryModal: setShowCategoryModal
    });
  }
  return /*#__PURE__*/React.createElement(Accordion, {
    multiple: true,
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, filteredCategories.map(cat => /*#__PURE__*/React.createElement(AccordionTab, {
    key: cat.id,
    header: /*#__PURE__*/React.createElement(CategoryHeaderManualSection, {
      category: cat,
      showToast: showToast
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, cat.videos.length > 0 ? cat.videos.map((video, vidIndex) => /*#__PURE__*/React.createElement(VideoCardManualSection, {
    key: video.id,
    video: video,
    category: cat,
    vidIndex: vidIndex,
    openVideoModal: openVideoModal,
    showToast: showToast
  })) : /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(EmptyStateManualSection, {
    isCategoryEmpty: true,
    setShowVideoModal: setShowVideoModal
  }))))));
}