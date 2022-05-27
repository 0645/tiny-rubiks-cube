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
        this.model = new Model(new Rubiks(3), textures.basic_look);
        this.smoothRotations = true;
        this.initial_camera_location = Mat4.look_at(vec3(16, 0, 0), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        const makeMoveButton = (description, shortcut_combination, rotate_number, rotate_function) => {
            this.key_triggered_button(description, [shortcut_combination], () => {
                if(this.model.rotating || this.model.cube.rotating)
                    return;
                else if(this.smoothRotations)
                    this.model.rotating = rotate_number;
                else this.model.cube.move(rotate_function);
            });
        };

        makeMoveButton("F", "=", 1, this.model.cube.F); makeMoveButton("F'", "=", -1, this.model.cube.Fi);
        this.key_triggered_button("Toggle smooth rotations", ["="], () => {
            if(this.model.rotating || this.model.cube.rotating)
                return;
            else
                this.smoothRotations = !this.smoothRotations;
        });
        this.new_line(); makeMoveButton("B", "=", 2, this.model.cube.B); makeMoveButton("B'", "=", -2, this.model.cube.Bi);
        this.key_triggered_button("Basic Look", ["="], () => this.model.setMaterials(textures.basic_look));
        this.new_line(); makeMoveButton("U", "=", 3, this.model.cube.U); makeMoveButton("U'", "=", -3, this.model.cube.Ui);
        this.key_triggered_button("Light Mode", ["="], () => this.model.setMaterials(textures.light_mode));
        this.new_line(); makeMoveButton("D", "=", 4, this.model.cube.D); makeMoveButton("D'", "=", -4, this.model.cube.Di);
        this.key_triggered_button("Inverted", ["="], () => this.model.setMaterials(textures.inverted));
        this.new_line(); makeMoveButton("L", "=", 5, this.model.cube.L); makeMoveButton("L'", "=", -5, this.model.cube.Li);
        this.key_triggered_button("Dodo", ["="], () => this.model.setMaterials(textures.dodo));
        this.new_line(); makeMoveButton("R", "=", 6, this.model.cube.R); makeMoveButton("R'", "=", -6, this.model.cube.Ri);
        this.key_triggered_button("Stickerless", ["="], () => this.model.setMaterials(textures.stickerless));
        this.new_line(); makeMoveButton("M", "=", 7, this.model.cube.M); makeMoveButton("M'", "=", -7, this.model.cube.Mi);
        this.key_triggered_button("Colorblind", ["="], () => this.model.setMaterials(textures.colorblind));
        this.new_line(); makeMoveButton("E", "=", 8, this.model.cube.E); makeMoveButton("E'", "=", -8, this.model.cube.Ei);
        this.key_triggered_button("Sheperd's Cube", ["="], () => this.model.setMaterials(textures.sheperds_cube));
        this.new_line(); makeMoveButton("S", "=", 9, this.model.cube.S); makeMoveButton("S'", "=", -9, this.model.cube.Si);
        this.new_line(); makeMoveButton("x", "=", 10, this.model.cube.x); makeMoveButton("x'", "=", -10, this.model.cube.xi);
        this.new_line(); makeMoveButton("y", "=", 11, this.model.cube.y); makeMoveButton("y'", "=", -11, this.model.cube.yi);
        this.new_line(); makeMoveButton("z", "=", 12, this.model.cube.z); makeMoveButton("z'", "=", -12, this.model.cube.zi);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.look_at(vec3(10, 10, 10), vec3(0, 0, 0), vec3(0, 1, 0)));
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
