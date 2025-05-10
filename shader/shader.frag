precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_bass;
uniform float u_treble;

float polarMod(float a, float n) {
    float angle = 2.0 * 3.141592 / n;
    return mod(a, angle);
}

float ring(vec2 uv, float radius, float thickness) {
    float len = length(uv);
    return smoothstep(radius + thickness, radius, len) *
           smoothstep(radius - thickness, radius, len);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Mandala segments
    float segments = mix(6.0, 24.0, u_treble);
    angle = polarMod(angle, segments);
    uv = vec2(cos(angle), sin(angle)) * r;

    float flicker = step(0.5, fract(u_time * 2.0 + sin(uv.x * 20.0)));

    // Audio-reactive radius and pulses
    float radius = 0.3 + 0.2 * sin(u_time * 4.0 + r * 10.0 + u_bass * 5.0);
    float ringValue = ring(uv, radius, 0.01 + 0.02 * u_treble);

    // Color based on radial position and flicker
    vec3 color = vec3(0.0);
    color.r += ringValue * flicker;
    color.g += ring(uv, radius * 0.7, 0.01) * (1.0 - flicker);
    color.b += ring(uv, radius * 1.4, 0.02 * u_bass) * flicker;

    // Glow effect
    color *= smoothstep(1.0, 0.3, r) * 1.5;

    gl_FragColor = vec4(color, 1.0);
}
