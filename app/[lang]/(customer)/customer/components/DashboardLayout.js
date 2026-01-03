"use client";

import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";

import { useEffect, useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavSideBar from "./NavSideBar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children, params, dictionary }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useLayoutEffect(() => {
    if (window) {
      setIsCollapsed(window.innerWidth < 640);
      setIsSmall(window.innerWidth < 640);
      setIsDrawerOpen(window.innerWidth > 640);
    }
  }, []);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  useEffect(() => {
    // console.log(Navigator.online);
  }, []);
  return (
    <SessionProvider>
      <ToastContainer />
      <Provider store={store}>
        <div className="flex h-screen relative">
        <button
        onClick={toggleDrawer}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

          {/* Sidebar */}
          <NavSideBar
            params={params}
            setIsCollapsed={setIsCollapsed}
            isCollapsed={isCollapsed}
            isSmall={isSmall}
            dictionary={dictionary.navItems}
            isDrawerOpen={isDrawerOpen}
          />

          {/* Main Content */}
          <div className="flex-1 relative overflow-hidden ">
            <div className="h-full  dark:bg-gray-950/95 mainContainer overflow-x-auto flex justify-center items-start min-w-full relative">
              {children}
            </div>
          </div>
        </div>
      </Provider>
    </SessionProvider>
  );
};

export default DashboardLayout;
