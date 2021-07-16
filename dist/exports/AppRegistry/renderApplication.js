function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import AppContainer from './AppContainer';
import invariant from 'fbjs/lib/invariant';
import styleResolver from '../StyleSheet/styleResolver';
import React from 'react';
import ReactDOM from 'react-dom';
var roots = new Map();
export default function renderApplication(RootComponent, WrapperComponent, options) {
  var shouldHydrate = options.hydrate,
      initialProps = options.initialProps,
      rootTag = options.rootTag;
  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);
  var rootElement = /*#__PURE__*/React.createElement(AppContainer, {
    WrapperComponent: WrapperComponent,
    rootTag: rootTag
  }, /*#__PURE__*/React.createElement(RootComponent, initialProps));
  var root = roots.get(rootTag);

  if (root == null) {
    if (shouldHydrate) {
      root = ReactDOM.hydrateRoot(rootTag, rootElement);
    } else {
      root = ReactDOM.createRoot(rootTag);
      root.render(rootElement);
    }

    roots.set(rootTag, root);
  } else {
    root.render(rootElement);
  }
}
export function getApplication(RootComponent, initialProps, WrapperComponent) {
  var element = /*#__PURE__*/React.createElement(AppContainer, {
    WrapperComponent: WrapperComponent,
    rootTag: {}
  }, /*#__PURE__*/React.createElement(RootComponent, initialProps)); // Don't escape CSS text

  var getStyleElement = function getStyleElement(props) {
    var sheet = styleResolver.getStyleSheet();
    return /*#__PURE__*/React.createElement("style", _extends({}, props, {
      dangerouslySetInnerHTML: {
        __html: sheet.textContent
      },
      id: sheet.id
    }));
  };

  return {
    element: element,
    getStyleElement: getStyleElement
  };
}