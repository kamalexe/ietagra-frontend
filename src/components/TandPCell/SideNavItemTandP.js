// import React, { useState } from "react";

// const SideNavItemTandP = ({ sidebarData }) => {
//   const [activeItemIndex, setActiveItemIndex] = useState(0);

//   const handleItemClick = (index) => {
//     setActiveItemIndex(index);
//   };

//   return (
//     <div className="flex w-full">
//       {/* Sidebar */}
//       <div className="sticky top-20 h-[calc(100vh-5rem)] w-64 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg border border-gray-200 p-4">
//         <h2 className="text-lg font-bold text-gray-700 mb-6 px-2">Career Hub</h2>
//         <ul className="space-y-2">
//           {sidebarData.map((item, index) => (
//             <li
//               key={index}
//               className={`cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 
//                 ${activeItemIndex === index
//                   ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
//                   : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
//                 }`}
//               onClick={() => handleItemClick(index)}
//             >
//               <div className="flex-shrink-0">{item.icon}</div>
//               <span className="text-sm font-medium whitespace-nowrap">{item.title}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Content */}
//       <div className="flex-1 ml-6 rounded-2xl bg-white shadow-lg p-6 border border-gray-200">
//         {sidebarData[activeItemIndex] && sidebarData[activeItemIndex].component}
//       </div>
//     </div>
//   );
// };

// export default SideNavItemTandP;
