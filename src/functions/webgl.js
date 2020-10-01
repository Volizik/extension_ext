export function webgl(data) {
    const getParameterWebGL = WebGLRenderingContext.prototype.getParameter;
    const getParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;
    const getParameterHandler = (webGLGetParameter) => (parameter) => {
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

        return webGLGetParameter.call(this, parameter);
    }
    WebGLRenderingContext.prototype.getParameter = getParameterHandler(getParameterWebGL);
    WebGL2RenderingContext.prototype.getParameter = getParameterHandler(getParameterWebGL2);

    const bufferDataWebGL = WebGLRenderingContext.prototype.bufferData;
    const bufferDataWebGL2 = WebGL2RenderingContext.prototype.bufferData;
    const bufferDataHandler = (webGLBufferData) => () => {
        arguments[1] = arguments[1].map(num => num + Number(data.webGL.salt));
        return webGLBufferData.call(this, ...arguments);
    }
    WebGLRenderingContext.prototype.bufferData = bufferDataHandler(bufferDataWebGL);
    WebGL2RenderingContext.prototype.bufferData = bufferDataHandler(bufferDataWebGL2);
}
