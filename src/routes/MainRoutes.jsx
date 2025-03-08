import { lazy } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router";

// project import
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

import { SimpleLayoutType } from 'config';
import { loader as productsLoader, productLoader } from 'api/products';



// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardAnalytics = Loadable(lazy(() => import('pages/dashboard/analytics')));
const Home = Loadable(lazy(() => import('pages/dashboard/Home')));
const ERXList = Loadable(lazy(() => import('pages/dashboard/ErxList')));
const ERXview = Loadable(lazy(() => import('pages/dashboard/ERXview')));
const Pdf = Loadable(lazy(() => import('pages/dashboard/Pdf')));
// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/Login/Login')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

// render - sample page
const Callback  = Loadable(lazy(() => import('pages/auth/Callback')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // Redirect root to login page
    // {
    //   path: '/',
    //   element: <Navigate to="/login" />
    // },
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },
            {
              path: 'Home',
              element: <Home />
            },
            {
              path: 'Pdf/:id',
              element: <Pdf/>
            },
            {
              path: 'ERXview',
              element: <ERXview />
            },
            {
              path: 'ErxList',
              element: <ERXList />
            },
            {
              path: 'analytics',
              element: <DashboardAnalytics />
            }
          ]
        },
    
      
       
      ]
    },
    {
      path: 'login/oauth2/code/react-ui-client-7050-oidc',
      element: <Callback />
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },

    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    }
  ]
};

export default MainRoutes;
