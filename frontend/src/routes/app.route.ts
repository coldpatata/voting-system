import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../layout/page.layout";
import LoginPage from "../modules/authentication/login.page";
import DashboardPage from "../modules/admin/dashboard/dashboard.page";
import AdminLayout from "../layout/admin.layout";
import CandidatePage from "../modules/admin/candidates/candidate.page";
import PositionPage from "../modules/admin/position/position.page";
import ErrorPage from "../modules/error/error.page";
import BallotPage from "../modules/student/ballots/ballots.page";
import ForgotPassword from "../modules/authentication/forgot-password.page";
import ResetPassword from "../modules/authentication/reset-password.page";
import DashboardPageStudent from "../modules/student/dashboard/dashboard.page";
import feedbacks from "../modules/student/feedbacks/feedbacks";
import AccountPage from "../modules/student/accounts/accounts.page";
import StudentLayout from "../layout/student.layout";
import Feedbacks from "../modules/student/feedbacks/feedbacks";
import DashboardPageStaff from "../modules/staff/dashboard/staff.dashboard";
import StaffLayout from "../layout/staff.layout";
import StaffAnouncements from "../modules/staff/announcements/staff.announcements";
export const router = createBrowserRouter([
    {
      path: '',
      Component: PageLayout,
      children: [
        {
          index: true,
          Component: LoginPage
        },
        {
          path: '/forgot-password',
          Component: ForgotPassword

        },
        {
          path: '/reset-password',
          Component: ResetPassword
        }
      ]
    },
    {
      path: '/dashboard',
      Component: AdminLayout,
      children: [
        {
          index: true,
          Component: DashboardPage,
         
        },
        {
            path: 'candidate',
            Component: CandidatePage
        },
        {
            path: 'position',
            Component: PositionPage
        },
        {
            path: 'ballot',
            Component: BallotPage
        }
      ]
    },

    {
      path: '/student',
      Component:StudentLayout,
      children:[
    
      {
        index: true,
        Component: DashboardPageStudent

    },

    {
      path: 'ballot',
      Component: BallotPage
  },

  {
    path: 'accounts',
    Component: AccountPage
},


  {
    path: 'feedbacks',
    Component: Feedbacks
},

    ]
    },

    {
      path: '/staff',
      Component:StaffLayout,
      children:[

        {
          index: true,
          Component: DashboardPageStaff
  
      },

      {
        path: 'announcement',
        Component: StaffAnouncements
    },

      ]

    },

    
    {
      path: "*",
      Component:ErrorPage
    }



  ]);
  
  export default router;