import {defs, tiny} from './examples/common.js';
import {rubiks} from './rubiks.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Square, Cube, Axis_Arrows, Textured_Phong} = defs;
const {Rubiks} = rubiks;

const model = {};

export {model};

const Model = model.Model = class Model {
    constructor(n, Shader) {
        this.n = n;
        this.rotating = 0;
        this.cube = new Rubiks(n);

        this.faces = ["front", "back", "top", "bottom", "left", "right"];
        this.angles = {
            front: { x: 0, y: 0, z: -Math.PI / 2 },
            back: { x: 0, y: Math.PI, z: -Math.PI / 2 },
            top: { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 },
            bottom: { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
            left: { x: 0, y: -Math.PI / 2, z: -Math.PI / 2 },
            right: { x: 0, y: Math.PI / 2, z: -Math.PI / 2 },
        }

        // this.inside = {};
        this.stickers = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.faces.forEach((face) => {
            // Generate this.inside
            // this.inside[face] = new Square();

            // Generate this.stickers
            for(let i = 0; i < this.n; i++) {
                const row = [];
                for(let j = 0; j < this.n; j++) {
                    row.push(new Square());
                }
                this.stickers[face].push(row);
            }
        });

        this.rotation_buffer = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.resetRotationBuffer();

        this.materials = {
            temp: new Material(new Shader(), { color: hex_color("#ffffff"), }),
            inside: new Material(new Shader(), { color: hex_color("#000000"), }),
            white: new Material(new Shader(), { color: hex_color("#ffffff"), }),
            yellow: new Material(new Shader(), { color: hex_color("#ffff00"), }),
            blue: new Material(new Shader(), { color: hex_color("#0000ff"), }),
            green: new Material(new Shader(), { color: hex_color("#00ff00"), }),
            orange: new Material(new Shader(), { color: hex_color("#ff8000"), }),
            red: new Material(new Shader(), { color: hex_color("#ff0000"), }),
        };
    }

    resetRotationBuffer() {
        this.rotation_buffer = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.faces.forEach((face) => {
            for(let i = 0; i < this.n; i++) {
                const row = [];
                for(let j = 0; j < this.n; j++) {
                    row.push({x: 0, y: 0, z: 0});
                }
                this.rotation_buffer[face].push(row);
            }
        });
    }

    updateAngles(program_state) {

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const theta = dt * Math.PI * 1.5;

        const rotate_row = (face, row, dimension, theta) => {
            for(let i = 0; i < this.n; i++) {
                this.rotation_buffer[face][row][i][dimension] += theta;
            }
        };
        const rotate_col = (face, col, dimension, theta) => {
            for(let i = 0; i < this.n; i++) {
                this.rotation_buffer[face][i][col][dimension] += theta;
            }
        }
        const rotate_face = (face, dimension, theta) => {
            for(let i = 0; i < this.n; i++) {
                for(let j = 0; j < this.n; j++) {
                    this.rotation_buffer[face][i][j][dimension] += theta;
                }
            }
        }

        switch(this.rotating) {
            case  0:
                return;
            case  1:
                rotate_face('front', 'z', -theta);
                rotate_row('top', 2, 'z', -theta);
                rotate_col('right', 0, 'z', -theta);
                rotate_row('bottom', 0, 'z', -theta);
                rotate_col('left', 2, 'z', -theta);
                if(this.rotation_buffer.front[0][0].z < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.F();
                    this.rotating = 0;
                }
                break;
            case -1:
                rotate_face('front', 'z', theta);
                rotate_row('top', 2, 'z', theta);
                rotate_col('right', 0, 'z', theta);
                rotate_row('bottom', 0, 'z', theta);
                rotate_col('left', 2, 'z', theta);
                if(this.rotation_buffer.front[0][0].z > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Fi();
                    this.rotating = 0;
                }
                break;
            case  2:
                rotate_face('back', 'z', theta);
                rotate_row('top', 0, 'z', theta);
                rotate_col('right', 2, 'z', theta);
                rotate_row('bottom', 2, 'z', theta);
                rotate_col('left', 0, 'z', theta);
                if(this.rotation_buffer.back[0][0].z > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.B();
                    this.rotating = 0;
                }
                break;
            case -2:
                rotate_face('back', 'z', -theta);
                rotate_row('top', 0, 'z', -theta);
                rotate_col('right', 2, 'z', -theta);
                rotate_row('bottom', 2, 'z', -theta);
                rotate_col('left', 0, 'z', -theta);
                if(this.rotation_buffer.back[0][0].z < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Bi();
                    this.rotating = 0;
                }
                break;
            case  3:
                rotate_face('top', 'y', -theta);
                rotate_row('left', 0, 'y', -theta);
                rotate_row('front', 0, 'y', -theta);
                rotate_row('right', 0, 'y', -theta);
                rotate_row('back', 0, 'y', -theta);
                if(this.rotation_buffer.top[0][0].y < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.U();
                    this.rotating = 0;
                }
                break;
            case -3:
                rotate_face('top', 'y', theta);
                rotate_row('left', 0, 'y', theta);
                rotate_row('front', 0, 'y', theta);
                rotate_row('right', 0, 'y', theta);
                rotate_row('back', 0, 'y', theta);
                if(this.rotation_buffer.top[0][0].y > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Ui();
                    this.rotating = 0;
                }
                break;
            case  4:
                rotate_face('bottom', 'y', theta);
                rotate_row('left', 2, 'y', theta);
                rotate_row('front', 2, 'y', theta);
                rotate_row('right', 2, 'y', theta);
                rotate_row('back', 2, 'y', theta);
                if(this.rotation_buffer.bottom[0][0].y > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.D();
                    this.rotating = 0;
                }
                break;
            case -4:
                rotate_face('bottom', 'y', -theta);
                rotate_row('left', 2, 'y', -theta);
                rotate_row('front', 2, 'y', -theta);
                rotate_row('right', 2, 'y', -theta);
                rotate_row('back', 2, 'y', -theta);
                if(this.rotation_buffer.bottom[0][0].y < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Di();
                    this.rotating = 0;
                }
                break;
            case  5:
                rotate_face('left', 'x', theta);
                rotate_col('top', 0, 'x', theta);
                rotate_col('front', 0, 'x', theta);
                rotate_col('bottom', 0, 'x', theta);
                rotate_col('back', 2, 'x', theta);
                if(this.rotation_buffer.left[0][0].x > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.L();
                    this.rotating = 0;
                }
                break;
            case -5:
                rotate_face('left', 'x', -theta);
                rotate_col('top', 0, 'x', -theta);
                rotate_col('front', 0, 'x', -theta);
                rotate_col('bottom', 0, 'x', -theta);
                rotate_col('back', 2, 'x', -theta);
                if(this.rotation_buffer.left[0][0].x < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Li();
                    this.rotating = 0;
                }
                break;
            case  6:
                rotate_face('right', 'x', -theta);
                rotate_col('top', 2, 'x', -theta);
                rotate_col('front', 2, 'x', -theta);
                rotate_col('bottom', 2, 'x', -theta);
                rotate_col('back', 0, 'x', -theta);
                if(this.rotation_buffer.right[0][0].x < -Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.R();
                    this.rotating = 0;
                }
                break;
            case -6:
                rotate_face('right', 'x', theta);
                rotate_col('top', 2, 'x', theta);
                rotate_col('front', 2, 'x', theta);
                rotate_col('bottom', 2, 'x', theta);
                rotate_col('back', 0, 'x', theta);
                if(this.rotation_buffer.right[0][0].x > Math.PI / 2) {
                    this.resetRotationBuffer();
                    this.cube.Ri();
                    this.rotating = 0;
                }
                break;
        }
    }

    render(context, program_state) {
        this.updateAngles(program_state);
        this.faces.forEach((face) => {
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    const x_rotate = Mat4.rotation(this.angles[face].x, 1, 0, 0);
                    const y_rotate = Mat4.rotation(this.angles[face].y, 0, 1, 0);
                    const z_rotate = Mat4.rotation(this.angles[face].z, 0, 0, 1);
                    const base_transform = x_rotate.times(y_rotate).times(z_rotate).times(Mat4.translation(0, 0, 3));
                    const translation = Mat4.translation(2 * (i - 1), 2 * (j - 1), 0);
                    const angle = this.rotation_buffer[face][i][j].x + this.rotation_buffer[face][i][j].y + this.rotation_buffer[face][i][j].z;
                    let init_rotation = null;
                    if(!angle) {
                        init_rotation = Mat4.identity();
                    } else {
                        init_rotation = Mat4.rotation(angle, Math.abs(this.rotation_buffer[face][i][j].x), Math.abs(this.rotation_buffer[face][i][j].y), Math.abs(this.rotation_buffer[face][i][j].z));
                    }
                    this.stickers[face][i][j].draw(context, program_state, init_rotation.times(base_transform).times(translation), this.materials[this.cube[face].grid[i][j].image]);
                }
            }
        });
    }
}