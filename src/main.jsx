import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Heroes from './pages/Heroes';
import Maps from './pages/Maps';
import PlayerPage from './components/PlayerPage'; 
import './index.css';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-md p-8 bg-gray-800/80 rounded-xl backdrop-blur-sm border border-gray-700/50 text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-xl text-gray-300 mb-6">Page not found</p>
                <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600/80 to-red-800/80 text-white rounded-lg hover:from-red-700/90 hover:to-red-900/90 transition-all">
                    Back to Home
                </a>
            </div>
        </div>
    );
};

const router = createBrowserRouter([
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
    {
        path: "/players/:playerId",
        element: <PlayerPage />
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
