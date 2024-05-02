import { createBrowserRouter, useRouteError, Navigate, RouterProvider } from 'react-router-dom';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import SessionActivePage from './SessionActivePage';
import SessionParamsPage from './SessionParamsPage';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      <h1>Error</h1>
      <h2>Message</h2>
      <p>{error?.message}</p>
      <h2>Stack</h2>
      <pre><code>{error?.stack}</code></pre>
      <h2>toString()</h2>
      <pre><code>{error?.toString()}</code></pre>
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
      <Container maxWidth="sm" sx={{p:1}}>
        <RouterProvider router={router}/>
      </Container>
    </>
  );
}
export default App;
