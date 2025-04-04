// import { useState } from 'react'
// import Navbar from '../../components/dashboard/dashNav'
// import Sidebar from '../../components/dashboard/sidebar'
// import Dashboard from '../../components/dashboard/dashboard'

// function Admin() {
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       {/* Content area */}
//       <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
//         {/* Navbar */}
//         <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
//         {/* Main content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Dashboard />
//         </main>
//       </div>
//     </div>
//   )
// }

// export default Admin;