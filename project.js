import {defs, tiny} from './examples/common.js';
import {rubiks} from './rubiks.js';
import {model} from './model.js';
import {textures} from './textures.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Square, Cube, Axis_Arrows, Phong_Shader, Textured_Phong} = defs;

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
        this.model = new Model(new Rubiks(3), textures.supercube);
        this.smoothRotations = true;
        this.initial_camera_location = Mat4.look_at(vec3(16, 0, 0), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        this.key_triggered_button("F", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 1; else this.model.cube.F(); });
        this.key_triggered_button("F'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -1; else this.model.cube.Fi(); });
        this.key_triggered_button("Toggle smooth rotations", ["="], () => this.smoothRotations = !this.smoothRotations);
        this.new_line();
        this.key_triggered_button("B", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 2; else this.model.cube.B(); });
        this.key_triggered_button("B'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -2; else this.model.cube.Bi(); });
        this.key_triggered_button("Basic Look", ["="], () => this.model.setMaterials(textures.basic_look));
        this.new_line();
        this.key_triggered_button("U", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 3; else this.model.cube.U(); });
        this.key_triggered_button("U'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -3; else this.model.cube.Ui(); });
        this.key_triggered_button("Light Mode", ["="], () => this.model.setMaterials(textures.light_mode));
        this.new_line();
        this.key_triggered_button("D", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 4; else this.model.cube.D(); });
        this.key_triggered_button("D'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -4; else this.model.cube.Di(); });
        this.key_triggered_button("Inverted", ["="], () => this.model.setMaterials(textures.inverted));
        this.new_line();
        this.key_triggered_button("L", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 5; else this.model.cube.L(); });
        this.key_triggered_button("L'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -5; else this.model.cube.Li(); });
        this.key_triggered_button("Dodo", ["="], () => this.model.setMaterials(textures.dodo));
        this.new_line();
        this.key_triggered_button("R", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 6; else this.model.cube.R(); });
        this.key_triggered_button("R'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -6; else this.model.cube.Ri(); });
        this.key_triggered_button("Stickerless", ["="], () => this.model.setMaterials(textures.stickerless));
        this.new_line();
        this.key_triggered_button("M", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 7; else this.model.cube.M(); });
        this.key_triggered_button("M'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -7; else this.model.cube.Mi(); });
        this.key_triggered_button("Colorblind", ["="], () => this.model.setMaterials(textures.colorblind));
        this.new_line();
        this.key_triggered_button("E", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 8; else this.model.cube.E(); });
        this.key_triggered_button("E'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -8; else this.model.cube.Ei(); });
        this.key_triggered_button("Supercube", ["="], () => this.model.setMaterials(textures.supercube));
        this.new_line();
        this.key_triggered_button("S", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 9; else this.model.cube.S(); });
        this.key_triggered_button("S'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -9; else this.model.cube.Si(); });
        this.new_line();
        this.key_triggered_button("x", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 10; else this.model.cube.x(); });
        this.key_triggered_button("x'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -10; else this.model.cube.xi(); });
        this.new_line();
        this.key_triggered_button("y", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 11; else this.model.cube.y(); });
        this.key_triggered_button("y'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -11; else this.model.cube.yi(); });
        this.new_line();
        this.key_triggered_button("z", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = 12; else this.model.cube.z(); });
        this.key_triggered_button("z'", ["="], () => { if(this.model.rotating) return; else if(this.smoothRotations) this.model.rotating = -12; else this.model.cube.zi(); });
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.look_at(vec3(7, 7, 15), vec3(0, 0, 0), vec3(0, 1, 0)));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        program_state.lights = [
            new Light(vec4(10, 10, 10, 1), color(1, 1, 1, 1), 10000),
            new Light(vec4(-10, -10, -10, 1), color(1, 1, 1, 1), 10000),
        ]

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        this.model.render(context, program_state);
    }
}
