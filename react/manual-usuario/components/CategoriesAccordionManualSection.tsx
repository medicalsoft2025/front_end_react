import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

import { CategoryHeaderManualSection } from "./CategoryHeaderManualSection";
import { VideoCardManualSection } from "./VideoCardManualSection";
import { EmptyStateManualSection } from "./EmptyStateManualSection";



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
        return (
            <EmptyStateManualSection
                searchTerm={searchTerm}
                setShowCategoryModal={setShowCategoryModal}
            />
        );
    }

    return (
        <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            {filteredCategories.map((cat) => (
                <AccordionTab
                    key={cat.id}
                    header={
                        <CategoryHeaderManualSection
                            category={cat}
                            showToast={showToast}
                        />
                    }
                >
                    <div className="row g-4">
                        {cat.videos.length > 0 ? (
                            cat.videos.map((video, vidIndex) => (
                                <VideoCardManualSection
                                    key={video.id}
                                    video={video}
                                    category={cat}
                                    vidIndex={vidIndex}
                                    openVideoModal={openVideoModal}
                                    showToast={showToast}
                                />
                            ))
                        ) : (
                            <div className="col-12">
                                <EmptyStateManualSection
                                    isCategoryEmpty={true}
                                    setShowVideoModal={setShowVideoModal}
                                />
                            </div>
                        )}
                    </div>
                </AccordionTab>
            ))}
        </Accordion>
    );
}