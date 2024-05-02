import { createBrowserRouter, useRouteError, Navigate, RouterProvider } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';

import SessionActivePage from './SessionActivePage';
import SessionParamsPage from './SessionParamsPage';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      <h1>Error</h1>
      <pre><code>{error}</code></pre>
    </div>
  );
};

const router = createBrowserRouter([
  { path:'/',         element:<Navigate to="/settings" replace/>, errorElement:<ErrorPage/> },
  { path:'/settings', element:<SessionParamsPage/> },
  { path:'/active',   element:<SessionActivePage/> },
]);

function App() {
  return (
    <>
      <CssBaseline/>
      <RouterProvider router={router}/>
    </>
  );
}
export default App;
