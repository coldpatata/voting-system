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

import AccountPage from "../modules/student/accounts/accounts.page";
import StudentLayout from "../layout/student.layout";
import Feedbacks from "../modules/student/feedbacks/feedbacks";
import DashboardPageStaff from "../modules/staff/dashboard/staff.dashboard";
import StaffLayout from "../layout/staff.layout";
import StaffAnouncements from "../modules/staff/announcements/staff.announcements";
import ProfilePage from "../modules/admin/profile/profile";
import AnnouncementPage from "../modules/admin/announcements/announcement";
import BallotReportPage from "../modules/admin/ballot-report/ballot-report.page";
import FeedbacksPage from "../modules/admin/feedbacks/feedbacks.page";
import StudentPage from "../modules/admin/students/students.page";
import StaffPage from "../modules/admin/staff/staff.page";
import AccountsPage from "../modules/admin/accounts/accounts.page";
import StaffCandidatePage from "../modules/staff/candidates/staff.candidates";
import StaffPositionPage from "../modules/staff/position/staff.position";
import StaffBallotReportPage from "../modules/staff/ballot-report/staff.ballot-report";
import StaffBallotPage from "../modules/staff/ballot/staff.ballot";
import BallotPageAdmin from "../modules/admin/ballot/ballot.page";
import UserLayout from "../layout/Profile Layout/user.layout";
import PasswordLayout from "../layout/Profile Layout/password.layout";
import staffStudentPage from "../modules/staff/student/staff.studentPage";
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
      path: '/admin',
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
            Component: BallotPageAdmin
        },
        {
          path: 'ballot-report',
          Component: BallotReportPage
        },
        {
          path: 'student-page',
          Component: StudentPage
        },
        {
          path: 'staff-page',
          Component: StaffPage
        },
        {
          path: 'accounts-page',
          Component: AccountsPage
        },
        {
          path:'feedbacks',
          Component: FeedbacksPage
        },
        {
            path: 'announcement',
            Component: AnnouncementPage
        },
        {
          path: '/admin/profile',
          Component: ProfilePage,
          children:[
            {
              index:true,
              path: 'user',
              Component: UserLayout
            },
            {  path: 'password',
            Component:  PasswordLayout
           }
          
          ]
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
  {
    path: '/student/profile',
    Component: ProfilePage,
    children:[
      {
        index:true,
        path: 'user',
        Component: UserLayout
      },
      {  path: 'password',
      Component:  PasswordLayout
     }
    
    ]
  }

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
          path: 'candidates',
          Component: StaffCandidatePage
      },

      {
        path: 'position',
        Component: StaffPositionPage
      },
      {
        path: 'ballot',
        Component: StaffBallotPage
      },
      {
        path: 'students',
        Component: staffStudentPage
      },
      {   
        path: 'announcements',
        Component: StaffAnouncements
      },
      {
        path: 'ballot-report',
        Component: StaffBallotReportPage
      },
      {
        path: '/staff/profile',
        Component: ProfilePage,
        children:[
          {
            index:true,
            path: 'user',
            Component: UserLayout
          },
          {  path: 'password',
          Component:  PasswordLayout
         }
        
        ]
      }

      ]

    },

  

    
    {
      path: "*",
      Component:ErrorPage
    }



  ]);
  
  export default router;