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
        this.key_triggered_button("F'", ["="], () => this.model.rotating = -1);
        this.key_triggered_button("B", ["="], () => this.model.rotating = 2);
        this.key_triggered_button("B'", ["="], () => this.model.rotating = -2);
        this.key_triggered_button("U", ["="], () => this.model.rotating = 3);
        this.key_triggered_button("U'", ["="], () => this.model.rotating = -3);
        this.key_triggered_button("D", ["="], () => this.model.rotating = 4);
        this.key_triggered_button("D'", ["="], () => this.model.rotating = -4);
        this.key_triggered_button("L", ["="], () => this.model.rotating = 5);
        this.key_triggered_button("L'", ["="], () => this.model.rotating = -5);
        this.key_triggered_button("R", ["="], () => this.model.rotating = 6);
        this.key_triggered_button("R'", ["="], () => this.model.rotating = -6);
        this.key_triggered_button("M", ["="], () => this.model.cube.M());
        this.key_triggered_button("M'", ["="], () => this.model.cube.Mi());
        this.key_triggered_button("E", ["="], () => this.model.cube.E());
        this.key_triggered_button("E'", ["="], () => this.model.cube.Ei());
        this.key_triggered_button("S", ["="], () => this.model.cube.S());
        this.key_triggered_button("S'", ["="], () => this.model.cube.Si());
        this.key_triggered_button("Toggle smooth rotations", ["="], () => this.smoothRotations = !this.smoothRotations);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.look_at(vec3(10, 10, 25), vec3(0, 0, 0), vec3(0, 1, 0)));
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
