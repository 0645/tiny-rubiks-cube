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

        this.camera = {
            x: 10,
            y: 10,
            z: 10,
        }
        this.initial_camera_location = Mat4.look_at(vec3(this.camera.x, this.camera.y, this.camera.z), vec3(0, 0, 0), vec3(0, 1, 0));
        // this.initial_camera_location = Mat4.look_at(vec3(0, 0, 10), vec3(0, 0, 0), vec3(0, 1, 0));
        
        this.mouse_enabled_canvases = new Set();
    }

    try_moving(rotate_number, rotate_function) {
        if(this.model.rotating)
            return;
        else if(this.smoothRotations)
            this.model.rotating = rotate_number;
        else rotate_function.bind(this.model.cube)();
    }

    make_control_panel() {
        const makeMoveButton = (description, shortcut_combination, rotate_number, rotate_function) => {
            this.key_triggered_button(description, [shortcut_combination], () => {
                this.try_moving(rotate_number, rotate_function);
            });
        };
        makeMoveButton("L", "=", 5, this.model.cube.L); makeMoveButton("L'", "=", -5, this.model.cube.Li);
        makeMoveButton("R", "=", 6, this.model.cube.R); makeMoveButton("R'", "=", -6, this.model.cube.Ri);
        makeMoveButton("M", "=", 7, this.model.cube.M); makeMoveButton("M'", "=", -7, this.model.cube.Mi);
        makeMoveButton("x", "=", 10, this.model.cube.x); makeMoveButton("x'", "=", -10, this.model.cube.xi);
        this.new_line();
        makeMoveButton("U", "=", 3, this.model.cube.U); makeMoveButton("U'", "=", -3, this.model.cube.Ui);
        makeMoveButton("D", "=", 4, this.model.cube.D); makeMoveButton("D'", "=", -4, this.model.cube.Di);
        makeMoveButton("E", "=", 8, this.model.cube.E); makeMoveButton("E'", "=", -8, this.model.cube.Ei);
        makeMoveButton("y", "=", 11, this.model.cube.y); makeMoveButton("y'", "=", -11, this.model.cube.yi);
        this.new_line();
        makeMoveButton("F", "=", 1, this.model.cube.F); makeMoveButton("F'", "=", -1, this.model.cube.Fi);
        makeMoveButton("B", "=", 2, this.model.cube.B); makeMoveButton("B'", "=", -2, this.model.cube.Bi);
        makeMoveButton("S", "=", 9, this.model.cube.S); makeMoveButton("S'", "=", -9, this.model.cube.Si);
        makeMoveButton("z", "=", 12, this.model.cube.z); makeMoveButton("z'", "=", -12, this.model.cube.zi);
        this.new_line();
        this.new_line();
        this.key_triggered_button("Scramble", ["="], () => {
            if(!this.smoothRotations) {
                this.model.cube.scramble(20);
            } else if(!this.model.rotating) {
                this.model.smoothScramble(20);
            }
        });
        this.key_triggered_button("Solve", ["="], () => {
            if(!this.smoothRotations) {
                this.model.cube = new Rubiks(3);
            } else {
                this.model.solve();
            }
        });
        this.key_triggered_button("Toggle smooth rotations", ["="], () => {
            if(this.model.rotating || this.model.cube.rotating)
                return;
            else
                this.smoothRotations = !this.smoothRotations;
        });
        this.key_triggered_button("Basic Look", ["="], () => this.model.setMaterials(textures.basic_look));
        this.key_triggered_button("Light Mode", ["="], () => this.model.setMaterials(textures.light_mode));
        this.key_triggered_button("Inverted", ["="], () => this.model.setMaterials(textures.inverted));
        this.key_triggered_button("Dodo", ["="], () => this.model.setMaterials(textures.dodo));
        this.key_triggered_button("Stickerless", ["="], () => this.model.setMaterials(textures.stickerless));
        this.key_triggered_button("Colorblind", ["="], () => this.model.setMaterials(textures.colorblind));
        this.key_triggered_button("Sheperd's Cube", ["="], () => this.model.setMaterials(textures.sheperds_cube));
        this.key_triggered_button("Electric Glow", ["="], () => this.model.setMaterials(textures.electric_glow));
        this.key_triggered_button("Alvin's Cube", ["="], () => this.model.setMaterials(textures.alvins_cube));
        this.key_triggered_button("Disco", ["="], () => this.model.setMaterials(textures.disco));
    }

    display(context, program_state) {
        if (!this.mouse_enabled_canvases.has(context.canvas)) {
            this.add_mouse_controls(context.canvas);
            this.mouse_enabled_canvases.add(context.canvas);
        }

        if (!context.scratchpad.controls) {
            // this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);
        this.projection_transform = program_state.projection_transform;

        program_state.lights = [
            new Light(vec4(10, 10, 10, 1), color(1, 1, 1, 1), 10000),
            new Light(vec4(-10, -10, -10, 1), color(1, 1, 1, 1), 10000),
        ]

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        this.model.render(context, program_state);
    }

    add_mouse_controls(canvas) {
        // add_mouse_controls():  Attach HTML mouse events to the drawing canvas.
        const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
            vec(e.clientX - rect.left, e.clientY - rect.top);
        const mouse_ray = (e, rect = canvas.getBoundingClientRect()) => {
            const mouse_x = e.clientX - rect.left;
            const mouse_y = e.clientY - rect.top;
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;

            const x = (2 * mouse_x) / width - 1;
            const y = 1 - (2 * mouse_y) / height;
            const z = 1;
            const ray_nds = vec3(x, y, z);

            const ray_clip = vec4(ray_nds[0], ray_nds[1], -1, 1);

            let ray_eye = Mat4.inverse(this.projection_transform).times(ray_clip);
            ray_eye = vec4(ray_eye[0], ray_eye[1], -1, 0);

            const ray_wor = Mat4.inverse(this.initial_camera_location).times(ray_eye).to3();
            ray_wor.normalize();

            return ray_wor;
        }
        document.addEventListener("mouseup", e => {
            if(this.model.picked) {
                this.v2 = this.model.getMousePointOnPlane(mouse_ray(e), this.model.picked.face, this.camera);

                const vect = this.v2.minus(this.v1);
                const {face, row, col} = this.model.picked;

                const run =
                    face == 'front' ? vect[0] :
                    face == 'top' ? vect[0] :
                    face == 'right' ? -vect[2] :
                    null ;
                const rise =
                    face == 'front' ? vect[1] :
                    face == 'top' ? -vect[2] :
                    face == 'right' ? vect[1] :
                    null ;

                const slope = rise / run;
                const d1 = 2;
                const m = 0.33;

                if(face == 'front') {
                    // left, zero slope
                    if(run < -d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(3, this.model.cube.U);
                        else if(row == 1) this.try_moving(-8, this.model.cube.Ei);
                        else if(row == 2) this.try_moving(-4, this.model.cube.Di);
                    }
                    // right, zero slope
                    else if(run > d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(-3, this.model.cube.Ui);
                        else if(row == 1) this.try_moving(8, this.model.cube.E);
                        else if(row == 2) this.try_moving(4, this.model.cube.D);
                    }
                    // down, large slope
                    if(rise < -d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(5, this.model.cube.L);
                        else if(col == 1) this.try_moving(7, this.model.cube.M);
                        else if(col == 2) this.try_moving(-6, this.model.cube.Ri);
                    }
                    // up, large slope
                    else if(rise > d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(-5, this.model.cube.Li);
                        else if(col == 1) this.try_moving(-7, this.model.cube.Mi);
                        else if(col == 2) this.try_moving(6, this.model.cube.R);
                    }
                } else if(face == 'top') {
                    if(run < -d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(2, this.model.cube.B);
                        else if(row == 1) this.try_moving(-9, this.model.cube.Si);
                        else if(row == 2) this.try_moving(-1, this.model.cube.Fi);
                    }
                    else if(run > d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(-2, this.model.cube.Bi);
                        else if(row == 1) this.try_moving(9, this.model.cube.S);
                        else if(row == 2) this.try_moving(1, this.model.cube.F);
                    }
                    if(rise < -d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(5, this.model.cube.L);
                        else if(col == 1) this.try_moving(7, this.model.cube.M);
                        else if(col == 2) this.try_moving(-6, this.model.cube.Ri);
                    }
                    else if(rise > d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(-5, this.model.cube.Li);
                        else if(col == 1) this.try_moving(-7, this.model.cube.Mi);
                        else if(col == 2) this.try_moving(6, this.model.cube.R);
                    }
                }
                else if(face == 'right') {
                    if(run < -d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(3, this.model.cube.U);
                        else if(row == 1) this.try_moving(-8, this.model.cube.Ei);
                        else if(row == 2) this.try_moving(-4, this.model.cube.Di);
                    }
                    else if(run > d1 && Math.abs(slope) < m) {
                        if(row == 0) this.try_moving(-3, this.model.cube.Ui);
                        else if(row == 1) this.try_moving(8, this.model.cube.E);
                        else if(row == 2) this.try_moving(4, this.model.cube.D);
                    }
                    if(rise < -d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(1, this.model.cube.F);
                        else if(col == 1) this.try_moving(9, this.model.cube.S);
                        else if(col == 2) this.try_moving(-2, this.model.cube.Bi);
                    }
                    else if(rise > d1 && Math.abs(slope) > 1 / m) {
                        if(col == 0) this.try_moving(-1, this.model.cube.Fi);
                        else if(col == 1) this.try_moving(-9, this.model.cube.Si);
                        else if(col == 2) this.try_moving(2, this.model.cube.B);
                    }
                }
            } else {
                // Use mosue to spin the cube
                const secondPressPos = mouse_position(e);
                if(!this.firstPressPos) return;

                const vect = secondPressPos.minus(this.firstPressPos);
                const slope = vect[1] / vect[0];

                const d1 = 100;
                const m = 0.33;
                // left, zero slope
                if(vect[0] < -d1 && Math.abs(slope) < m) {
                    this.try_moving(11, this.model.cube.y);
                }
                // right, zero slope
                else if(vect[0] > d1 && Math.abs(slope) < m) {
                    this.try_moving(-11, this.model.cube.yi);
                }
                // down_left, slope 1 to Infinity
                else if(vect[0] < -d1 / Math.sqrt(2) && vect[1] > d1 / Math.sqrt(2) && Math.abs(slope) > 1 - m) {
                    this.try_moving(-10, this.model.cube.xi);
                }
                // down_right, slope -1 to -Infinity
                else if(vect[0] > d1 / Math.sqrt(2) && vect[1] > d1 / Math.sqrt(2) && Math.abs(slope) > 1 - m) {
                    this.try_moving(12, this.model.cube.z);
                }
                // top_left, slope -1 to -Infinity
                else if(vect[0] < -d1 / Math.sqrt(2) && vect[1] < -d1 / Math.sqrt(2) && Math.abs(slope) > 1 - m) {
                    this.try_moving(-12, this.model.cube.zi);
                }
                // up_right, slope 1 to Infinity
                else if(vect[0] > d1 / Math.sqrt(2) && vect[1] < -d1 / Math.sqrt(2) && Math.abs(slope) > 1 - m) {
                    this.try_moving(10, this.model.cube.x);
                }
            }
        });
        canvas.addEventListener("mousedown", e => {
            e.preventDefault();

            const ray_wor = mouse_ray(e);
            
            this.model.setPicked(ray_wor, this.camera);

            if(this.model.picked)
            this.v1 = this.model.getMousePointOnPlane(ray_wor, this.model.picked.face, this.camera);

            this.firstPressPos = mouse_position(e);
        });
        canvas.addEventListener("mousemove", e => {
            e.preventDefault();
        });
        canvas.addEventListener("mouseout", e => {
            // if (!this.mouse.anchor) this.mouse.from_center.scale_by(0)
            this.firstPressPos = null;
        });
    }
}
