export function windowSize(data) {
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
}
