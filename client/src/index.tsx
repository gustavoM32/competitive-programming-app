import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Problems from 'pages/Problems';
import ProblemLists from 'pages/ProblemLists';
import ProblemList from 'pages/ProblemList';
import Page from 'components/Page';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page sidebarActiveItem="Home" title="Home"><Home/></Page>,
  },
  {
    path: "/problems",
    element: <Page sidebarActiveItem="Problems" title="Problems"><Problems/></Page>,
  },
  {
    path: "/problemLists",
    element: <Page sidebarActiveItem="Problem lists" title="Problem Lists"><ProblemLists/></Page>,
  },
  {
    path: "/problemLists/:problemListId",
    element: <Page sidebarActiveItem="Problem lists" title="Problem List"><ProblemList/></Page>,
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
