import { data } from './helpers/mock';

function appendScript() {
    const scriptString = `(${init.toString()})(${JSON.stringify(data)})`;
    const script = document.createElement('script');
    script.innerHTML = scriptString;
    setTimeout(() => {
        document.head.insertBefore(script, document.head.firstChild);
        script.remove();
    }, 0)
}

const init = function (data) {

    console.log(data);

    const defaultData = {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
    };
    const modifiedNavigator = Navigator.prototype;

    // Navigator
    Object.defineProperties(modifiedNavigator, {
        userAgent: {
            value: data.userAgent
        },
        vendor: {
          value: data.browserName === 'chrome' ? 'Google Inc.' : '' // empty string for firefox
        },
        appVersion: {
            value: data.userAgent.replace('Mozilla/', '')
        },
        platform: {
            value: data.platform
        },
        hardwareConcurrency: {
            value: data.hardwareConcurrency
        },
        deviceMemory: {
            value: data.deviceMemory
        },
        language: { value: data.language },
        languages: { value: data.languages },
        doNotTrack: { value: data.doNotTrack },
    });


    // Screen and window size
    Object.defineProperties(screen, {
        width: {value: data.screen.width},
        height: {value: data.screen.height},
        availTop: {value: 0},
        availLeft: {value: 0},
        availWidth: {value: data.screen.width},
        availHeight: {value: data.screen.height},
    });
    Object.defineProperties(window, {
        innerHeight: {value: data.screen.height},
        innerWidth: {value: data.screen.width},
        outerHeight: {value: data.screen.height},
        outerWidth: {value: data.screen.width},
        screenTop: {value: 0},
        screenLeft: {value: 0},
    });
    Object.defineProperties(visualViewport, {
        height: {value: data.screen.height},
        width: {value: data.screen.width}
    });
    // Css properties
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
        if (prop === 'height' && defaultData.height === result) {
            return data.screen.height
        } else if (prop === 'width' && defaultData.width === result) {
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


    // Disable webrtc
    webkitRTCPeerConnection = RTCPeerConnection = undefined;


    // Change webGL
    const getParameterWebGL = WebGLRenderingContext.prototype.getParameter;
    const getParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
            return data.webGL.unmaskedVendor;
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
            return data.webGL.unmaskedRenderer;
        }
        // VENDOR
        if (parameter === 7936) {
            return data.browserName === 'chrome' ? 'WebKit' : 'Mozilla';
        }
        // RENDERER
        if (parameter === 7937) {
            return data.browserName === 'chrome' ? 'WebKit WebGL' : 'Mozilla';
        }


        return getParameterWebGL.call(this, parameter);
    };
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
            return data.webGL.unmaskedVendor;
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
            return data.webGL.unmaskedRenderer;
        }
        // VENDOR
        if (parameter === 7936) {
            return data.browserName === 'chrome' ? 'WebKit' : 'Mozilla';
        }
        // RENDERER
        if (parameter === 7937) {
            return data.browserName === 'chrome' ? 'WebKit WebGL' : 'Mozilla';
        }

        return getParameterWebGL2.call(this, parameter);
    };

    const bufferDataWebGL = WebGLRenderingContext.prototype.bufferData;
    const bufferDataWebGL2 = WebGL2RenderingContext.prototype.bufferData;
    WebGLRenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webGL.salt));
        return bufferDataWebGL.call(this, ...arguments);
    };
    WebGL2RenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webGL.salt));
        return bufferDataWebGL2.call(this, ...arguments);
    };


    // Canvas
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
        let dataUrl = toDataURL.call(this, ...arguments);
        return dataUrl + data.canvas.salt;
    };


    //Timezone
    const resolvedOptionsResult = Intl.DateTimeFormat().resolvedOptions();
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const resolvedOptionsData = {
            timeZone: data.timezone.name,
            locale: data.language
        };
        return Object.assign(resolvedOptionsResult, resolvedOptionsData);
    };

    const timezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function () {
        return Number(data.timezone.utcOffset);
    };
    // Date.prototype.toString = function () {
    //     return data.timezone.date
    // };

    // IF IS FIREFOX
    if (data.browserName === 'firefox') {
        window.InstallTrigger = {
            install: function (InstallXPI) {
                console.log('i am firefox', InstallXPI)
            }
        };
    }
};


appendScript();
