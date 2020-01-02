import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import nprogress from 'nprogress';

import 'nprogress/nprogress.css';

/* eslint-disable react/require-default-props, react/no-unused-prop-types */

/**
 * In addition to the `template`， other configurations are the same as the `nprogress.configure`
 * see also https://github.com/rstacruz/nprogress/#configuration
 */
function NProgress({
  color = '#29d',
  ...props
}) {
  useEffect(() => {
    nprogress.configure({
      ...props,
      template: `
        <div class="bar" role="bar" style="background: ${color}">
          <div class="peg" style="box-shadow: 0 0 10px ${color}, 0 0 5px ${color}"></div>
        </div>
        <div class="spinner" role="spinner">
          <div class="spinner-icon" style="border-color: ${color}"></div>
        </div>
      `
    });
  }, [color, props]);

  useEffect(() => {
    nprogress.start();
    return () => nprogress.done(true);
  }, []);

  return null;
}

NProgress.propTypes = {
  color: PropTypes.string,
  minimum: PropTypes.number,
  easing: PropTypes.string,
  speed: PropTypes.number,
  trickle: PropTypes.bool,
  trickleSpeed: PropTypes.number,
  showSpinner: PropTypes.bool,
  parent: PropTypes.string
};

export default React.memo(NProgress);
