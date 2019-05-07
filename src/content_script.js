let data = {};

chrome.storage.sync.get(['currentComputerData'], result => {
    console.log(result)
    if ('currentComputerData' in result) {
        data = result.currentComputerData;
        console.log('currentComputerData', data);
        appendScript();
    }
});

chrome.storage.onChanged.addListener(changes => {
    console.log(changes)
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

    console.log(data)

    const defaultData = {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
    };
    const modifiedNavigator = Navigator.prototype;

    // Navigator
    Object.defineProperties(modifiedNavigator, {
        userAgent: {
            value: data.useragent
        },
        vendor: {
          value: data.browser.name === 'chrome' ? 'Google Inc.' : '' // empty string for firefox
        },
        appVersion: {
            value: data.useragent.replace('Mozilla/', '')
        },
        platform: {
            value: 'Win32'
        },
        hardwareConcurrency: {
            value: data.hardwareConcurrency.value
        },
        deviceMemory: {
            value: data.memory.value
        },
        language: { value: data.language[0] },  // TODO: Add timezone lang
        languages: { value: data.languages.map(lang => lang.dialect) },  // TODO: Add timezone lang first
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
            return data.webgl.unmasked_vendor;
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
            return data.webgl.unmasked_renderer;
        }
        // VENDOR
        if (parameter === 7936) {
            return data.browser.name === 'chrome' ? 'WebKit' : 'Mozilla';
        }
        // RENDERER
        if (parameter === 7937) {
            return data.browser.name === 'chrome' ? 'WebKit WebGL' : 'Mozilla';
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
        // VENDOR
        if (parameter === 7936) {
            return data.browser.name === 'chrome' ? 'WebKit' : 'Mozilla';
        }
        // RENDERER
        if (parameter === 7937) {
            return data.browser.name === 'chrome' ? 'WebKit WebGL' : 'Mozilla';
        }

        return getParameterWebGL2.call(this, parameter);
    };

    const bufferDataWebGL = WebGLRenderingContext.prototype.bufferData;
    const bufferDataWebGL2 = WebGL2RenderingContext.prototype.bufferData;
    WebGLRenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webglSalt));
        return bufferDataWebGL.call(this, ...arguments);
    };
    WebGL2RenderingContext.prototype.bufferData = function () {
        arguments[1] = arguments[1].map(num => num + Number(data.webglSalt));
        return bufferDataWebGL2.call(this, ...arguments);
    };


    // Canvas
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
        let dataUrl = toDataURL.call(this, ...arguments);
        return dataUrl + data.canvas.salt;
    };


    // Timezone
    const resolvedOptionsResult = Intl.DateTimeFormat().resolvedOptions();
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const resolvedOptionsData = {
            locale: data.timezone.locale,
            timeZone: data.language
        };
        return Object.assign(resolvedOptionsResult, resolvedOptionsData);
    };


    const timezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function () {
        return Number(data.timezone.utcOffset);
    };
    let date = new Date().toString();
    Date.prototype.toString = function () {
        const gmt = ("0"+-~((Number(data.timezone.utcOffset) / 60 * -1) - 1)).substr(-2,2);
        date = date.substring(0, date.indexOf('GMT')) + "GMT" + (Number(gmt) > 0 ? '+' + gmt: gmt) + '00';
        return date
    };

    // IF IS FIREFOX
    if (data.browser.name === 'firefox') {
        window.InstallTrigger = {
            install: function (InstallXPI) {
                console.log('i am firefox', InstallXPI)
            }
        };
    }
};
