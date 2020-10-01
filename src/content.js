import { data } from './helpers/mock';
import { windowSize } from './functions/window-size';
import { navigator } from './functions/navigator';
import { cssProperties } from "./functions/css-properties";
import { webrtc } from "./functions/webrtc";
import {webgl} from "./functions/webgl";
import {canvas} from "./functions/canvas";
import {timezone} from "./functions/timezone";

function appendScript() {
    const scriptString = `(${init.toString()})(${JSON.stringify(data)})`;
    const script = document.createElement('script');
    script.innerHTML = scriptString;
    document.head.insertBefore(script, document.head.firstChild);
    setTimeout(() => {
        script.remove();
    }, 0)
}

const init = function (data) {
    console.log(data);
    // Navigator
    navigator(data);
    // Screen and window size
    windowSize(data);
    // Css properties
    cssProperties(data);
    // Disable webrtc
    webrtc(data);
    // Change webGL
    webgl(data);
    // Canvas
    canvas(data);
    //Timezone
    timezone(data)

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
