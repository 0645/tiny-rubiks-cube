import {defs, tiny} from './examples/common.js';
import {rubiks} from './rubiks.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Square, Cube, Axis_Arrows, Textured_Phong} = defs;

const {Rubiks} = rubiks;

export class Project extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.cube = new Rubiks(3);
        this.stickers = {
            front: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]],
            back: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]],
            top: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]],
            bottom: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]],
            left: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]],
            right: [[new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()], [new Square(), new Square(), new Square()]]
        }

        this.shapes = {
            box_1: new Cube(),
            box_2: new Cube(),
            axis: new Axis_Arrows()
        }

        this.cubeRotation = false;
        this.angle1 = 0;
        this.angle2 = 0;

        // Display the texture four times on each side
        this.shapes.box_2.arrays.texture_coord.forEach(v => v.scale_by(2));

        this.materials = {
            axis: new Material(new Textured_Phong(), {
                color: hex_color("#ffff00"),
            }),
            white: new Material(new Texture_Sticker(), {
                color: hex_color("#ffffff"),
            }),
            yellow: new Material(new Texture_Sticker(), {
                color: hex_color("#ffff00"),
            }),
            blue: new Material(new Texture_Sticker(), {
                color: hex_color("#0000ff"),
            }),
            green: new Material(new Texture_Sticker(), {
                color: hex_color("#00ff00"),
            }),
            orange: new Material(new Texture_Sticker(), {
                color: hex_color("#ff8000"),
            }),
            red: new Material(new Texture_Sticker(), {
                color: hex_color("#ff0000"),
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        this.key_triggered_button("F", ["="], () => this.cube.F());
        this.key_triggered_button("F'", ["="], () => this.cube.Fi());
        this.key_triggered_button("B", ["="], () => this.cube.B());
        this.key_triggered_button("B'", ["="], () => this.cube.Bi());
        this.key_triggered_button("U", ["="], () => this.cube.U());
        this.key_triggered_button("U'", ["="], () => this.cube.Ui());
        this.key_triggered_button("D", ["="], () => this.cube.D());
        this.key_triggered_button("D'", ["="], () => this.cube.Di());
        this.key_triggered_button("L", ["="], () => this.cube.L());
        this.key_triggered_button("L'", ["="], () => this.cube.Li());
        this.key_triggered_button("R", ["="], () => this.cube.R());
        this.key_triggered_button("R'", ["="], () => this.cube.Ri());
        this.key_triggered_button("M", ["="], () => this.cube.M());
        this.key_triggered_button("M'", ["="], () => this.cube.Mi());
        this.key_triggered_button("E", ["="], () => this.cube.E());
        this.key_triggered_button("E'", ["="], () => this.cube.Ei());
        this.key_triggered_button("S", ["="], () => this.cube.S());
        this.key_triggered_button("S'", ["="], () => this.cube.Si());
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -8));
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

        if(this.cubeRotation) {
            this.angle1 += (dt / 3) * 2 * Math.PI;
            this.angle2 += (dt / 2) * 2 * Math.PI;
        }

        let model_transform1 = model_transform.times(Mat4.translation(-2, 0, 0));
        model_transform1 = model_transform1.times(Mat4.rotation(this.angle1, 1, 0, 0));
        
        let model_transform2 = model_transform.times(Mat4.translation(2, 0, 0));
        model_transform2 = model_transform2.times(Mat4.rotation(this.angle2, 0, 1, 0));

        const rotate_clockwise = Mat4.rotation(1, 0, 0)

        const faces = ["front", "back", "top", "bottom", "left", "right"];
        const face_transform = {
            front: Mat4.rotation(0, 1, 0, 0).times(Mat4.rotation(-Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI / 2, 0, 0, 1)),
            back: Mat4.rotation(0, 1, 0, 0).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI / 2, 0, 0, 1)),
            top: Mat4.rotation(Math.PI / 2, 1, 0, 0).times(Mat4.rotation(0, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI, 0, 0, 1)),
            bottom: Mat4.rotation(Math.PI / 2, 1, 0, 0).times(Mat4.rotation(Math.PI, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI, 0, 0, 1)),
            left: Mat4.rotation(0, 1, 0, 0).times(Mat4.rotation(0, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI / 2, 0, 0, 1)),
            right: Mat4.rotation(0, 1, 0, 0).times(Mat4.rotation(Math.PI, 0, 1, 0)).times(Mat4.translation(0, 0, 3)).times(Mat4.rotation(Math.PI / 2, 0, 0, 1))
        };

        faces.forEach((face) => {
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    const translation = Mat4.translation(2 * (i - 1), 2 * (j - 1), 0);
                    this.stickers[face][i][j].draw(context, program_state, face_transform[face].times(translation), this.materials[this.cube[face].grid[i][j].image]);
                }
            }
        });
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
