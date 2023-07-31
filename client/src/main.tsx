import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import AddSiteView from "./AddSiteView";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/add-site",
        element: <AddSiteView/>,
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
