import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar"; 
import Header from "./Header";
import { ActiveCallProvider } from "@/components/followup/context/ActiveCallContext";
import { cn } from '@/lib/utils';
import { Outlet, useLocation } from "react-router-dom"; // Import Outlet and useLocation
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme

// Remove children prop from interface
interface AppLayoutProps {
  // children: ReactNode; 
}

// Remove children from destructuring
const AppLayout = () => { 
  const { colorTheme } = useTheme(); // Get the current color theme
  // Keep sidebar open by default, but allow user to toggle it
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isAgentsPage = location.pathname === '/agents' || location.pathname === '/my-agents'; // Check if it's the agents page
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  // Reset sidebar state when location changes to keep it open by default
  useEffect(() => {
    setIsSidebarCollapsed(false);
  }, [location.pathname]);
  
  // Handle click on main content area to collapse sidebar
  const handleContentClick = () => {
    // Only collapse if it's currently expanded
    if (!isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  };
  
  // Always use classic theme gradient
  const getGradientClass = () => {
    return 'bg-gradient-green';
  };
  
  return (
    <ActiveCallProvider> {/* Keep context provider if still relevant */}
      {/* Main flex container */}
      <div className="flex h-screen overflow-hidden relative"> {/* Added relative back */} 
        {/* Background Container - Now uses the global --background variable */}
        {/* Removed the div that applied the gradient */}
        
        {/* Sidebar - Added relative and z-index back */}
        <Sidebar 
          className="relative z-10" 
          isCollapsed={isSidebarCollapsed}
          onMouseEnter={() => setIsSidebarCollapsed(false)}
          onToggle={toggleSidebar}
        /> 
        
        {/* Main content area - Added relative and z-index back */}
        <div 
          className="flex-1 flex flex-col overflow-hidden relative z-10"
          onClick={handleContentClick} // Add click handler to collapse sidebar
        > 
          {/* Conditionally render the entire header + main structure */}
          {isAgentsPage ? (
            // Structure for Agents page (no header, no top padding)
            <main className="flex-1 overflow-y-auto relative"> 
              <div className="relative z-10 h-full"> 
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Outlet /> 
                </motion.div>
              </div>
            </main>
          ) : (
            // Structure for other pages (with header and top padding)
            <>
              <Header className="bg-transparent border-none shadow-none relative z-20" />
              <main className="flex-1 overflow-y-auto relative pt-16"> 
                <div className="relative z-10 h-full"> 
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Outlet /> 
                  </motion.div>
                </div>
              </main>
            </>
          )}
        </div>
        
      </div>
    </ActiveCallProvider>
  );
};

export default AppLayout;
// Removed duplicated code below this line
