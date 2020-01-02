import React from 'react';
import lazy from '@/shared/lazy';
import { Redirect } from 'react-router-dom';

import NormalLayout from '@/containers/Layout/NormalLayout';
import Authorization from '@/components/Authorization';
import FormIcon from '@/assets/iconsvg/form.svg';

export default [
  {
    path: '/login',
    component: lazy(() => import('@/containers/Login')),
  },
  {
    path: '/',
    component: NormalLayout,
    meta: {
      Protector({ children, isLogin }) {
        return (
          <Authorization authenticator={isLogin} exception={<Redirect to="/login" />}>
            {children}
          </Authorization>
        );
      }
    },
    routes: [
      { path: '/', redirect: '/dashboard', exact: true },
      {
        path: '/dashboard',
        component: lazy(() => import('@/containers/Home')),
        meta: {
          icon: 'dashboard',
          key: '1'
        }
      },
      {
        path: '/list',
        meta: {
          icon: 'bars',
          key: '2',
        },
        routes: [
          {
            path: '/list/standard',
            component: lazy(() => import('@/containers/List')),
            meta: {
              key: '21',
              hideChildrenInMenu: true
            },
            routes: [
              {
                path: '/list/standard/:id',
                component: lazy(() => import('@/containers/List/Detail')),
                meta: {
                  key: '211'
                }
              }
            ]
          },
          {
            path: '/list/custom',
            component: lazy(() => import('@/containers/List')),
            meta: {
              key: '22'
            }
          }
        ]
      },
      {
        path: '/form',
        meta: {
          key: '3',
          icon: FormIcon
        },
        routes: [
          {
            path: '/form/standard',
            component: lazy(() => import('@/containers/Form')),
            meta: {
              key: '31'
            }
          }
        ]
      },
      {
        component: lazy(() => import('@/components/Exception/NotFound'))
      }
    ]
  }
];
