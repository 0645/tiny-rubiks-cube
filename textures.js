import {defs, tiny} from './examples/common.js';

const {
    hex_color, Material, Texture,
} = tiny;

const {Textured_Phong} = defs;

const textures = {};

export {textures};

const texture = new Texture("assets/cb_white.png", "NEAREST");
const ads = {
    ambient: .15, diffusivity: 1, specularity: 1,
};

const stickerless = textures.stickerless = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), texture, ...ads}),
    white: new Material(new Textured_Phong(), { color: hex_color("#ffffff"), texture, ...ads}),
    yellow: new Material(new Textured_Phong(), { color: hex_color("#ffff00"), texture, ...ads}),
    blue: new Material(new Textured_Phong(), { color: hex_color("#0000ff"), texture, ...ads}),
    green: new Material(new Textured_Phong(), { color: hex_color("#00ff00"), texture, ...ads}),
    orange: new Material(new Textured_Phong(), { color: hex_color("#ff8000"), texture, ...ads}),
    red: new Material(new Textured_Phong(), { color: hex_color("#ff0000"), texture, ...ads}),
};

class Basic_Look extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                float sticker_length = 0.95;
                float temp = 0.05;
                if(!(f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0, 0, 0, 1.0 ); 
                }
        } `;
    }
}

const basic_look = textures.basic_look = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Basic_Look(), { color: hex_color("#ffffff"), texture, ...ads}),
    yellow: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    blue: new Material(new Basic_Look(), { color: hex_color("#0000ff"), texture, ...ads}),
    green: new Material(new Basic_Look(), { color: hex_color("#00ff00"), texture, ...ads}),
    orange: new Material(new Basic_Look(), { color: hex_color("#ff8000"), texture, ...ads}),
    red: new Material(new Basic_Look(), { color: hex_color("#ff0000"), texture, ...ads}),
};

const dodo = textures.dodo = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), texture, ...ads}),
    white: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    yellow: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    blue: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    green: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    orange: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
    red: new Material(new Basic_Look(), { color: hex_color("#ffff00"), texture, ...ads}),
};

class Light_Mode extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                float sticker_length = 0.95;
                float temp = 0.05;
                if(!(f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0.75, 0.75, 0.75, 1.0 ); 
                }
        } `;
    }
}

const light_mode = textures.light_mode = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#ffffff"), texture, ...ads}),
    white: new Material(new Light_Mode(), { color: hex_color("#000000"), texture, ...ads}),
    yellow: new Material(new Light_Mode(), { color: hex_color("#ffff00"), texture, ...ads}),
    blue: new Material(new Light_Mode(), { color: hex_color("#0000ff"), texture, ...ads}),
    green: new Material(new Light_Mode(), { color: hex_color("#00ff00"), texture, ...ads}),
    orange: new Material(new Light_Mode(), { color: hex_color("#ff8000"), texture, ...ads}),
    red: new Material(new Light_Mode(), { color: hex_color("#ff0000"), texture, ...ads}),
};

class Inverted extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                float sticker_length = 0.925;
                float temp = 0.075;
                if((f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }
        } `;
    }
}

const inverted = textures.inverted = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Inverted(), { color: hex_color("#ffffff"), texture, ...ads}),
    yellow: new Material(new Inverted(), { color: hex_color("#ffff00"), texture, ...ads}),
    blue: new Material(new Inverted(), { color: hex_color("#0000ff"), texture, ...ads}),
    green: new Material(new Inverted(), { color: hex_color("#00ff00"), texture, ...ads}),
    orange: new Material(new Inverted(), { color: hex_color("#ff8000"), texture, ...ads}),
    red: new Material(new Inverted(), { color: hex_color("#ff0000"), texture, ...ads}),
};

class Electric_Glow extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

class Silhouette extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                float sticker_length = 0.95;
                float temp = 0.05;
                if(!(f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }

                if(tex_color.x == 0.0 && tex_color.y == 0.0 && tex_color.z == 0.0) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }
        } `;
    }
}

const colorblind = textures.colorblind = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/cb_white.png", "NEAREST"), ...ads }),
    yellow: new Material(new Silhouette(), { color: hex_color("#ffff00"), texture: new Texture("assets/cb_yellow.png", "NEAREST"), ...ads }),
    blue: new Material(new Silhouette(), { color: hex_color("#0000ff"), texture: new Texture("assets/cb_blue.png", "NEAREST"), ...ads }),
    green: new Material(new Silhouette(), { color: hex_color("#00ff00"), texture: new Texture("assets/cb_green.png", "NEAREST"), ...ads }),
    orange: new Material(new Silhouette(), { color: hex_color("#ff8000"), texture: new Texture("assets/cb_orange.png", "NEAREST"), ...ads }),
    red: new Material(new Silhouette(), { color: hex_color("#ff0000"), texture: new Texture("assets/cb_red.png", "NEAREST"), ...ads }),
};

const sheperds_cube = textures.sheperds_cube = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    yellow: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    blue: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    green: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    orange: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    red: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
};

const electric_glow = textures.electric_glow = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
    yellow: new Material(new Silhouette(), { color: hex_color("#ffff00"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
    blue: new Material(new Silhouette(), { color: hex_color("#0000ff"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
    green: new Material(new Silhouette(), { color: hex_color("#00ff00"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
    orange: new Material(new Silhouette(), { color: hex_color("#ff8000"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
    red: new Material(new Silhouette(), { color: hex_color("#ff0000"), texture: new Texture("assets/electric_glow.png", "NEAREST"), ...ads }),
};

class Rotating_Silhouette extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                vec2 new_tex_coord = f_tex_coord - vec2( 0.5, 0.5 );
                float angle = mod(animation_time * 6.28318530718, 6.28318530718);
                mat2 rotation = mat2( cos(angle), -sin(angle), sin(angle), cos(angle) );
                new_tex_coord = rotation * new_tex_coord + vec2( 0.5, 0.5 );

                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, new_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                float sticker_length = 0.95;
                float temp = 0.05;
                if(!(f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }

                if(tex_color.x == 0.0 && tex_color.y == 0.0 && tex_color.z == 0.0) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }
        } `;
    }
}

const alvins_cube = textures.alvins_cube = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    yellow: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    blue: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    green: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    orange: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
    red: new Material(new Rotating_Silhouette(), { color: hex_color("#ffffff"), texture: new Texture("assets/arrow.png", "NEAREST"), ...ads }),
};

const colors = {
    white: { r: '1.0', g: '1.0', b: '1.0'},
    yellow: { r: '1.0', g: '1.0', b: '0.5'},
    blue: { r: '0.5', g: '0.5', b: '1.0'},
    green: { r: '0.5', g: '1.0', b: '0.5'},
    orange: { r: '1.0', g: '0.5', b: '0.5'},
    red: { r: '1.0', g: '0.5', b: '0.5'},
}

const color_block = (arr, r, g, b) => {
    const create_color = (n) => {
        return `
            ${n == 0 ? '' : 'else '}if(t1 < ${(n + 1) * 1}.0) {
                float r1 = ${arr[n].r} * t3;
                float r2 = ${arr[(n + 1) % 6].r} * t2;
                float r = r1 + r2;
                float g1 = ${arr[n].g} * t3;
                float g2 = ${arr[(n + 1) % 6].g} * t2;
                float g = g1 + g2;
                float b1 = ${arr[n].b} * t3;
                float b2 = ${arr[(n + 1) % 6].b} * t2;
                float b = b1 + b2;
                gl_FragColor = vec4( r, g, b, 1.0 );
            }
        `;
    }
    return `
        if(shape_color.r == ${r} && shape_color.g == ${g} && shape_color.b == ${b}) {
            float t1 = mod(animation_time, 6.0);
            float t2 = mod(animation_time, 1.0) / 1.0;
            float t3 = 1.0 - t2;
            ${create_color(0)}
            ${create_color(1)}
            ${create_color(2)}
            ${create_color(3)}
            ${create_color(4)}
            ${create_color(5)}
        }
    `;
}
console.log(color_block([colors.white, colors.yellow, colors.blue, colors.green, colors.orange, colors.red]))
class Disco extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, tex_color.w * shape_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                /* ${color_block([colors.white, colors.yellow, colors.blue, colors.green, colors.orange, colors.red], '1.0', '1.0', '1.0')}
                ${color_block([colors.yellow, colors.red, colors.white, colors.orange, colors.blue, colors.green], '1.0', '1.0', '0.0')}
                ${color_block([colors.red, colors.blue, colors.orange, colors.green, colors.yellow, colors.white], '1.0', '0.0', '0.0')}
                ${color_block([colors.blue, colors.white, colors.red, colors.yellow, colors.orange, colors.green], '0.0', '0.0', '1.0')}
                ${color_block([colors.green, colors.orange, colors.blue, colors.red, colors.white, colors.yellow], '0.0', '1.0', '0.0')}
                ${color_block([colors.orange, colors.green, colors.white, colors.red, colors.blue, colors.yellow], '0.0', '0.0', '0.0')} */

                ${color_block([colors.white, colors.yellow, colors.blue, colors.green, colors.orange, colors.red], '1.0', '1.0', '1.0')}
                ${color_block([colors.yellow, colors.blue, colors.green, colors.orange, colors.red, colors.white], '1.0', '1.0', '0.0')}
                ${color_block([colors.blue, colors.green, colors.orange, colors.red, colors.white, colors.yellow], '1.0', '0.0', '0.0')}
                ${color_block([colors.green, colors.orange, colors.red, colors.white, colors.yellow, colors.blue], '0.0', '0.0', '1.0')}
                ${color_block([colors.orange, colors.red, colors.white, colors.yellow, colors.blue, colors.green], '0.0', '1.0', '0.0')}
                ${color_block([colors.red, colors.white, colors.yellow, colors.blue, colors.green, colors.orange], '0.0', '0.0', '0.0')}
                
                float sticker_length = 0.95;
                float temp = 0.05;
                if(!(f_tex_coord.x > temp && f_tex_coord.x < sticker_length && f_tex_coord.y > temp && f_tex_coord.y < sticker_length)) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }

                if(tex_color.x == 0.0 && tex_color.y == 0.0 && tex_color.z == 0.0) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }
        } `;
    }
}

const disco = textures.disco = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Disco(), { color: hex_color("#ffffff"), texture, ...ads }),
    yellow: new Material(new Disco(), { color: hex_color("#ffff00"), texture, ...ads }),
    blue: new Material(new Disco(), { color: hex_color("#0000ff"), texture, ...ads }),
    green: new Material(new Disco(), { color: hex_color("#00ff00"), texture, ...ads }),
    orange: new Material(new Disco(), { color: hex_color("#000000"), texture, ...ads }),
    red: new Material(new Disco(), { color: hex_color("#ff0000"), texture, ...ads }),
};