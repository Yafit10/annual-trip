import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Paths } from './paths.tsx';
import HomePage from '../project/Home.tsx';
import LoginPage from '../project/login.tsx';
import StudentLocationPage from '../project/StudentLocation.tsx';
import AdminPage from '../project/Admin.tsx';
import TeacherPage from '../project/Teacher.tsx';



const Routes = () => {
  const router = createBrowserRouter([
    {
      path: Paths.home,
      element: <HomePage />,

    },
    {
      path: Paths.login,
      element: <LoginPage />,
    },
    {
      path: Paths.studentLocation,
      element: <StudentLocationPage />,
    },
    {
      path: Paths.teacher,
      element: <TeacherPage />,
    },
    {
      path: Paths.admin,
      element: <AdminPage />,
    }
  ]);



  return <RouterProvider router={router} />;
};
export default Routes;