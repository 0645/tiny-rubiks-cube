import {defs, tiny} from './examples/common.js';
import {rubiks} from './rubiks.js';
import {model} from './model.js';
import {textures} from './textures.js';
import {info} from './information.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Square, Cube, Axis_Arrows, Basic_Shader, Phong_Shader, Textured_Phong} = defs;

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
        this.texture = "basic_look";
        this.smoothRotations = true;

        this.camera = {
            x: 10,
            y: 10,
            z: 15,
        };
        this.initial_camera_location = Mat4.look_at(vec3(this.camera.x, this.camera.y, this.camera.z), vec3(0, 0, 0), vec3(0, 1, 0));
        // this.initial_camera_location = Mat4.look_at(vec3(0, 0, 10), vec3(0, 0, 0), vec3(0, 1, 0));
        
        this.mouse_enabled_canvases = new Set();

        this.showAxis = false;
        this.axis = new Axis_Arrows();
        this.axis_material = new Material(new Textured_Phong(), { color: hex_color("#ffff00") });
        
        this.background = new Square();
        this.background_material = new Material(new Textured_Phong(), { 
            color: hex_color("#2774AE"),
            texture: new Texture("assets/cb_white.png", "NEAREST"),
            ambient: 0.25, diffusivity: 1, specularity: 0,
        });
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
            this.key_triggered_button(description, shortcut_combination, () => {
                this.try_moving(rotate_number, rotate_function);
            });
        };
        makeMoveButton("L", ["l"], 5, this.model.cube.L); makeMoveButton("L'", ["Shift", "L"], -5, this.model.cube.Li);
        makeMoveButton("R", ["r"], 6, this.model.cube.R); makeMoveButton("R'", ["Shift", "R"], -6, this.model.cube.Ri);
        makeMoveButton("M", ["m"], 7, this.model.cube.M); makeMoveButton("M'", ["Shift", "M"], -7, this.model.cube.Mi);
        this.new_line();
        makeMoveButton("U", ["u"], 3, this.model.cube.U); makeMoveButton("U'", ["Shift", "U"], -3, this.model.cube.Ui);
        makeMoveButton("D", ["d"], 4, this.model.cube.D); makeMoveButton("D'", ["Shift", "D"], -4, this.model.cube.Di);
        makeMoveButton("E", ["e"], 8, this.model.cube.E); makeMoveButton("E'", ["Shift", "E"], -8, this.model.cube.Ei);
        this.new_line();
        makeMoveButton("F", ["f"], 1, this.model.cube.F); makeMoveButton("F'", ["Shift", "F"], -1, this.model.cube.Fi);
        makeMoveButton("B", ["b"], 2, this.model.cube.B); makeMoveButton("B'", ["Shift", "B"], -2, this.model.cube.Bi);
        makeMoveButton("S", ["s"], 9, this.model.cube.S); makeMoveButton("S'", ["Shift", "S"], -9, this.model.cube.Si);
        this.new_line();
        makeMoveButton("x", ["x"], 10, this.model.cube.x); makeMoveButton("x'", ["Shift", "X"], -10, this.model.cube.xi);
        makeMoveButton("y", ["y"], 11, this.model.cube.y); makeMoveButton("y'", ["Shift", "Y"], -11, this.model.cube.yi);
        makeMoveButton("z", ["z"], 12, this.model.cube.z); makeMoveButton("z'", ["Shift", "Z"], -12, this.model.cube.zi);
        this.new_line();
        this.new_line();
        this.key_triggered_button("Scramble", ["-"], () => {
            if(!this.smoothRotations && !this.model.rotating) {
                this.model.cube.scramble(20);
            } else if(!this.model.rotating) {
                this.model.smoothScramble(20);
            }
        });
        this.key_triggered_button("Solve", ["+"], () => {
            if(!this.smoothRotations && !this.model.rotating) {
                this.model.cube = new Rubiks(3);
            } else if(!this.model.rotating) {
                this.model.solve();
            }
        });
        this.key_triggered_button("Toggle axis", ["a"], () => this.showAxis = !this.showAxis);
        this.key_triggered_button("Toggle smooth rotations", ["t"], () => {
            if(this.model.rotating || this.model.cube.rotating)
                return;
            else
                this.smoothRotations = !this.smoothRotations;
        });
        this.new_line();
        this.new_line();

        this.key_triggered_button("Basic Look", ["1"], () => {
            this.model.setMaterials(textures.basic_look);
            this.texture = "basic_look";
        });
        this.key_triggered_button("Light Mode", ["2"], () => {
            this.model.setMaterials(textures.light_mode);
            this.texture = "light_mode";
        });
        this.key_triggered_button("Stickerless", ["3"], () => {
            this.model.setMaterials(textures.stickerless);
            this.texture = "stickerless";
        });
        this.new_line();

        this.key_triggered_button("Electric Glow", ["4"], () => {
            this.model.setMaterials(textures.electric_glow);
            this.texture = "electric_glow";
        });
        this.key_triggered_button("Sheperd's Cube", ["5"], () => {
            this.model.setMaterials(textures.sheperds_cube);
            this.texture = "sheperds_cube";
        });
        this.key_triggered_button("Colorblind", ["6"], () => {
            this.model.setMaterials(textures.colorblind);
            this.texture = "colorblind";
        });
        this.new_line();

        this.key_triggered_button("Blindfolded", ["7"], () => {
            this.model.setMaterials(textures.dodo);
            this.texture = "dodo";
        });
        this.key_triggered_button("Alvin's Cube", ["8"], () => {
            this.model.setMaterials(textures.alvins_cube);
            this.texture = "alvins_cube";
        });
        this.key_triggered_button("Disco", ["9"], () => {
            this.model.setMaterials(textures.disco);
            this.texture = "disco";
        });
    }

    display(context, program_state) {
        if (!this.mouse_enabled_canvases.has(context.canvas)) {
            this.add_mouse_controls(context.canvas);
            this.mouse_enabled_canvases.add(context.canvas);
        }

        if (!context.scratchpad.controls) {
            // this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            this.children.push(context.scratchpad.controls = new info.Information(this.model, this.smoothRotations, this.showAxis, this.texture));
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        } else {
            this.children[0].smoothRotations = this.smoothRotations;
            this.children[0].showAxis = this.showAxis;
            this.children[0].texture = this.texture;
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);
        this.projection_transform = program_state.projection_transform;

        program_state.lights = [
            new Light(vec4(10, 8, 0, 1), color(1, 1, 1, 1), 150),
            new Light(vec4(0, 8, 10, 1), color(1, 1, 1, 1), 150),
        ]

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        this.model.render(context, program_state);
        if(this.showAxis) this.axis.draw(context, program_state, Mat4.scale(5, 5, 5), this.axis_material);

        let background_transform = Mat4.identity();
        background_transform = background_transform.times(Mat4.translation(-5, -5, -5));
        background_transform = background_transform.times(Mat4.rotation(Math.atan(this.camera.x / this.camera.z), 0, 1, 0));
        background_transform = background_transform.times(Mat4.rotation(Math.atan(- this.camera.y / this.camera.z), 1, 0, 0));
        background_transform = background_transform.times(Mat4.scale(25, 25, 25));
        this.background.draw(context, program_state, background_transform, this.background_material);
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
            this.model.picked = null;
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
            this.model.picked = null;
        });
    }
}
