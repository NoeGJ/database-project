import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './routes/App';
import AddUser from './routes/add_user';
import EditUser from './routes/edit_user';
import ErrorPage from './routes/error-page';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "new",
    element: <AddUser/>,
  },
  {
    path: "edit/:codigoId",
    element: <EditUser/>,
  },

])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
