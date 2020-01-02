import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

function normalizeComponent(target) {
  if (!React.isValidElement(target)) {
    return target;
  }

  return () => target;
}

function Promiser({
  promise,
  then: success,
  catch: failure
}) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    promise.then(() => {
      setComponent(() => normalizeComponent(success));
    }).catch(() => {
      setComponent(() => normalizeComponent(failure));
    });
  }, [promise, success, failure]);

  return Component ? (
    <Component />
  ) : (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Spin size="large" />
    </div>
  );
}

Promiser.propTypes = {
  promise: PropTypes.shape({
    then: PropTypes.func,
    catch: PropTypes.func
  }).isRequired,
  then: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  catch: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};

export default React.memo(Promiser);
