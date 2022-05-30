import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const info = {};

export {info};

const Information = info.Information =
    class Information extends Scene {
        constructor(model, smoothRotations, showAxis, texture) {
            super();
            this.model = model;
            this.smoothRotations = smoothRotations;
            this.showAxis = showAxis;
            this.texture = texture;
        }

        show_explanation(document_element) {
            document_element.innerHTML += `<h1><center>Tiny Rubik's Cube</center></h1>`;
        }

        changeColor() {
            
        }

        sticker_button(face, i, j, callback, color, release_event) {
            const color_map = {
                white: '#ffffff',
                yellow: '#ffd500',
                blue: '#0064fa',
                green: '#00e86c',
                orange: '#ff8b4d',
                red: '#ff0606'
            };

            const button = this.control_panel.appendChild(document.createElement("button"));
            Object.assign(button.style, {
                'background-color': color,
                'padding': '0.5rem',
                'margin': '0',
                'border-radius': '1px',
                'border-color': 'black'
            });
            const press = () => {
                Object.assign(button.style, {
                    'z-index': "1", 'transform': "scale(1.5)"
                });
                callback.call(this);
            },
            release = () => {
                Object.assign(button.style, {
                    'z-index': "0", 'transform': "scale(1)"
                });
                if (!release_event) return;
                (() => {
                    switch(this.model.cube[face].grid[i][j].image) {
                        case 'white': this.model.cube[face].grid[i][j].image = 'yellow'; break;
                        case 'yellow': this.model.cube[face].grid[i][j].image = 'blue'; break;
                        case 'blue': this.model.cube[face].grid[i][j].image = 'green'; break;
                        case 'green': this.model.cube[face].grid[i][j].image = 'orange'; break;
                        case 'orange': this.model.cube[face].grid[i][j].image = 'red'; break;
                        case 'red': this.model.cube[face].grid[i][j].image = 'white'; break;
                    }
                }).call(this);
            };
            button.addEventListener("mousedown", press);
            button.addEventListener("mouseup", release);

            button.className = "live_string";
            button.onload = () => {
                button.style['background-color'] = color_map[this.model.cube[face].grid[i][j].image];
            };
        }

        printFlatCube() {
            const addIndent = (n) => {
                const indent = this.control_panel.appendChild(document.createElement("span"));
                indent.style['padding-left'] = n;
                indent.style['padding-right'] = n;
            }

            // Print top face
            for(let i = 0; i < this.model.n; i++) {
                addIndent('1.87rem');
                for(let j = 0; j < this.model.n; j++) {
                    this.sticker_button('top', i, j, () => {}, this.model.cube['top'].grid[i][j].image, () => {});
                }
                addIndent('4.7rem');
                if(i == 1) {
                    this.live_string(box => box.textContent = `is_solved = ${this.model.cube.isSolved(false)}`);
                }
                else if(i == 2) {
                    this.live_string(box => box.textContent = `mouse_picking = ${this.model.picked ? this.model.picked.face
                        + '[' + this.model.picked.row + ']'
                        + '[' + this.model.picked.col + ']'
                        : 'N/A'}`);
                }
                this.new_line();
            }

            // Print left, front, right, and back faces
            const faces = ['left', 'front', 'right', 'back'];
            for(let i = 0; i < this.model.n; i++) {
                faces.forEach((face) => {
                    for(let j = 0; j < this.model.n; j++) {
                        this.sticker_button(face, i, j, () => {}, this.model.cube[face].grid[i][j].image, () => {});
                        if(face == 'back' && i == 0 && j == 2) {
                            addIndent('0.95rem');
                            const arr = ['N/A', 'Front', 'Back', 'Up', 'Down', 'Left', 'Right', 'Middle', 'Equator', 'Standing', 'x-Axis', 'y-Axis', 'z-Axis'];
                            this.live_string(box => box.textContent = `rotating = ${this.model.rotating ?
                                (arr[Math.abs(this.model.rotating)]) + ' (' + (arr[Math.abs(this.model.rotating)][0]) +(this.model.rotating > 0 ? ")" : "')") :
                                'N/A'}`);
                        } else if (face == 'back' && i == 1 && j == 2) {
                            addIndent('0.95rem');
                            this.live_string(box => box.textContent = `showing_axis = ${this.showAxis}`);
                        } else if (face == 'back' && j == 2) {
                            addIndent('0.95rem');
                            this.live_string(box => box.textContent = `smooth_rotations = ${this.smoothRotations}`);
                        }
                    }
                })
                this.new_line();
            }

            // Print bottom face
            for(let i = 0; i < this.model.n; i++) {
                addIndent('1.87rem');
                for(let j = 0; j < this.model.n; j++) {
                    this.sticker_button('bottom', i, j, () => {}, this.model.cube['bottom'].grid[i][j].image, () => {});
                }
                addIndent('4.7rem');
                if(i == 0) {
                    this.live_string(box => box.textContent = `texture = ${this.texture}`);
                }
                else if(i == 1) {
                    this.live_string(box => box.textContent = `valid_puzzle = ${this.model.cube.isValidPuzzle()}`);
                }
                this.new_line();
            }
        }

        make_control_panel() {
            this.control_panel.style['line-height'] = .9;
            this.new_line();

            this.printFlatCube();
            this.new_line();
            this.new_line();

            this.live_string(box => box.textContent = `Tiny Rubik's Cube is a UCLA COM SCI 174A project created by:`);
            this.new_line();
            this.new_line();

            this.live_string(box => box.textContent = `Alvin Nguyen, Anish Prakriya, and Victor Lee`);
        }

        display() {}
    }