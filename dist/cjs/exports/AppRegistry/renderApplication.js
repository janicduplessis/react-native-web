"use strict";

exports.__esModule = true;
exports.default = renderApplication;
exports.getApplication = getApplication;

var _AppContainer = _interopRequireDefault(require("./AppContainer"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _styleResolver = _interopRequireDefault(require("../StyleSheet/styleResolver"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var roots = new Map();

function renderApplication(RootComponent, WrapperComponent, options) {
  var shouldHydrate = options.hydrate,
      initialProps = options.initialProps,
      rootTag = options.rootTag;
  (0, _invariant.default)(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  var rootElement = /*#__PURE__*/_react.default.createElement(_AppContainer.default, {
    WrapperComponent: WrapperComponent,
    rootTag: rootTag
  }, /*#__PURE__*/_react.default.createElement(RootComponent, initialProps));

  var root = roots.get(rootTag);

  if (root == null) {
    if (shouldHydrate) {
      root = _reactDom.default.hydrateRoot(rootTag, rootElement);
    } else {
      root = _reactDom.default.createRoot(rootTag);
      root.render(rootElement);
    }

    roots.set(rootTag, root);
  } else {
    root.render(rootElement);
  }
}

function getApplication(RootComponent, initialProps, WrapperComponent) {
  var element = /*#__PURE__*/_react.default.createElement(_AppContainer.default, {
    WrapperComponent: WrapperComponent,
    rootTag: {}
  }, /*#__PURE__*/_react.default.createElement(RootComponent, initialProps)); // Don't escape CSS text


  var getStyleElement = function getStyleElement(props) {
    var sheet = _styleResolver.default.getStyleSheet();

    return /*#__PURE__*/_react.default.createElement("style", _extends({}, props, {
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