import { FC } from 'react';
import Cookies from 'js-cookie';
import AdminSidebar from '../components/sidebar/adminSidebar';
import StudentSidebar from '../components/sidebar/studentSidebar';
import StaffSidebar from '../components/sidebar/staffSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: FC = () => {
  // Gikuha nako usertype sa cookies tapos gi parse nako into int para ma compare nako later on
  const userType = parseInt(Cookies.get('userType') || '0', 10);
  // Man ako gibuhat diri is nag switch case ko kay basahon
 //nako una unsa iyang usertype gikan sa cookies nya ayha nako sya i dipslay unsa na sidebar mugawas
  const renderSidebar = () => {
    switch (userType) {
      case 1:
        alert("userType: student")
        return <StudentSidebar />; // Admin sidebar
      case 2:
        alert("userType: admin")
        return <AdminSidebar />; // Student sidebar
      case 3:
        alert("userType: staff")
        return <StaffSidebar />;   // Staff sidebar
      default:
        return <AdminSidebar />;        // patak,an ra sa nako ang default diri for now
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
