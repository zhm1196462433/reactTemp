import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean, isFunction } from 'lodash';
import isPromise from 'is-promise';
import Promiser from '@/components/Promiser';

function Authorization({ children, authenticator, exception }) {
  const target = children || null;

  if (isBoolean(authenticator) && authenticator) {
    return target;
  }

  if (isPromise(authenticator)) {
    return <Promiser promise={authenticator} then={target} catch={exception} />;
  }

  if (isFunction(authenticator)) {
    const authenticated = authenticator();

    if (isPromise(authenticated)) {
      return <Promiser promise={authenticated} then={target} catch={exception} />;
    }

    if (authenticated) {
      return target;
    }
  }

  return exception;
}

Authorization.propTypes = {
  authenticator: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
    PropTypes.shape({
      then: PropTypes.func,
      catch: PropTypes.func
    })
  ]).isRequired,
  exception: PropTypes.element
};

export default React.memo(Authorization);
