import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Heroes from './pages/Heroes';
import Maps from './pages/Maps';
import './index.css';

const router = createBrowserRouter ([
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />,
    },
    {
        path: "/heroes",
        element: <Heroes />,
        // errorElement: <ErrorPage />,
    },
    {
        path: "/maps",
        element: <Maps />,
        // errorElement: <ErrorPage />,
    },
])

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);