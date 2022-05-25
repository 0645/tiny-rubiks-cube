import {defs, tiny} from './examples/common.js';
import {rubiks} from './rubiks.js';
import {model} from './model.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Square, Cube, Axis_Arrows, Textured_Phong} = defs;

const {Rubiks} = rubiks;
const {Model} = model;

export class Project extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.model = new Model(3, Texture_Sticker);
        this.smoothRotations = true;
        this.initial_camera_location = Mat4.look_at(vec3(16, 0, 0), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        this.key_triggered_button("F", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 1;
            } else {
                this.model.cube.F();
            }
        });
        this.key_triggered_button("F'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -1;
            } else {
                this.model.cube.Fi();
            }
        });
        this.key_triggered_button("B", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 2;
            } else {
                this.model.cube.B();
            }
        });
        this.key_triggered_button("B'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -2;
            } else {
                this.model.cube.Bi();
            }
        });
        this.key_triggered_button("U", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 3;
            } else {
                this.model.cube.U();
            }
        });
        this.key_triggered_button("U'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -3;
            } else {
                this.model.cube.Ui();
            }
        });
        this.key_triggered_button("D", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 4;
            } else {
                this.model.cube.D();
            }
        });
        this.key_triggered_button("D'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -4;
            } else {
                this.model.cube.Di();
            }
        });
        this.key_triggered_button("L", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 5;
            } else {
                this.model.cube.L();
            }
        });
        this.key_triggered_button("L'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -5;
            } else {
                this.model.cube.Li();
            }
        });
        this.key_triggered_button("R", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 6;
            } else {
                this.model.cube.R();
            }
        });
        this.key_triggered_button("R'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -6;
            } else {
                this.model.cube.Ri();
            }
        });
        this.key_triggered_button("M", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 7;
            } else {
                this.model.cube.M();
            }
        });
        this.key_triggered_button("M'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -7;
            } else {
                this.model.cube.Mi();
            }
        });
        this.key_triggered_button("E", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 8;
            } else {
                this.model.cube.E();
            }
        });
        this.key_triggered_button("E'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -8;
            } else {
                this.model.cube.Ei();
            }
        });
        this.key_triggered_button("S", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 9;
            } else {
                this.model.cube.S();
            }
        });
        this.key_triggered_button("S'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -9;
            } else {
                this.model.cube.Si();
            }
        });
        this.key_triggered_button("x", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 10;
            } else {
                this.model.cube.x();
            }
        });
        this.key_triggered_button("x'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -10;
            } else {
                this.model.cube.xi();
            }
        });
        this.key_triggered_button("y", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 11;
            } else {
                this.model.cube.y();
            }
        });
        this.key_triggered_button("y'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -11;
            } else {
                this.model.cube.yi();
            }
        });
        this.key_triggered_button("z", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = 12;
            } else {
                this.model.cube.z();
            }
        });
        this.key_triggered_button("z'", ["="], () => {
            if(this.smoothRotations) {
                this.model.rotating = -12;
            } else {
                this.model.cube.zi();
            }
        });
        this.key_triggered_button("Toggle smooth rotations", ["="], () => this.smoothRotations = !this.smoothRotations);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.look_at(vec3(7, 7, 15), vec3(0, 0, 0), vec3(0, 1, 0)));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_positions = [
            vec4(10, 10, 10, 1),
            vec4(-10, -10, -10, 1),
        ];
        program_state.lights = light_positions.map((light_position) => new Light(light_position, color(1, 1, 1, 1), 10000));

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        this.model.render(context, program_state);
    }
}

class Texture_Sticker extends Textured_Phong {
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

class Texture_Sticker_Inverted extends Textured_Phong {
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
