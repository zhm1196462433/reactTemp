import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Icon, Spin } from 'antd';
import { isString, omit } from 'lodash';
import pathToRegexp from 'path-to-regexp';

import SideMenu from '@/components/SideMenu';
import UserNav from '@/components/UserNav';
import Authorization from '@/components/Authorization';
import Forbidden from '@/components/Exception/Forbidden';
import { actions as userActions } from '@/store/user';
import { actions as menuActions } from '@/store/menu';

import logo from '@/assets/img/logo.svg';
import styles from './NormalLayout.css';
import useActions from '@/shared/hooks/actions';

function getFlatMenuKeys(menuData, keys = []) {
  for (let i = 0, item; item = menuData[i++];) {
    keys.push(item.path);

    if (Array.isArray(item.children)) {
      getFlatMenuKeys(item.children, keys);
    }
  }

  return keys;
}

function getCurrentRoute(routes, pathname, matched = {}) {
  for (let i = 0, route; route = routes[i++];) {
    if (isString(route.path) && pathToRegexp(route.path).test(pathname)) {
      matched.current = omit(route, 'routes');
      break;
    }

    if (Array.isArray(route.routes)) {
      getCurrentRoute(route.routes, pathname, matched);
    }
  }

  return matched.current;
}

function getCollapsedStyles(collapsed) {
  const value = collapsed ? 80 : 250;

  return {
    width: value,
    minWidth: value,
    maxWidth: value
  };
}

const structuredSelector = createStructuredSelector({
  profile: ({ user }) => user.profile,
  collapsed: ({ menu }) => menu.collapsed,
  permissions: ({ user }) => user.permissions,
  menuData: ({ menu }) => menu.data
});

export default function NormalLayout(props) {
  const { children, location: { pathname }, route: { routes } } = props;
  const [permissionLoading, setPermissionLoading] = useState(true);
  const {
    profile, collapsed, permissions, menuData
  } = useSelector(structuredSelector);
  const collapsedStyles = getCollapsedStyles(collapsed);
  const currentRoute = useMemo(() => getCurrentRoute(routes, pathname), [routes, pathname]);
  const flatMenuKeys = useMemo(() => getFlatMenuKeys(menuData), [menuData]);
  const actions = {
    user: useActions(userActions),
    menu: useActions(menuActions)
  };

  useEffect(() => {
    actions.user.fetchProfile();
    actions.user.fetchPermissions().finally(() => {
      setPermissionLoading(false);
    });
  }, [actions.user]);

  useEffect(() => {
    actions.menu.createMenuData({ routes, permissions });
  }, [routes, permissions, actions.menu]);

  const handleCollapse = () => {
    actions.menu.collapse(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      actions.user.logout();
    }
  };

  const authenticator = () => (
    currentRoute
    && currentRoute.meta.key != null
    && permissions[currentRoute.meta.key]
  );

  let content = null;

  if (permissionLoading) {
    content = (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin size="large" />
      </div>
    );
  } else if (pathname === '/') {
    content = children;
  } else {
    content = (
      <Authorization authenticator={authenticator} exception={<Forbidden />}>
        {children}
      </Authorization>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar} style={collapsedStyles}>
        <SideMenu
          logo={logo}
          data={menuData}
          collapsed={collapsed}
          flatMenuKeys={flatMenuKeys}
          pathname={pathname}
        />
      </div>
      <div className={styles.content} style={{ marginLeft: collapsedStyles.width }}>
        <header className={styles.header}>
          <button className={styles.foldBtn} type="button" onClick={handleCollapse}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </button>
          <UserNav profile={profile} onMenuClick={handleMenuClick} />
        </header>
        {content}
      </div>
    </div>
  );
}
