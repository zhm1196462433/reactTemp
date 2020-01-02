import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Redirect, Route as ReactRoute } from 'react-router';
import rawRoutes from '@/routes';

import '@/styles/reset.css';
import '@/styles/base.css';

function withProtector(route, isLogin) {
  const { Protector } = route.meta;

  return ({ render, ...rest }) => (
    <ReactRoute
      {...rest}
      render={props => (
        <Protector {...props} isLogin={isLogin}>
          {render(props)}
        </Protector>
      )}
    />
  );
}

function renderRoutes(routes, isLogin = false) {
  if (!Array.isArray(routes)) return null;

  return (
    <Switch>
      {routes.map((route, index) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.key || index}
              from={route.path}
              to={route.redirect}
              exact={route.exact}
              strict={route.strict}
            />
          );
        }

        const Route = route.meta && route.meta.Protector ? withProtector(route, isLogin) : ReactRoute;
        return (
          <Route
            key={route.key || index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) => {
              const childRoutes = renderRoutes(route.routes);

              if (route.component) {
                return (
                  <route.component {...props} route={route}>{childRoutes}</route.component>
                );
              }

              return childRoutes;
            }}
          />
        );
      })}
    </Switch>
  );
}

export default function App() {
  const isLogin = useSelector(({ user }) => user.isLogin);

  return renderRoutes(rawRoutes, isLogin);
}
