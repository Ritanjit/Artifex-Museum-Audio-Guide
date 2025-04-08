// src/pages/admin.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/dashboard/sidebar";
import CollectionsUpload from "../../components/dashboard/upload";

const AdminPage = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <Routes>
          <Route path="/admin/upload" element={<CollectionsUpload />} />
          {/* <Route path="/admin/feedback" element={<Feedback />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/audio" element={<Audio />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
