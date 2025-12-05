import { Skeleton } from 'primereact/skeleton';
import React from 'react';
const NavbarSkeleton = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "skeleton-navbar",
    style: {
      width: '100%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "desktop-skeleton hidden md:block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-center w-full",
    style: {
      height: '64px',
      margin: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-6",
    style: {
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "100px",
    height: "25px",
    borderRadius: "6px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100px",
    height: "25px",
    borderRadius: "6px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100px",
    height: "25px",
    borderRadius: "6px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100px",
    height: "25px",
    borderRadius: "6px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100px",
    height: "25px",
    borderRadius: "6px",
    className: "menu-item-skeleton"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mobile-skeleton block md:hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center w-full",
    style: {
      height: '60px',
      margin: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center gap-3",
    style: {
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "70px",
    height: "20px",
    borderRadius: "4px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "70px",
    height: "20px",
    borderRadius: "4px",
    className: "menu-item-skeleton"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "70px",
    height: "20px",
    borderRadius: "4px",
    className: "menu-item-skeleton"
  })))), /*#__PURE__*/React.createElement("style", null, `
                .skeleton-navbar {
                    width: 100%;
                    background: var(--surface-card);
                }

                .skeleton-navbar .p-skeleton {
                    background: linear-gradient(
                        90deg,
                        var(--surface-300) 0%,
                        var(--surface-200) 50%,
                        var(--surface-300) 100%
                    );
                    background-size: 400% 400%;
                    animation: skeleton-pulse 2s ease-in-out infinite;
                    flex-shrink: 0;
                }

                .menu-item-skeleton {
                    animation-delay: 0.2s;
                    flex-shrink: 0;
                }

                @keyframes skeleton-pulse {
                    0% {
                        background-position: -200% 0%;
                    }
                    100% {
                        background-position: 200% 0%;
                    }
                }

                /* Responsive breakpoints */
                @media (max-width: 768px) {
                    .desktop-skeleton {
                        display: none !important;
                    }
                    
                    .mobile-skeleton {
                        display: flex !important;
                    }
                }

                @media (min-width: 769px) {
                    .desktop-skeleton {
                        display: flex !important;
                    }
                    
                    .mobile-skeleton {
                        display: none !important;
                    }
                }

                /* Asegurar que no haya wrap */
                .desktop-skeleton .flex,
                .mobile-skeleton .flex {
                    flex-wrap: nowrap !important;
                    white-space: nowrap;
                }
                `));
};
export default NavbarSkeleton;