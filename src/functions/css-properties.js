export function cssProperties(data) {
    const defaultSize = {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px',
    };

    const getComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function () {
        let result = getComputedStyle.call(this, ...arguments);
        Object.defineProperties(result, {
            height: {
                get() {return data.screen.height + 'px'}
            },
            width: {
                get() {return data.screen.width + 'px'}
            },
            webkitLogicalHeight: {
                get() {return data.screen.height + 'px'}
            },
            webkitLogicalWidth: {
                get() {return data.screen.width + 'px'}
            }
        });
        return result;
    };
    const getPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
    CSSStyleDeclaration.prototype.getPropertyValue = function (prop) {
        let result = getPropertyValue.call(this, prop);
        if (prop === 'height' && defaultSize.height === result) {
            return data.screen.height
        } else if (prop === 'width' && defaultSize.width === result) {
            return data.screen.width
        }
        return getPropertyValue.call(this, prop);
    };
    Object.defineProperties(HTMLElement.prototype, {
        // offsetHeight: {
        //     value: data.screen.height
        // },
        // offsetWidth: {
        //     value: data.screen.width
        // },
        clientHeight: {
            value: data.screen.height
        },
        clientWidth: {
            value: data.screen.width
        }
    });
}
