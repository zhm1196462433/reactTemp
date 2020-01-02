import React from 'react';
import loadable from '@loadable/component';
import NProgress from '@/components/NProgress';

const loadableOptions = {
  fallback: <NProgress />
};

export default function lazy(fn) {
  return loadable(fn, loadableOptions);
}
