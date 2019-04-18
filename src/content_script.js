let data = {};

chrome.storage.sync.get(['currentComputerData'], result => {
    if ('currentComputerData' in result) {
        data = result.currentComputerData;
        console.log('currentComputerData', data);
        appendScript();
    }
});

chrome.storage.onChanged.addListener(changes => {
    if ('currentComputerData' in changes) {
        data = changes.currentComputerData.newValue;
        console.log('computerData is changed', data);
    }
});



function appendScript() {
    const initialization = '' + init;
    const scriptData = '(' + initialization + ')(' + JSON.stringify(data) + ')';
    const script = document.createElement('script');
    script.innerHTML = scriptData;
    document.head.insertBefore(script, document.head.firstChild);
    script.remove();
}

const init = function (data) {
    'use strict';

    const defaultData = {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
    };
    const modifiedNavigator = Navigator.prototype;

    // Navigator
    Object.defineProperties(modifiedNavigator, {
        userAgent: {
            value: data.navigator.userAgent
        },
        vendor: {
          value: data.navigator.vendor
        },
        appVersion: {
            value: data.navigator.appVersion
        },
        platform: {
            value: data.navigator.platform
        },
        hardwareConcurrency: {
            value: data.navigator.hardwareConcurrency
        },
        deviceMemory: {
            value: data.navigator.deviceMemory
        },
        language: { value: data.navigator.language },
        languages: { value: data.navigator.languages },
    });


    // Screen and window size
    Object.defineProperties(screen, {
        width: {value: data.screen.width},
        height: {value: data.screen.height},
        availTop: {value: data.screen.availTop},
        availLeft: {value: data.screen.availLeft},
        availWidth: {value: data.screen.availWidth},
        availHeight: {value: data.screen.availHeight},
    });
    Object.defineProperties(window, {
        innerHeight: {value: data.window.innerHeight},
        innerWidth: {value: data.window.innerWidth},
        outerHeight: {value: data.window.outerHeight},
        outerWidth: {value: data.window.outerWidth},
        screenTop: {value: data.window.screenTop},
        screenLeft: {value: data.window.screenLeft},
    });
    Object.defineProperties(visualViewport, {
        height: {value: data.window.innerHeight},
        width: {value: data.window.innerWidth}
    });
    // Css properties
    const getComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function () {
        let result = getComputedStyle.call(this, ...arguments);
        Object.defineProperties(result, {
            height: {
                get() {return data.window.innerHeight + 'px'}
            },
            width: {
                get() {return data.window.innerWidth + 'px'}
            },
            webkitLogicalHeight: {
                get() {return data.window.innerHeight + 'px'}
            },
            webkitLogicalWidth: {
                get() {return data.window.innerWidth + 'px'}
            }
        });
        return result;
    };
    const getPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
    CSSStyleDeclaration.prototype.getPropertyValue = function (prop) {
        let result = getPropertyValue.call(this, prop);
        if (prop === 'height' && defaultData.height === result) {
            return data.window.innerHeight
        } else if (prop === 'width' && defaultData.width === result) {
            return data.window.innerWidth
        }
        return getPropertyValue.call(this, prop);
    };
    Object.defineProperties(HTMLElement.prototype, {
        // offsetHeight: {
        //     value: data.window.innerHeight
        // },
        // offsetWidth: {
        //     value: data.window.innerWidth
        // },
        clientHeight: {
            value: data.window.innerHeight
        },
        clientWidth: {
            value: data.window.innerWidth
        }
    });


    // Disable webrtc
    webkitRTCPeerConnection = RTCPeerConnection = undefined;


    // Change webGL
    const getParameterWebGL = WebGLRenderingContext.prototype.getParameter;
    const getParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
            return data.webgl.unmasked_vendor;
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
            return data.webgl.unmasked_renderer;
        }

        return getParameterWebGL.call(this, parameter);
    };
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
            return data.webgl.unmasked_vendor;
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
            return data.webgl.unmasked_renderer;
        }

        return getParameterWebGL2.call(this, parameter);
    };

    const bufferDataWebGL = WebGLRenderingContext.prototype.bufferData;
    const bufferDataWebGL2 = WebGL2RenderingContext.prototype.bufferData;
    WebGLRenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webgl.salt));
        return bufferDataWebGL.call(this, ...arguments);
    };
    WebGL2RenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webgl.salt));
        return bufferDataWebGL2.call(this, ...arguments);
    };


    // Canvas
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
        let dataUrl = toDataURL.call(this, ...arguments);
        return dataUrl + data.canvas.salt;
    };


    // Timezone
    // const resolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    const resolvedOptionsResult = Intl.DateTimeFormat().resolvedOptions();
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const resolvedOptionsData = {
            locale: data.timezone.locale,
            timeZone: data.timezone.timezone
        };
        return Object.assign(resolvedOptionsResult, resolvedOptionsData);
    };


    const timezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function () {
        return Number(data.timezone.timezoneOffset);
    };
    let date = new Date().toString();
    Date.prototype.toString = function () {
        const gmt = ("0"+-~((Number(data.timezone.timezoneOffset) / 60 * -1) - 1)).substr(-2,2);
        date = date.substring(0, date.indexOf('GMT')) + "GMT" + (Number(gmt) > 0 ? '+' + gmt: gmt) + '00';
        return date
    };

    // IF IS FIREFOX
    if (data.browser === 'mozilla') {
        window.InstallTrigger = {
            install: function (InstallXPI) {
                console.log('i am firefox', InstallXPI)
            }
        };
    }
}
