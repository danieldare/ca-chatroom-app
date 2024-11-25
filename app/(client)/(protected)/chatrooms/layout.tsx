"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "../../store/useUserStore";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const initializeUser = useUserStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
