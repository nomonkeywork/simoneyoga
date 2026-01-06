'use strict';



function createFluidCanvas(canvasId, imageUrl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas ${canvasId} not found`);
        return null;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Configuration
    const config = {
        TEXTURE_DOWNSAMPLE: 100,
        DENSITY_DISSIPATION: 1.07,
        VELOCITY_DISSIPATION: 2.99,
        PRESSURE_DISSIPATION: 0.8,
        PRESSURE_ITERATIONS: 2,
        CURL: 8,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 8000,
        DISTORTION_STRENGTH: 0.001,
        COLOR_INTENSITY: 0.175,
        RAINBOW: true,
        ZOOM_DURATION: 5000,
        ZOOM_SCALE_MAX: 1.06,
        ZOOM_SCALE_MIN: 1.0,
        ENABLE_MULTISAMPLING: true,
        SAMPLE_OFFSET: 0.25
    };

    let pointers = [];
    let imageTexture = null;
    let imageLoaded = false;
    let imageWidth = 0;
    let imageHeight = 0;
    let startTime = Date.now();

    const { gl, ext } = getWebGLContext(canvas);

    function getWebGLContext(canvas) {
        const params = {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        };

        let gl = canvas.getContext('webgl2', params);
        const isWebGL2 = !!gl;
        if (!isWebGL2)
            gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

        let halfFloat;
        let supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
        let formatRGBA;
        let formatRG;
        let formatR;

        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return {
            gl,
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering
            }
        };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F:
                    return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F:
                    return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default:
                    return null;
            }
        }
        return {
            internalFormat,
            format
        }
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status == gl.FRAMEBUFFER_COMPLETE;
    }

    function loadImage(url) {
        const image = new Image();
        image.onload = () => {
            // Store original image dimensions for aspect ratio constraints
            imageWidth = image.width;
            imageHeight = image.height;
            
            imageTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, imageTexture);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            
            const ext = gl.getExtension('EXT_texture_filter_anisotropic');
            if (ext) {
                const max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, max));
            }

            imageLoaded = true;
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.style.display = 'none';

            update();
        };
        image.onerror = () => {
            console.error(`Erreur lors du chargement de l'image: ${url}`);
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.textContent = 'Erreur de chargement de l\'image';
        };
        image.src = url;
    }

    function pointerPrototype() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
    }

    pointers.push(new pointerPrototype());

    class GLProgram {
        constructor(vertexShader, fragmentShader) {
            this.uniforms = {};
            this.program = gl.createProgram();

            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                throw gl.getProgramInfoLog(this.program);

            const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                const uniformName = gl.getActiveUniform(this.program, i).name;
                this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
            }
        }

        bind() {
            gl.useProgram(this.program);
        }
    }

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw gl.getShaderInfoLog(shader);

        return shader;
    }

    function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    function calculateZoomScale(currentTime) {
        const elapsed = (currentTime - startTime) % (config.ZOOM_DURATION * 2);
        const progress = elapsed / config.ZOOM_DURATION;
        
        let easedProgress;
        let scale;
        
        if (progress <= 1.0) {
            easedProgress = easeInOutSine(progress);
            scale = config.ZOOM_SCALE_MIN + (config.ZOOM_SCALE_MAX - config.ZOOM_SCALE_MIN) * easedProgress;
        } else {
            const deZoomProgress = progress - 1.0;
            easedProgress = easeInOutSine(deZoomProgress);
            scale = config.ZOOM_SCALE_MAX - (config.ZOOM_SCALE_MAX - config.ZOOM_SCALE_MIN) * easedProgress;
        }
        
        return scale;
    }

    // Shaders
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
    `);

    const imageDistortionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uImage;
        uniform sampler2D uVelocity;
        uniform sampler2D uDensity;
        uniform float uDistortionStrength;
        uniform vec2 uAspectRatio;
        uniform vec2 uImageAspectRatio;
        uniform vec2 uUvScale;
        uniform vec2 uUvOffset;
        uniform float uZoomScale;
        uniform bool uEnableMultisampling;
        uniform float uSampleOffset;
        
        vec3 sampleImageSmooth(sampler2D tex, vec2 uv, float offset) {
            if (!uEnableMultisampling) {
                return texture2D(tex, uv).rgb;
            }
            
            vec2 texelSize = vec2(1.0) / vec2(2048.0, 1536.0);
            
            vec3 color = vec3(0.0);
            float off = offset;
            color += texture2D(tex, uv + vec2(-off, -off) * texelSize).rgb * 0.25;
            color += texture2D(tex, uv + vec2( off, -off) * texelSize).rgb * 0.25;
            color += texture2D(tex, uv + vec2(-off,  off) * texelSize).rgb * 0.25;
            color += texture2D(tex, uv + vec2( off,  off) * texelSize).rgb * 0.25;
            
            return color;
        }
        
        void main () {
            vec2 correctedUv = vec2(vUv.x, 1.0 - vUv.y);
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity = clamp(velocity, -5.0, 5.0);
            
            vec2 edgeFade = smoothstep(0.0, 0.1, vUv) * (1.0 - smoothstep(0.9, 1.0, vUv));
            float edgeAttenuation = edgeFade.x * edgeFade.y;
            
            vec2 distortion = velocity * uDistortionStrength * edgeAttenuation;
            distortion.x *= uAspectRatio.x;
            distortion.y *= uAspectRatio.y;
            
            vec2 distortedUv = correctedUv + vec2(distortion.x, -distortion.y);
            
            // Apply aspect ratio constraints to maintain image proportions
            // Map canvas UV to image UV with proper scaling and offset
            vec2 constrainedUv = distortedUv * uUvScale + uUvOffset;
            
            vec2 center = vec2(0.5, 0.5);
            vec2 zoomedUv = center + (constrainedUv - center) / uZoomScale;
            zoomedUv = clamp(zoomedUv, 0.001, 0.999);
            
            vec3 imageColor = sampleImageSmooth(uImage, zoomedUv, uSampleOffset);
            vec3 fluidColor = texture2D(uDensity, vUv).rgb;
            
            float fluidAlpha = length(fluidColor) * 0.6;
            vec3 finalColor = mix(imageColor, fluidColor + imageColor * 0.5, fluidAlpha);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `);

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            vec4 result = texture2D(uSource, coord);
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
    `);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 vel = texture2D(uVelocity, vUv).xy;
            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const imageDistortionProgram = new GLProgram(baseVertexShader, imageDistortionShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(baseVertexShader, advectionShader);
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

    let dye;
    let velocity;
    let divergence;
    let curl;
    let pressure;

    let simWidth;
    let simHeight;
    let dyeWidth;
    let dyeHeight;

    function initFramebuffers() {
        let simRes = getResolution(128);
        let dyeRes = getResolution(512);

        simWidth = simRes.width;
        simHeight = simRes.height;
        dyeWidth = dyeRes.width;
        dyeHeight = dyeRes.height;

        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        dye = createDoubleFBO(dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering);
        velocity = createDoubleFBO(simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering);
        divergence = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function getResolution(resolution) {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1)
            aspectRatio = 1.0 / aspectRatio;

        let min = Math.round(resolution);
        let max = Math.round(resolution * aspectRatio);

        if (gl.drawingBufferWidth > gl.drawingBufferHeight)
            return { width: max, height: min };
        else
            return { width: min, height: max };
    }

    function createFBO(w, h, internalFormat, format, type, param) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return {
            texture,
            fbo,
            width: w,
            height: h,
            attach(id) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
        let fbo1 = createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = createFBO(w, h, internalFormat, format, type, param);

        return {
            width: w,
            height: h,
            texelSizeX: 1.0 / w,
            texelSizeY: 1.0 / h,
            get read() {
                return fbo1;
            },
            set read(value) {
                fbo1 = value;
            },
            get write() {
                return fbo2;
            },
            set write(value) {
                fbo2 = value;
            },
            swap() {
                let temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            }
        }
    }

    initFramebuffers();

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        return (destination) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
    })();

    let lastUpdateTime = Date.now();

    function update() {
        if (!imageLoaded) return;

        const dt = calcDeltaTime();
        if (resizeCanvas())
            initFramebuffers();

        applyInputs();
        step(dt);
        render(null);
        requestAnimationFrame(update);
    }

    function calcDeltaTime() {
        let now = Date.now();
        let dt = (now - lastUpdateTime) / 1000;
        dt = Math.min(dt, 0.016666);
        lastUpdateTime = now;
        return dt;
    }

    function resizeCanvas() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width != width || canvas.height != height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    function applyInputs() {
        pointers.forEach(p => {
            if (p.moved) {
                p.moved = false;
                splatPointer(p);
            }
        });
    }

    function step(dt) {
        gl.disable(gl.BLEND);
        gl.viewport(0, 0, simWidth, simHeight);

        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl.fbo);

        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
        blit(velocity.write.fbo);
        velocity.swap();

        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence.fbo);

        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
        blit(pressure.write.fbo);
        pressure.swap();

        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write.fbo);
            pressure.swap();
        }

        gradientSubtractProgram.bind();
        gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write.fbo);
        velocity.swap();

        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write.fbo);
        velocity.swap();

        gl.viewport(0, 0, dyeWidth, dyeHeight);
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write.fbo);
        dye.swap();
    }

    function render(target) {
        let width = target == null ? gl.drawingBufferWidth : dyeWidth;
        let height = target == null ? gl.drawingBufferHeight : dyeHeight;

        gl.viewport(0, 0, width, height);

        imageDistortionProgram.bind();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.uniform1i(imageDistortionProgram.uniforms.uImage, 0);

        gl.uniform1i(imageDistortionProgram.uniforms.uVelocity, velocity.read.attach(1));
        gl.uniform1i(imageDistortionProgram.uniforms.uDensity, dye.read.attach(2));

        gl.uniform1f(imageDistortionProgram.uniforms.uDistortionStrength, config.DISTORTION_STRENGTH);

        let aspectRatio = canvas.width / canvas.height;
        gl.uniform2f(imageDistortionProgram.uniforms.uAspectRatio,
            aspectRatio > 1 ? 1.0 : aspectRatio,
            aspectRatio > 1 ? 1.0 / aspectRatio : 1.0
        );

        // Calculate aspect ratio constraints to maintain image proportions (object-fit: cover)
        let canvasAspect = canvas.width / canvas.height;
        let imageAspect = imageWidth / imageHeight;
        let uvScaleX = 1.0;
        let uvScaleY = 1.0;
        let uvOffsetX = 0.0;
        let uvOffsetY = 0.0;
        
        if (imageWidth > 0 && imageHeight > 0) {
            // Calculate scale to cover canvas (object-fit: cover)
            // Scale factor to ensure image covers entire canvas
            let scaleX = canvas.width / imageWidth;
            let scaleY = canvas.height / imageHeight;
            let coverScale = Math.max(scaleX, scaleY); // Use max to ensure full coverage
            
            // Calculate the dimensions of the image when scaled to cover
            let scaledImageWidth = imageWidth * coverScale;
            let scaledImageHeight = imageHeight * coverScale;
            
            // Calculate how much of the scaled image we're actually showing
            // This will be <= 1.0 in the dimension that gets cropped
            uvScaleX = canvas.width / scaledImageWidth;
            uvScaleY = canvas.height / scaledImageHeight;
            
            // Center the visible portion
            uvOffsetX = (1.0 - uvScaleX) * 0.5;
            uvOffsetY = (1.0 - uvScaleY) * 0.5;
            
            gl.uniform2f(imageDistortionProgram.uniforms.uImageAspectRatio, imageAspect, 1.0 / imageAspect);
            gl.uniform2f(imageDistortionProgram.uniforms.uUvScale, uvScaleX, uvScaleY);
            gl.uniform2f(imageDistortionProgram.uniforms.uUvOffset, uvOffsetX, uvOffsetY);
        } else {
            // Fallback if image dimensions not yet loaded
            gl.uniform2f(imageDistortionProgram.uniforms.uImageAspectRatio, 1.0, 1.0);
            gl.uniform2f(imageDistortionProgram.uniforms.uUvScale, 1.0, 1.0);
            gl.uniform2f(imageDistortionProgram.uniforms.uUvOffset, 0.0, 0.0);
        }

        const currentZoomScale = calculateZoomScale(Date.now());
        gl.uniform1f(imageDistortionProgram.uniforms.uZoomScale, currentZoomScale);

        gl.uniform1i(imageDistortionProgram.uniforms.uEnableMultisampling, config.ENABLE_MULTISAMPLING);
        gl.uniform1f(imageDistortionProgram.uniforms.uSampleOffset, config.SAMPLE_OFFSET);

        blit(target);
    }

    function splatPointer(pointer) {
        let dx = pointer.deltaX * config.SPLAT_FORCE;
        let dy = pointer.deltaY * config.SPLAT_FORCE;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy);
    }

    function splat(x, y, dx, dy) {
        gl.viewport(0, 0, simWidth, simHeight);
        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
        blit(velocity.write.fbo);
        velocity.swap();

        gl.viewport(0, 0, dyeWidth, dyeHeight);
        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        let color = {
            r: Math.random() * config.COLOR_INTENSITY,
            g: Math.random() * config.COLOR_INTENSITY,
            b: Math.random() * config.COLOR_INTENSITY
        };
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write.fbo);
        dye.swap();
    }

    function correctRadius(radius) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1)
            radius *= aspectRatio;
        return radius;
    }

    // Event handlers
    canvas.addEventListener('mousedown', e => {
        let posX = e.offsetX;
        let posY = e.offsetY;
        let pointer = pointers.find(p => p.id == -1);
        if (pointer == null)
            pointer = new pointerPrototype();
        updatePointerDownData(pointer, -1, posX, posY);
    });

    canvas.addEventListener('mousemove', e => {
        let pointer = pointers[0];
        let posX = e.offsetX;
        let posY = e.offsetY;
        updatePointerMoveData(pointer, posX, posY);
    });

    window.addEventListener('mouseup', () => {
        updatePointerUpData(pointers[0]);
    });

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        while (touches.length >= pointers.length)
            pointers.push(new pointerPrototype());
        for (let i = 0; i < touches.length; i++) {
            let posX = touches[i].pageX;
            let posY = touches[i].pageY;
            updatePointerDownData(pointers[i + 1], touches[i].identifier, posX, posY);
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
            let pointer = pointers[i + 1];
            if (!pointer.down) continue;
            let posX = touches[i].pageX;
            let posY = touches[i].pageY;
            updatePointerMoveData(pointer, posX, posY);
        }
    }, false);

    window.addEventListener('touchend', e => {
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let pointer = pointers.find(p => p.id == touches[i].identifier);
            if (pointer == null) continue;
            updatePointerUpData(pointer);
        }
    });

    function updatePointerDownData(pointer, id, posX, posY) {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
    }

    function updatePointerMoveData(pointer, posX, posY) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function updatePointerUpData(pointer) {
        pointer.down = false;
    }

    function correctDeltaX(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio < 1) delta *= aspectRatio;
        return delta;
    }

    function correctDeltaY(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) delta /= aspectRatio;
        return delta;
    }

    loadImage(imageUrl);

    return {
        destroy: () => {
            // Cleanup si nécessaire
            imageLoaded = false;
        }
    };
}

// Initialisation des canvas
document.addEventListener('DOMContentLoaded', () => {
    // Canvas header
    //   createFluidCanvas("canvas", "images/Photo_049_plaine-nuit.jpg");
      createFluidCanvas("canvas", "images/djaeknesundet.jpg");
    
    // Canvas footer (optionnel, peut utiliser une autre image)
    createFluidCanvas('canvas-footer', 'images/visual-footer.jpg');

    setTimeout(() => {
        createFluidCanvas('canvas-footer', 'images/visual-footer.jpg');
    }, 100);
});