import { FC } from 'react';
import Cookies from 'js-cookie';
import AdminSidebar from '../components/sidebar/adminSidebar';
import StudentSidebar from '../components/sidebar/studentSidebar';
import StaffSidebar from '../components/sidebar/staffSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: FC = () => {
 
  const userType = parseInt(Cookies.get('userType') || '0', 10);
 
  const renderSidebar = () => {
    switch (userType) {
      case 1:
      
        return <StudentSidebar />; 
      case 2:
    
        return <AdminSidebar />; 
      case 3:
       
        return <StaffSidebar />; 
      default:
        return <AdminSidebar />; 
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-64 min-h-screen">
        {renderSidebar()}
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
