import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ForgotPasswordPage from './pages/forgot.jsx';
import ResetPasswordPage from './pages/reset.jsx';
import AddProductPage from './pages/add-product.jsx';
import AddCategoryPage from './pages/add-category.jsx';
import Favorites from './pages/favorites.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import RecentViews from './pages/recentViews.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'add-product',
        element: <AddProductPage />,
      },
      {
        path: 'add-category',
        element: <AddCategoryPage />,
      },
      {
        path: 'favorite-products',
        element: <Favorites />,
      },
      {
        path: 'recent-products',
        element: <RecentViews />,
      },
      {
        path: 'products/:productId', // route chi tiết sản phẩm
        element: <ProductDetailPage />,
      },
    ],
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: 'reset-password',
    element: <ResetPasswordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
