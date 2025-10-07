import { useState, useEffect } from "react";

export const useResponsiveSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSidebarOpen(false);
      setIsMobileMenuOpen(false);
    };
  
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return { isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen };
};
