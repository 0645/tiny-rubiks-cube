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
    constructor(cube, materials) {
        this.rotating = 0;
        this.cube = cube;
        this.n = this.cube.n;

        this.faces = ["front", "back", "top", "bottom", "left", "right"];
        this.angles = {
            front: { x: 0, y: 0, z: -Math.PI / 2 },
            back: { x: 0, y: Math.PI, z: -Math.PI / 2 },
            top: { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 },
            bottom: { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
            left: { x: 0, y: -Math.PI / 2, z: -Math.PI / 2 },
            right: { x: 0, y: Math.PI / 2, z: -Math.PI / 2 },
        };

        this.inside = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.render_inside = { front: false, back: false, top: false, bottom: false, left: false, right: false };

        this.stickers = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.transformations = { front: [], back: [], top: [], bottom: [], left: [], right: [] };
        this.faces.forEach((face) => {
            // Generate this.inside
            this.inside[face].push(new Square());
            this.inside[face].push(new Square());

            // Generate this.stickers
            for(let i = 0; i < this.n; i++) {
                const r1 = [];
                const r2 = [];
                for(let j = 0; j < this.n; j++) {
                    r1.push(new Square());
                    r2.push(Mat4.identity());
                }
                this.stickers[face].push(r1);
                this.transformations[face].push(r2);
            }
        });

        this.rotation_buffer = { 
            stickers: { front: [], back: [], top: [], bottom: [], left: [], right: [] },
            inside: { front: {}, back: {}, top: {}, bottom: {}, left: {}, right: {} }
        };
        this.resetRotationBuffer();

        this.materials = materials;
        this.picked = null;
        this.move_buffer = [];
        // this.move_history = [];
    }

    smoothScramble(n) {
        if(!this.rotating) {
            this.move_buffer = this.move_buffer.concat(this.cube.random_moveset(n));
            this.rotating = this.move_buffer.shift();
        }
    }

    solve() {
        if(!this.rotating) {
            this.cube.optimize_move_history();
            this.move_buffer = this.cube.move_history.map(n => -n).reverse();
            this.rotating = this.move_buffer.shift();
            if(this.rotating) this.solving = true;
        }
    }

    setMaterials(materials) {
        this.materials = materials;
    }

    resetRotationBuffer() {
        this.rotation_buffer = { 
            stickers: { front: [], back: [], top: [], bottom: [], left: [], right: [] },
            inside: { front: {}, back: {}, top: {}, bottom: {}, left: {}, right: {} }
        };
        this.faces.forEach((face) => {
            this.rotation_buffer.inside[face] = {x: 0, y: 0, z: 0};
            for(let i = 0; i < this.n; i++) {
                const row = [];
                for(let j = 0; j < this.n; j++) {
                    row.push({x: 0, y: 0, z: 0});
                }
                this.rotation_buffer.stickers[face].push(row);
            }
        });
    }

    getMousePointOnPlane(ray, face, camera) {
        // this.transformations[face][2][2];
        const square = this.stickers[face][2][2];
        const M = this.transformations[face][2][2];

        const normal = M.times(square.arrays.normal[0].to4(false)).to3();
        const point_on_plane = M.times(square.arrays.position[0].to4(true)).to3();

        const t = (normal.dot(point_on_plane) - normal.dot(vec3(camera.x, camera.y, camera.z))) / normal.dot(ray);
        return ray.times(t).plus(vec3(camera.x, camera.y, camera.z));
    }

    setPicked(ray, camera) {
        const hits = (ray, face, i, j, square) => {
            const M = this.transformations[face][i][j];

            let normal = square.arrays.normal[0];
            normal = M.times(normal.to4(false)).to3();
            if(normal.dot(ray) >= 0) {
                return false;
            }
            
            const vertices = square.arrays.position
                .map(arr => arr.to4(true))
                .map(v => M.times(v))
                .map(p => p.to3());

            const t = (normal.dot(vertices[0]) - normal.dot(vec3(camera.x, camera.y, camera.z))) / normal.dot(ray);
            const p = ray.times(t).plus(vec3(camera.x, camera.y, camera.z));

            let angle_sum = 0;
            let lst = [];
            for(let i = 0; i < vertices.length; i++) {
                
                const v1 = vertices[i];
                const v2 = vertices[(i + 1) % vertices.length];

                const p1 = vertices[i].minus(p);
                const p2 = vertices[(i + 1) % vertices.length].minus(p);

                const m1 = p1.norm();
                const m2 = p2.norm();

                if(m1 * m2 > .0000001) {
                    angle_sum += Math.acos(p1.dot(p2) / (m1 * m2));
                    lst.push(Math.acos(p1.dot(p2) / (m1 * m2)));
                }
            }

            const epsilon = 0.001;
            return angle_sum < 2 * Math.PI + epsilon && angle_sum > 2 * Math.PI - epsilon;
        }

        for(let k = 0; k < this.faces.length; k++) {
            const face = this.faces[k];
            for(let i = 0; i < this.n; i++) {
                for(let j = 0; j < this.n; j++) {
                    const square = this.stickers[face][i][j];
                    
                    if(hits(ray, face, i, j, square)) {
                        this.picked = {
                            face,
                            row: i,
                            col: j,
                        };
                        return;
                    }
                }
            }
        }

        this.picked = null;
    }

    updateAngles(program_state) {

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const theta = dt * Math.PI * 1.5;

        const rotate_row = (face, row, dimension, theta) => {
            for(let i = 0; i < this.n; i++) {
                this.rotation_buffer.stickers[face][row][i][dimension] += theta;
            }
        };
        const rotate_col = (face, col, dimension, theta) => {
            for(let i = 0; i < this.n; i++) {
                this.rotation_buffer.stickers[face][i][col][dimension] += theta;
            }
        }
        const rotate_face = (face, dimension, theta, timing = 'linear') => {
            const temp = Math.abs(this.rotation_buffer.stickers[face][0][0][dimension]);
            if(timing == 'ease') theta *=  0.75 * Math.sin(2 * temp) + 0.1;

            for(let i = 0; i < this.n; i++) {
                for(let j = 0; j < this.n; j++) {
                    this.rotation_buffer.stickers[face][i][j][dimension] += theta;
                }
            }
        }
        const rotate_inside = (face, dimension, theta) => {
            this.rotation_buffer.inside[face][dimension] += theta;
        }
        const tasks = (rotating, ...faces) => {
            this.resetRotationBuffer();
            // this.move_history.push(this.rotating);
            if(!rotating && this.solving) {
                this.solving = false;
                this.cube.move_history = [];
            }
            this.rotating = rotating;
            faces.forEach(face => this.render_inside[face] = false);
        }

        switch(this.rotating) {
            case  0:
                return;
            case  1:
                rotate_face('front', 'z', -theta);
                rotate_inside('front', 'z', -theta);
                this.render_inside.front = true;
                rotate_row('top', 2, 'z', -theta);
                rotate_col('right', 0, 'z', -theta);
                rotate_row('bottom', 0, 'z', -theta);
                rotate_col('left', 2, 'z', -theta);
                if(this.rotation_buffer.stickers.front[0][0].z < -Math.PI / 2) {
                    this.cube.F();
                    tasks(this.move_buffer.shift(), 'front');
                }
                break;
            case -1:
                rotate_face('front', 'z', theta);
                rotate_inside('front', 'z', theta);
                this.render_inside.front = true;
                rotate_row('top', 2, 'z', theta);
                rotate_col('right', 0, 'z', theta);
                rotate_row('bottom', 0, 'z', theta);
                rotate_col('left', 2, 'z', theta);
                if(this.rotation_buffer.stickers.front[0][0].z > Math.PI / 2) {
                    this.cube.Fi();
                    tasks(this.move_buffer.shift(), 'front');
                }
                break;
            case  2:
                rotate_face('back', 'z', theta);
                rotate_inside('back', 'z', theta);
                this.render_inside.back = true;
                rotate_row('top', 0, 'z', theta);
                rotate_col('right', 2, 'z', theta);
                rotate_row('bottom', 2, 'z', theta);
                rotate_col('left', 0, 'z', theta);
                if(this.rotation_buffer.stickers.back[0][0].z > Math.PI / 2) {
                    this.cube.B();
                    tasks(this.move_buffer.shift(), 'back');
                }
                break;
            case -2:
                rotate_face('back', 'z', -theta);
                rotate_inside('back', 'z', -theta);
                this.render_inside.back = true;
                rotate_row('top', 0, 'z', -theta);
                rotate_col('right', 2, 'z', -theta);
                rotate_row('bottom', 2, 'z', -theta);
                rotate_col('left', 0, 'z', -theta);
                if(this.rotation_buffer.stickers.back[0][0].z < -Math.PI / 2) {
                    this.cube.Bi();
                    tasks(this.move_buffer.shift(), 'back');
                }
                break;
            case  3:
                rotate_face('top', 'y', -theta);
                rotate_inside('top', 'y', -theta);
                this.render_inside.top = true;
                rotate_row('left', 0, 'y', -theta);
                rotate_row('front', 0, 'y', -theta);
                rotate_row('right', 0, 'y', -theta);
                rotate_row('back', 0, 'y', -theta);
                if(this.rotation_buffer.stickers.top[0][0].y < -Math.PI / 2) {
                    this.cube.U();
                    tasks(this.move_buffer.shift(), 'top');
                }
                break;
            case -3:
                rotate_face('top', 'y', theta);
                rotate_inside('top', 'y', theta);
                this.render_inside.top = true;
                rotate_row('left', 0, 'y', theta);
                rotate_row('front', 0, 'y', theta);
                rotate_row('right', 0, 'y', theta);
                rotate_row('back', 0, 'y', theta);
                if(this.rotation_buffer.stickers.top[0][0].y > Math.PI / 2) {
                    this.cube.Ui();
                    tasks(this.move_buffer.shift(), 'top')
                }
                break;
            case  4:
                rotate_face('bottom', 'y', theta);
                rotate_inside('bottom', 'y', theta);
                this.render_inside.bottom = true;
                rotate_row('left', 2, 'y', theta);
                rotate_row('front', 2, 'y', theta);
                rotate_row('right', 2, 'y', theta);
                rotate_row('back', 2, 'y', theta);
                if(this.rotation_buffer.stickers.bottom[0][0].y > Math.PI / 2) {
                    this.cube.D();
                    tasks(this.move_buffer.shift(), 'bottom');
                }
                break;
            case -4:
                rotate_face('bottom', 'y', -theta);
                rotate_inside('bottom', 'y', -theta);
                this.render_inside.bottom = true;
                rotate_row('left', 2, 'y', -theta);
                rotate_row('front', 2, 'y', -theta);
                rotate_row('right', 2, 'y', -theta);
                rotate_row('back', 2, 'y', -theta);
                if(this.rotation_buffer.stickers.bottom[0][0].y < -Math.PI / 2) {
                    this.cube.Di();
                    tasks(this.move_buffer.shift(), 'bottom')
                }
                break;
            case  5:
                rotate_face('left', 'x', theta);
                rotate_inside('left', 'x', theta);
                this.render_inside.left = true;
                rotate_col('top', 0, 'x', theta);
                rotate_col('front', 0, 'x', theta);
                rotate_col('bottom', 0, 'x', theta);
                rotate_col('back', 2, 'x', theta);
                if(this.rotation_buffer.stickers.left[0][0].x > Math.PI / 2) {
                    this.cube.L();
                    tasks(this.move_buffer.shift(), 'left');
                }
                break;
            case -5:
                rotate_face('left', 'x', -theta);
                rotate_inside('left', 'x', -theta);
                this.render_inside.left = true;
                rotate_col('top', 0, 'x', -theta);
                rotate_col('front', 0, 'x', -theta);
                rotate_col('bottom', 0, 'x', -theta);
                rotate_col('back', 2, 'x', -theta);
                if(this.rotation_buffer.stickers.left[0][0].x < -Math.PI / 2) {
                    this.cube.Li();
                    tasks(this.move_buffer.shift(), 'left');
                }
                break;
            case  6:
                rotate_face('right', 'x', -theta);
                rotate_inside('right', 'x', -theta);
                this.render_inside.right = true;
                rotate_col('top', 2, 'x', -theta);
                rotate_col('front', 2, 'x', -theta);
                rotate_col('bottom', 2, 'x', -theta);
                rotate_col('back', 0, 'x', -theta);
                if(this.rotation_buffer.stickers.right[0][0].x < -Math.PI / 2) {
                    this.cube.R();
                    tasks(this.move_buffer.shift(), 'right');
                }
                break;
            case -6:
                rotate_face('right', 'x', theta);
                rotate_inside('right', 'x', theta);
                this.render_inside.right = true;
                rotate_col('top', 2, 'x', theta);
                rotate_col('front', 2, 'x', theta);
                rotate_col('bottom', 2, 'x', theta);
                rotate_col('back', 0, 'x', theta);
                if(this.rotation_buffer.stickers.right[0][0].x > Math.PI / 2) {
                    this.cube.Ri();
                    tasks(this.move_buffer.shift(), 'right');
                }
                break;
            case 7:
                rotate_inside('left', 'x', theta);
                rotate_inside('right', 'x', theta);
                this.render_inside.left = true;
                this.render_inside.right = true;
                rotate_col('top', 1, 'x', theta);
                rotate_col('front', 1, 'x', theta);
                rotate_col('bottom', 1, 'x', theta);
                rotate_col('back', 1, 'x', theta);
                if(this.rotation_buffer.stickers.top[1][1].x > Math.PI / 2) {
                    this.cube.M();
                    tasks(this.move_buffer.shift(), 'left', 'right');
                }
                break;
            case -7:
                rotate_inside('left', 'x', -theta);
                rotate_inside('right', 'x', -theta);
                this.render_inside.left = true;
                this.render_inside.right = true;
                rotate_col('top', 1, 'x', -theta);
                rotate_col('front', 1, 'x', -theta);
                rotate_col('bottom', 1, 'x', -theta);
                rotate_col('back', 1, 'x', -theta);
                if(this.rotation_buffer.stickers.top[1][1].x < -Math.PI / 2) {
                    this.cube.Mi();
                    tasks(this.move_buffer.shift(), 'left', 'right');
                }
                break;
            case 8:
                rotate_inside('top', 'y', theta);
                rotate_inside('bottom', 'y', theta);
                this.render_inside.top = true;
                this.render_inside.bottom = true;
                rotate_row('left', 1, 'y', theta);
                rotate_row('front', 1, 'y', theta);
                rotate_row('right', 1, 'y', theta);
                rotate_row('back', 1, 'y', theta);
                if(this.rotation_buffer.stickers.left[1][1].y > Math.PI / 2) {
                    this.cube.E();
                    tasks(this.move_buffer.shift(), 'top', 'bottom');
                }
                break;
            case -8:
                rotate_inside('top', 'y', -theta);
                rotate_inside('bottom', 'y', -theta);
                this.render_inside.top = true;
                this.render_inside.bottom = true;
                rotate_row('left', 1, 'y', -theta);
                rotate_row('front', 1, 'y', -theta);
                rotate_row('right', 1, 'y', -theta);
                rotate_row('back', 1, 'y', -theta);
                if(this.rotation_buffer.stickers.left[1][1].y < -Math.PI / 2) {
                    this.cube.Ei();
                    tasks(this.move_buffer.shift(), 'top', 'bottom');
                }
                break;
            case 9:
                rotate_inside('front', 'z', -theta);
                rotate_inside('back', 'z', -theta);
                this.render_inside.front = true;
                this.render_inside.back = true;
                rotate_row('top', 1, 'z', -theta);
                rotate_col('right', 1, 'z', -theta);
                rotate_row('bottom', 1, 'z', -theta);
                rotate_col('left', 1, 'z', -theta);
                if(this.rotation_buffer.stickers.top[1][1].z < -Math.PI / 2) {
                    this.cube.S();
                    tasks(this.move_buffer.shift(), 'front', 'back');
                }
                break;
            case -9:
                rotate_inside('front', 'z', theta);
                rotate_inside('back', 'z', theta);
                this.render_inside.front = true;
                this.render_inside.back = true;
                rotate_row('top', 1, 'z', theta);
                rotate_col('right', 1, 'z', theta);
                rotate_row('bottom', 1, 'z', theta);
                rotate_col('left', 1, 'z', theta);
                if(this.rotation_buffer.stickers.top[1][1].z > Math.PI / 2) {
                    this.cube.Si();
                    tasks(this.move_buffer.shift(), 'front', 'back');
                }
                break;
            case 10:
                this.faces.forEach(face => rotate_face(face, 'x', -theta, 'ease'));
                if(this.rotation_buffer.stickers.right[0][0].x < -Math.PI / 2) {
                    this.cube.x();
                    tasks(this.move_buffer.shift());
                }
                break;
            case -10:
                this.faces.forEach(face => rotate_face(face, 'x', theta, 'ease'));
                if(this.rotation_buffer.stickers.right[0][0].x > Math.PI / 2) {
                    this.cube.xi();
                    tasks(this.move_buffer.shift());
                }
                break;
            case 11:
                this.faces.forEach(face => rotate_face(face, 'y', -theta, 'ease'));
                if(this.rotation_buffer.stickers.top[0][0].y < -Math.PI / 2) {
                    this.cube.y();
                    tasks(this.move_buffer.shift());
                }
                break;
            case -11:
                this.faces.forEach(face => rotate_face(face, 'y', theta, 'ease'));
                if(this.rotation_buffer.stickers.top[0][0].y > Math.PI / 2) {
                    this.cube.yi();
                    tasks(this.move_buffer.shift());
                }
                break;
            case 12:
                this.faces.forEach(face => rotate_face(face, 'z', -theta, 'ease'));
                if(this.rotation_buffer.stickers.front[0][0].z < -Math.PI / 2) {
                    this.cube.z();
                    tasks(this.move_buffer.shift());
                }
                break;
            case -12:
                this.faces.forEach(face => rotate_face(face, 'z', theta, 'ease'));
                if(this.rotation_buffer.stickers.front[0][0].z > Math.PI / 2) {
                    this.cube.zi();
                    tasks(this.move_buffer.shift());
                }
                break;
        }
    }

    render(context, program_state) {
        this.updateAngles(program_state);
        this.faces.forEach((face) => {
            const x_rotate = Mat4.rotation(this.angles[face].x, 1, 0, 0);
            const y_rotate = Mat4.rotation(this.angles[face].y, 0, 1, 0);
            const z_rotate = Mat4.rotation(this.angles[face].z, 0, 0, 1);
            const base_transform = x_rotate.times(y_rotate).times(z_rotate).times(Mat4.translation(0, 0, 3));
            if(this.render_inside[face]) {
                const inside_transform = Mat4.translation(0, 0, -2).times(Mat4.scale(3, 3, 3));
                const angle = this.rotation_buffer.inside[face].x + this.rotation_buffer.inside[face].y + this.rotation_buffer.inside[face].z;
                let init_rotation = null;
                if(!angle) {
                    init_rotation = Mat4.identity();
                } else {
                    init_rotation = Mat4.rotation(angle, Math.abs(this.rotation_buffer.inside[face].x), Math.abs(this.rotation_buffer.inside[face].y), Math.abs(this.rotation_buffer.inside[face].z));
                }
                this.inside[face][0].draw(context, program_state, base_transform.times(inside_transform), this.materials.inside);
                this.inside[face][1].draw(context, program_state, init_rotation.times(base_transform).times(inside_transform), this.materials.inside);
            }
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    const translation = Mat4.translation(2 * (i - 1), 2 * (j - 1), 0);
                    const angle = this.rotation_buffer.stickers[face][i][j].x + this.rotation_buffer.stickers[face][i][j].y + this.rotation_buffer.stickers[face][i][j].z;
                    let init_rotation = null;
                    if(!angle) {
                        init_rotation = Mat4.identity();
                    } else {
                        init_rotation = Mat4.rotation(angle, Math.abs(this.rotation_buffer.stickers[face][i][j].x), Math.abs(this.rotation_buffer.stickers[face][i][j].y), Math.abs(this.rotation_buffer.stickers[face][i][j].z));
                    }
                    const sticker_rotation = Mat4.rotation(this.cube[face].grid[i][j].angle * -Math.PI / 2, 0, 0, 1);
                    this.stickers[face][i][j].draw(context, program_state, init_rotation.times(base_transform).times(translation).times(sticker_rotation), this.materials[this.cube[face].grid[i][j].image]);
                    this.transformations[face][i][j] = init_rotation.times(base_transform).times(translation).times(sticker_rotation);
                }
            }
        });
    }
}