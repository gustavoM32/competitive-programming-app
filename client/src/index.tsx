import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Problems from 'pages/problems';
import ProblemLists from 'pages/problemLists';
import ProblemList from 'pages/problemLists/[id]';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/problems",
    element: <Problems/>,
  },
  {
    path: "/problemLists",
    element: <ProblemLists/>,
  },
  {
    path: "/problemLists/:problemListId",
    element: <ProblemList/>,
  },
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
