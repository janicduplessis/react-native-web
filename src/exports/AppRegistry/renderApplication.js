/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ComponentType, Node } from 'react';

import AppContainer from './AppContainer';
import invariant from 'fbjs/lib/invariant';
import styleResolver from '../StyleSheet/styleResolver';
import React from 'react';
import ReactDOM from 'react-dom';

const roots = new Map();

export default function renderApplication<Props: Object>(
  RootComponent: ComponentType<Props>,
  WrapperComponent?: ?ComponentType<*>,
  options: {
    hydrate: boolean,
    initialProps: Props,
    rootTag: any
  }
) {
  const { hydrate: shouldHydrate, initialProps, rootTag } = options;

  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  const rootElement = (
    <AppContainer WrapperComponent={WrapperComponent} rootTag={rootTag}>
      <RootComponent {...initialProps} />
    </AppContainer>
  );
  let root = roots.get(rootTag);
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

export function getApplication(
  RootComponent: ComponentType<Object>,
  initialProps: Object,
  WrapperComponent?: ?ComponentType<*>
): {| element: Node, getStyleElement: (Object) => Node |} {
  const element = (
    <AppContainer WrapperComponent={WrapperComponent} rootTag={{}}>
      <RootComponent {...initialProps} />
    </AppContainer>
  );
  // Don't escape CSS text
  const getStyleElement = (props) => {
    const sheet = styleResolver.getStyleSheet();
    return (
      <style {...props} dangerouslySetInnerHTML={{ __html: sheet.textContent }} id={sheet.id} />
    );
  };
  return { element, getStyleElement };
}
