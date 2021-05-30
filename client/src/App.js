import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import './scss/style.scss';
import { CContainer, CFade } from '@coreui/react';
import { Suspense } from 'react'

// routes config
import routes from './routes'
import { useDispatch } from 'react-redux';
import { initUser } from './actions/auth';
import { getNumbers } from './actions/general';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {

  const dispatch = useDispatch();

  dispatch(initUser());
  dispatch(getNumbers());

  return (
    <BrowserRouter>
      <div className="c-app c-default-layout">
        <Sidebar />
        <div className="c-wrapper">
          <Header />
          <div className="c-body">
            <main className="c-main">
              <CContainer fluid>
                <Suspense fallback={loading}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component && (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <CFade>
                              <route.component {...props} />
                            </CFade>
                          )} />
                      )
                    })}
                    <Redirect from="/" to="/home" />
                  </Switch>
                </Suspense>
              </CContainer>
            </main>
          </div>
          {/* Footer */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
