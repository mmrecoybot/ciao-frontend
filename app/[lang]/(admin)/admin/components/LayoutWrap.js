"use client";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavSideBar from "./NavSideBar";
import Header from "./Header";


export default function LayoutWrap({ children, params ,dictionary}) {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmall, setIsSmall] = useState(false);


  // console.log(isSmall);
  useLayoutEffect(() => {
    if (window) {
      setIsCollapsed(window.innerWidth < 640);
      setIsSmall(window.innerWidth < 640);
    }
  }, []);

  return (
    <SessionProvider>
      <ToastContainer />
      <Provider store={store}>
        <div className="flex h-screen relative">
          <NavSideBar
            params={params}
            setIsCollapsed={setIsCollapsed}
            isCollapsed={isCollapsed}
            isSmall={isSmall}

            dictionary={dictionary.navItems}

          />

          {/* Main Content */}
          <div className="flex-1 relative overflow-hidden ">
            {/* Header */}
            <Header lang={params.lang} dictionary={dictionary} setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

            {/* Dashboard Content */}
            <div className="h-full  dark:bg-gray-950/95 mainContainer overflow-x-auto flex justify-center items-start w-full relative">
              {children}
            </div>
          </div>
        </div>
      </Provider>
    </SessionProvider>
  );
}
