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
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
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

class Colorblind extends Textured_Phong {
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

                if(tex_color.x == 0.0) {
                    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 ); 
                }
        } `;
    }
}

const colorblind = textures.colorblind = {
    inside: new Material(new Textured_Phong(), { color: hex_color("#000000"), }),
    white: new Material(new Colorblind(), { color: hex_color("#ffffff"), texture: new Texture("assets/cb_white.png", "NEAREST"), ...ads }),
    yellow: new Material(new Colorblind(), { color: hex_color("#ffff00"), texture: new Texture("assets/cb_yellow.png", "NEAREST"), ...ads }),
    blue: new Material(new Colorblind(), { color: hex_color("#0000ff"), texture: new Texture("assets/cb_blue.png", "NEAREST"), ...ads }),
    green: new Material(new Colorblind(), { color: hex_color("#00ff00"), texture: new Texture("assets/cb_green.png", "NEAREST"), ...ads }),
    orange: new Material(new Colorblind(), { color: hex_color("#ff8000"), texture: new Texture("assets/cb_orange.png", "NEAREST"), ...ads }),
    red: new Material(new Colorblind(), { color: hex_color("#ff0000"), texture: new Texture("assets/cb_red.png", "NEAREST"), ...ads }),
};
