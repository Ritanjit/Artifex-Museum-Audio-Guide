import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/dashboard/sidebar";
import AdminTopbar from "../../components/dashboard/adminTopbar";
import Dashboard from "@/components/dashboard/dashboard";

const AdminPage = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-zinc-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default AdminPage;
