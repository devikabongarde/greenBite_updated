import { UserProvider } from '@/UserContext.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';


import Loading from './components/Loading';
import About from './pages/About';
import Account from './pages/Account';
import Achievements from './pages/Achievements';
import AuthPage from './pages/AuthPage';
import Chatbot from './pages/Chatbot';
import Crowdfunding from './pages/Crowdfunding';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import Help from './pages/Help';
import HomePage from './pages/HomePage';
import ItemPage from './pages/ItemPage';
import Ngodonations from './pages/DonationPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import NGOPage from './pages/NGOPage';
import RoleSelection from './pages/RoleSelection';
import Admin from './pages/AdminDashboard';
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/role', element: <RoleSelection /> },
  { path: '/auth', element: <AuthPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    element: <Loading />, 
    children: [
      {
        children: [
          { path: 'items', element: <ItemPage /> },
          { path: 'help', element: <Help /> },
          { path: 'ngo', element: <NGOPage /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'achievements', element: <Achievements /> },
          { path: 'donations', element: <Ngodonations /> },
          { path: 'crowdfunding', element: <Crowdfunding /> },
          { path: 'chatbot', element: <Chatbot /> },
          { path: 'docs', element: <Documentation /> },
          { path: 'about', element: <About /> },
          { path: 'account', element: <Account /> },
          { path: 'admin', element: <Admin /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <HomePage />,  // Changed from NotFound to HomePage
  },
]);

function App() {
  return (
   

<UserProvider>
    <RouterProvider router={router} />
</UserProvider>

  );
}

export default App;
