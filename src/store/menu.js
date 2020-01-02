import produce from 'immer';
import { handleActions, createActionTypes, createAction } from '@/shared/redux-helpers';
import { omit } from 'lodash';
import memoizeOne from 'memoize-one';

function formatter(routes, permissions, menuList = []) {
  if (!Array.isArray(routes) || routes.length === 0) return menuList;

  for (let i = 0, route; route = routes[i++];) {
    if (
      route.meta == null // 未包含meta信息
      || route.meta.key == null // 未包含key
      || route.meta.hideInMenu
      || permissions[route.meta.key] == null // 未拥有该菜单权限
    ) {
      continue;
    }

    const menuItem = {
      ...omit(route, 'routes'),
      name: permissions[route.meta.key].name
    };

    // 子菜单
    if (
      Array.isArray(route.routes)
      && route.routes.length > 0
      && !route.meta.hideChildrenInMenu
    ) {
      menuItem.children = [];
      formatter(route.routes, permissions, menuItem.children);
    }

    menuList.push(menuItem);
  }

  return menuList;
}

const memoizeOneFormatter = memoizeOne(formatter);

export const actionTypes = createActionTypes([
  'CHANGE_COLLAPSED',
  'CREATE_MENU_DATA'
], 'GLOBAL');

export const actions = {
  collapse: createAction(actionTypes.CHANGE_COLLAPSED),
  createMenuData: createAction(actionTypes.CREATE_MENU_DATA)
};

export const reducer = handleActions({
  [actionTypes.CHANGE_COLLAPSED]: produce((draft, { payload }) => {
    draft.collapse = payload;
  }),
  [actionTypes.CREATE_MENU_DATA]: produce((draft, { payload }) => {
    const { routes, permissions } = payload;
    draft.data = memoizeOneFormatter(routes, permissions);
  })
}, {
  collapsed: false,
  data: []
});
