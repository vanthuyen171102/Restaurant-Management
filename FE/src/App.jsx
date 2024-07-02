import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { routes } from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./redux/slices/authSlice";
import { AppProvider } from "./contexts/AppContext";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { updateTime } from "./redux/slices/timeSlice";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getSession());
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <AppProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            if (route.hasAnyRoles == null && !route.authenticate) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <>
                      <Helmet>
                        <title>{route.title}</title>
                      </Helmet>
                      <Layout>
                        <Page />
                      </Layout>
                    </>
                  }
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <>
                      <Helmet>
                        <title>{route.title}</title>
                      </Helmet>
                      <PrivateRoute hasAnyRoles={route.hasAnyRoles}>
                        <Layout>
                          <Page />
                        </Layout>
                      </PrivateRoute>
                    </>
                  }
                />
              );
            }
          })}
        </Routes>
      </Router>
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
