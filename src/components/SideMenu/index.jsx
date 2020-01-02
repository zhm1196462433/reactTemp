import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isString } from 'lodash';
import { isValidElementType } from 'react-is';
import { Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';

import styles from './index.css';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;

function getIcon(icon) {
  if (isString(icon)) {
    return <Icon type={icon} />;
  }

  if (isValidElementType(icon)) {
    return <Icon component={icon} />;
  }

  return icon;
}

function matchesInMenu(flatMenuKeys, pathname) {
  return flatMenuKeys.filter((item) => {
    if (isString(item)) {
      return pathToRegexp(item).test(pathname);
    }

    return false;
  });
}

function getSelectedMenuKeys(flatMenuKeys, pathname) {
  const pathnames = pathname.split('/').filter(v => v);

  return pathnames
    .map((_, index) => `/${pathnames.slice(0, index + 1).join('/')}`)
    .filter(item => matchesInMenu(flatMenuKeys, item));
}

function getTopLevelMenu(menu, key) {
  return menu.find(item => item.path === key || item.meta.key === key);
}

function renderMenuItems(data) {
  return data.map((item) => {
    if (Array.isArray(item.children)) {
      return (
        <SubMenu
          key={item.path}
          title={(
            <div>
              {getIcon(item.meta.icon)}
              <span>{item.name}</span>
            </div>
          )}
        >
          {renderMenuItems(item.children)}
        </SubMenu>
      );
    }

    return (
      <MenuItem key={item.path}>
        <Link to={item.path}>
          {getIcon(item.meta.icon)}
          <span>{item.name}</span>
        </Link>
      </MenuItem>
    );
  });
}

function SideMenu({
  logo = '',
  collapsed = false,
  pathname = '',
  flatMenuKeys = [],
  data: menuData = []
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const menuProps = openKeys && collapsed ? {} : { openKeys };
  const title = process.env.TITLE;

  useEffect(() => {
    const selectedMenuKeys = getSelectedMenuKeys(flatMenuKeys, pathname);
    setSelectedKeys(selectedMenuKeys);
    setOpenKeys(selectedMenuKeys);
  }, [pathname, flatMenuKeys]);

  const handleOpenChange = (keys) => {
    const topLevelMenu = keys.filter(key => getTopLevelMenu(menuData, key));
    setOpenKeys(topLevelMenu.length > 1 ? [keys.pop()] : [...keys]);
  };

  return (
    <div className={styles.sideMenu}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" />
        {!collapsed && <h1>{title}</h1>}
      </div>
      <div className={styles.menu}>
        <Menu
          selectedKeys={selectedKeys}
          onOpenChange={handleOpenChange}
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          style={{ padding: '16px 0' }}
          {...menuProps}
        >
          {renderMenuItems(menuData)}
        </Menu>
      </div>
    </div>
  );
}

SideMenu.propTypes = {
  collapsed: PropTypes.bool,
  logo: PropTypes.string,
  data: PropTypes.array,
  flatMenuKeys: PropTypes.array,
  pathname: PropTypes.string
};

export default React.memo(SideMenu);
