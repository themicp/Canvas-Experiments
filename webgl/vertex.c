attribute vec3 position;
attribute vec4 color;

uniform mat4 move;
uniform mat4 project;

varying vec4 vColor;

void main(void) {
    gl_Position = project * move * vec4(position, 1.0);
    vColor = color;
}
