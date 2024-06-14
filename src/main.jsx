import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import './index.css';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import InicioSesion from './pages/InicioSesion';
import Registro from './pages/Registro';
import Usuario from './pages/Usuario';
import SubirPublicacion from './pages/SubirPublicacion';
import Novedades from './pages/Novedades';
import Favoritos from './pages/Favoritos';
import MisPublicaciones from './pages/MisPublicaciones';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'novedades',
        element: <Novedades />,
      },
      {
        path: 'informacion',
        element: <div>Información</div>,
      },
      {
        path: 'usuario',
        element: <Usuario />,
      },
      {
        path: 'inicioSesion',
        element: <InicioSesion />
      },
      {
        path: 'registro',
        element: <Registro />,
      },
      {
        path: 'subirpublicacion',
        element: <SubirPublicacion />,
      },
      {
        path: 'favoritos',
        element: <Favoritos />,
      },
      {
        path: 'mispublicaciones',
        element: <MisPublicaciones />,
      },
    ]
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
