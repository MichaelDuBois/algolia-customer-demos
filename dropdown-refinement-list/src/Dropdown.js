/* global instantsearch */

import {
  hasClassName,
  addClassName,
  removeClassName,
  capitalize,
} from './util';

const CLASS_OPENED = 'ais-Dropdown--opened';

const cx = (...args) => args.filter(Boolean).join(' ');

export function createDropdown(
  baseWidget,
  {
    cssClasses: userCssClasses = {},
    buttonText,
    buttonClassName,
    closeOnChange,
  } = {}
) {
  const cssClasses = {
    root: cx('ais-Dropdown', userCssClasses.root),
    button: cx('ais-Dropdown-button', userCssClasses.button),
    buttonRefined: cx(
      'ais-Dropdown-button--refined',
      userCssClasses.buttonRefined
    ),
  };
  const makeWidget = instantsearch.widgets.panel({
    cssClasses,
    templates: {
      header: (options) => {
        const { widgetParams } = options;

        let text;
        if (typeof buttonText === 'string') {
          text = buttonText;
        } else if (typeof buttonText === 'function') {
          text = buttonText(options);
        } else {
          const attribute =
            widgetParams && widgetParams.attribute
              ? capitalize(widgetParams.attribute)
              : '';
          const nbRefinements = (options.items || []).filter(
            (item) => item.isRefined
          ).length;
          text =
            nbRefinements > 0 ? `${attribute} (${nbRefinements})` : attribute;
        }

        const classNames = [cssClasses.button];
        if (typeof buttonClassName === 'string') {
          classNames.push(buttonClassName);
        } else if (typeof buttonClassName === 'function') {
          classNames.push(buttonClassName(options));
        } else if ((options.items || []).find((item) => item.isRefined)) {
          classNames.push(cssClasses.buttonRefined);
        }

        return `
          <button type="button" class="${cx(...classNames)}">
            ${text}
          </button>
        `;
      },
    },
  })(baseWidget);

  return (widgetParams) => {
    const widget = makeWidget(widgetParams);
    let cleanUp;
    let state = {};
    return {
      ...widget,
      init: (options) => {
        const rootElem = document
          .querySelector(widgetParams.container)
          .querySelector('.ais-Panel');
        const header = rootElem.querySelector('.ais-Panel-header');
        const panelBodyElem = rootElem.querySelector('.ais-Panel-body');
        const open = () => {
          addClassName(rootElem, CLASS_OPENED);
          // This 'click' event is still being propagated,
          // so we add this event listener in the next tick.
          setTimeout(() => {
            state.windowClickListener = (event) => {
              if (!panelBodyElem.contains(event.target)) {
                close();
              }
            };
            window.addEventListener('click', state.windowClickListener);
          }, 0);
        };
        const close = () => {
          removeClassName(rootElem, CLASS_OPENED);
          window.removeEventListener('click', state.windowClickListener);
          delete state.windowClickListener;
        };
        const isOpened = () => hasClassName(rootElem, CLASS_OPENED);
        const toggle = () => {
          if (isOpened()) {
            close();
          } else {
            open();
          }
        };

        const buttonListener = (event) => {
          if (!event.target.matches('button')) {
            return;
          }
          toggle();
        };
        header.addEventListener('click', buttonListener);

        cleanUp = () => {
          header.removeEventListener('click', buttonListener);
          if (state.windowClickListener) {
            window.removeEventListener('click', state.windowClickListener);
          }
        };

        if (closeOnChange === true) {
          options.instantSearchInstance.use(() => ({
            subscribe() {},
            unsubscribe() {},
            onStateChange() {
              if (isOpened()) {
                close();
              }
            },
          }));
        }
        return widget.init.call(widget, options);
      },
      dispose: (options) => {
        if (typeof cleanUp === 'function') {
          cleanUp();
        }
        return widget.dispose.call(widget, options);
      },
    };
  };
}
