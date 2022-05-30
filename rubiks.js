const rubiks = {}

export {rubiks};

const Face = rubiks.Face = class Face {
    constructor(n, image, angle = 0) {
        this.n = n;
        this.grid = [];
        for(let i = 0; i < this.n; i++) {
            const row = [];
            for(let j = 0; j < this.n; j++) {
                row.push({image, angle: angle % 4});
            }
            this.grid.push(row);
        }
    }

    get_row(row) {
        return this.grid[row];
    }

    get_col(col) {
        const result = [];
        for(let i = 0; i < this.n; i++) {
            result.push(this.grid[i][col]);
        }
        return result;
    }

    replace_row(row, arr, theta = 0) {
        this.grid[row] = arr;
        for(let i = 0; i < this.n; i++) {
            this.grid[row][i].angle += theta;
            this.grid[row][i].angle %= 4;
        }
    }

    replace_col(col, arr, theta = 0) {
        for(let i = 0; i < this.n; i++) {
            this.grid[i][col] = arr[i];
            this.grid[i][col].angle += theta;
            this.grid[i][col].angle %= 4;
        }
    }

    replace_top(arr, theta = 0) {
        this.replace_row(0, arr, theta);
    }

    replace_bottom(arr, theta = 0) {
        this.replace_row(this.n - 1, arr, theta);
    }

    replace_left(arr, theta = 0) {
        this.replace_col(0, arr, theta);
    }

    replace_right(arr, theta = 0) {
        this.replace_col(this.n - 1, arr, theta);
    }

    replace_middle_row(arr, theta = 0) {
        this.replace_row(Math.floor(this.n / 2), arr, theta);
    }

    replace_middle_col(arr, theta = 0) {
        this.replace_col(Math.floor(this.n / 2), arr, theta);
    }

    replace_top_two(arr1, arr2, theta = 0) {
        this.replace_row(0, arr1, theta);
        this.replace_row(1, arr2, theta);
    }

    replace_bottom_two(arr1, arr2, theta = 0) {
        this.replace_row(this.n - 1, arr1, theta);
        this.replace_row(this.n - 2, arr2, theta);
    }

    replace_left_two(arr1, arr2, theta = 0) {
        this.replace_col(0, arr1, theta);
        this.replace_col(1, arr2, theta);
    }

    replace_right_two(arr1, arr2, theta = 0) {
        this.replace_col(this.n - 1, arr1, theta);
        this.replace_col(this.n - 2, arr2, theta);
    }

    rotate_clockwise() {
        const result = this.grid;
        
        // Change angles
        for(let i = 0; i < this.n; i++) {
            for(let j = 0; j < this.n; j++) {
                result[i][j].angle++;
                result[i][j].angle %= 4;
            }
        }

        // Transpose
        for(let i = 0; i < this.n / 2; i++) {
            for(let j = 0; j < this.n / 2; j++) {
                const temp = result[i][j];
                result[i][j] = result[this.n - 1 - j][this.n - 1 - i];
                result[this.n - 1 - j][this.n - 1 - i] = temp;
            }
        }

        // Reverse each row
        for(let i = 0; i < this.n / 2; i++) {
            const temp = result[i];
            result[i] = result[this.n - 1 - i];
            result[this.n - 1 - i] = temp;
        }

        this.grid = result;
    }

    rotate_counterclockwise() {
        this.rotate_clockwise();
        this.rotate_clockwise();
        this.rotate_clockwise();
    }

    rotate_twice() {
        this.rotate_clockwise();
        this.rotate_clockwise();
    }

    isSolved(superface) {
        const image = this.grid[0][0].image;

        for(let i = 0; i < this.n; i++) {
            for(let j = 0; j < this.n; j++) {
                if(this.grid[i][j].image != image) {
                    return false;
                }
            }
        }

        if(superface) {
            const angle = this.grid[0][0].angle;
            for(let i = 0; i < this.n; i++) {
                for(let j = 0; j < this.n; j++) {
                    if(this.grid[i][j].angle != angle) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
}

const Rubiks = rubiks.Rubiks = class Rubiks {
    // TODO: Supercube angle bugs (scramble) the cube first
    constructor(n) {
        this.n = n;
        this.front = new Face(n, 'white', 0);
        this.back = new Face(n, 'yellow', 2);
        this.top = new Face(n, 'blue', 1);
        this.bottom = new Face(n, 'green', 3);
        this.left = new Face(n, 'orange', 3);
        this.right = new Face(n, 'red', 3);

        this.move_history = [];
    }

    move(n) {
        const obj = {
            "1": this.F, "-1": this.Fi, "2": this.B, "-2": this.Bi,
            "3": this.U, "-3": this.Ui, "4": this.D, "-4": this.Di,
            "5": this.L, "-5": this.Li, "6": this.R, "-6": this.Ri,
            "7": this.M, "-7": this.Mi, "8": this.E, "-8": this.Ei, "9": this.S, "-9": this.Si,
            "10": this.x, "-10": this.xi,
            "11": this.y, "-11": this.yi,
            "12": this.z, "-12": this.zi,
        };
        obj[n].bind(this)();
    }

    random_moveset(n) {
        let count = 0;
        const result = [];
        while(count < n) {
            const move = Math.floor(Math.random() * 19) - 9;
            const last = result.length - 1;
            if(move != 0 && (count == 0 || result[last] != -move)) {
                result.push(move);
                count++;
            }
        }
        return result;
    }

    scramble(n) {
        const moveset = this.random_moveset(n);
        for(let i = 0; i < n; i++) {
            this.move(moveset[i]);
        }
        console.log(this.move_history);
    }

    isSolved(supercube) {
        let result = true;

        const faces = ["front", "back", "top", "bottom", "left", "right"];
        
        faces.forEach(face => { result = result && this[face].isSolved(supercube) });

        return result;
    }

    optimize_move_history() {
        let count = 0;

        // Remove spins at the beginning of the move history
        while(this.move_history.length != 0 && Math.abs(this.move_history[0]) >= 10) {
            this.move_history.shift();
        }

        // Replace 3 consecutive moves with an inverted move.
        const arr1 = [];
        for(let i = 0; i < this.move_history.length; i++) {
            if(i + 2 < this.move_history.length && this.move_history[i] == this.move_history[i+1] && this.move_history[i+1] == this.move_history[i+2]) {
                arr1.push(-this.move_history[i]);
                count++;
                i += 2;
            } else {
                arr1.push(this.move_history[i]);
            }
        }

        // Delete moves followed by their inverse
        const arr2 = [];
        for(let i = 0; i < arr1.length; i++) {
            if(i + 1 >= arr1.length || arr1[i] != -arr1[i+1]) {
                arr2.push(arr1[i]);
            } else {
                count++
                i++;
            }
        }

        // Replace move triplets that make a spin with that spin
        const arr3 = [];
        for(let i = 0; i < arr2.length; i++) {
            if(i + 2 >= arr2.length) {
                arr3.push(arr2[i]);
            } else {
                const [a, b, c] = [arr2[i], arr2[i+1], arr2[i+2]].sort((a, b) => Math.abs(a) - Math.abs(b));
                let replaced = true;

                if(a == -5 && b == 6 && c == -7) arr3.push(10);
                else if(a == 5 && b == -6 && c == 7) arr3.push(-10);
                else if(a == 3 && b == -4 && c == -8) arr3.push(11);
                else if(a == -3 && b == 4 && c == 8) arr3.push(-11);
                else if(a == 1 && b == -2 && c == 9) arr3.push(12);
                else if(a == -1 && b == 2 && c == -9) arr3.push(-12);
                else replaced = false;

                if(replaced) i += 2;
                else arr3.push(arr2[i]);
            }
        }

        this.move_history = arr3;
        if(count != 0) this.optimize_move_history();
    }

    F() {
        this.front.rotate_clockwise();

        const a = this.top.get_row(this.n - 1);
        const b = this.right.get_col(0);
        const c = this.bottom.get_row(0);
        const d = this.left.get_col(this.n - 1);

        this.right.replace_left(a, 1);
        this.bottom.replace_top(b.reverse(), 1);
        this.left.replace_right(c, 1);
        this.top.replace_bottom(d.reverse(), 1);

        this.move_history.push(1);
    }

    Fi() {
        this.F();
        this.F();
        this.F();
    }

    B() {
        this.back.rotate_clockwise();

        const a = this.top.get_row(0);
        const b = this.left.get_col(0);
        const c = this.bottom.get_row(this.n - 1);
        const d = this.right.get_col(this.n - 1);

        this.left.replace_left(a.reverse(), 3);
        this.bottom.replace_bottom(b, 3);
        this.right.replace_right(c.reverse(), 3);
        this.top.replace_top(d, 3);

        this.move_history.push(2);
    }

    Bi() {
        this.B();
        this.B();
        this.B();
    }

    U() {
        this.top.rotate_clockwise();

        const a = this.front.get_row(0);
        const b = this.left.get_row(0);
        const c = this.back.get_row(0);
        const d = this.right.get_row(0);

        this.left.replace_top(a);
        this.back.replace_top(b);
        this.right.replace_top(c);
        this.front.replace_top(d);

        this.move_history.push(3);
    }

    Ui() {
        this.U();
        this.U();
        this.U();
    }

    D() {
        this.bottom.rotate_clockwise();

        const a = this.front.get_row(this.n - 1);
        const b = this.right.get_row(this.n - 1);
        const c = this.back.get_row(this.n - 1);
        const d = this.left.get_row(this.n - 1);

        this.right.replace_bottom(a);
        this.back.replace_bottom(b);
        this.left.replace_bottom(c)
        this.front.replace_bottom(d);

        this.move_history.push(4);
    }

    Di() {
        this.D();
        this.D();
        this.D();
    }

    L() {
        this.left.rotate_clockwise();

        const a = this.front.get_col(0);
        const b = this.bottom.get_col(0);
        const c = this.back.get_col(this.n - 1);
        const d = this.top.get_col(0);

        this.bottom.replace_left(a);
        this.back.replace_right(b.reverse(), 2);
        this.top.replace_left(c.reverse(), 2);
        this.front.replace_left(d);

        this.move_history.push(5);
    }

    Li() {
        this.L();
        this.L();
        this.L();
    }

    R() {
        this.right.rotate_clockwise();

        const a = this.front.get_col(this.n - 1);
        const b = this.top.get_col(this.n - 1);
        const c = this.back.get_col(0);
        const d = this.bottom.get_col(this.n - 1);

        this.top.replace_right(a);
        this.back.replace_left(b.reverse(), 2);
        this.bottom.replace_right(c.reverse(), 2);
        this.front.replace_right(d);

        this.move_history.push(6);
    }

    Ri() {
        this.R();
        this.R();
        this.R();
    }

    M() {
        if(this.n % 2) {
            const a = this.front.get_col(Math.floor(this.n / 2));
            const b = this.bottom.get_col(Math.floor(this.n / 2));
            const c = this.back.get_col(Math.floor(this.n / 2));
            const d = this.top.get_col(Math.floor(this.n / 2));

            this.bottom.replace_middle_col(a);
            this.back.replace_middle_col(b.reverse(), 2);
            this.top.replace_middle_col(c.reverse(), 2);
            this.front.replace_middle_col(d);

            this.move_history.push(7);
        }
    }

    Mi() {
        this.M();
        this.M();
        this.M();
    }

    E() {
        if(this.n % 2) {
            const a = this.front.get_row(Math.floor(this.n / 2));
            const b = this.right.get_row(Math.floor(this.n / 2));
            const c = this.back.get_row(Math.floor(this.n / 2));
            const d = this.left.get_row(Math.floor(this.n / 2));

            this.right.replace_middle_row(a);
            this.back.replace_middle_row(b);
            this.left.replace_middle_row(c)
            this.front.replace_middle_row(d);

            this.move_history.push(8);
        }
    }

    Ei() {
        this.E();
        this.E();
        this.E();
    }

    S() {
        if(this.n % 2) {
            const a = this.top.get_row(Math.floor(this.n / 2));
            const b = this.right.get_col(Math.floor(this.n / 2));
            const c = this.bottom.get_row(Math.floor(this.n / 2));
            const d = this.left.get_col(Math.floor(this.n / 2));

            this.right.replace_middle_col(a, 1);
            this.bottom.replace_middle_row(b.reverse(), 1);
            this.left.replace_middle_col(c, 1);
            this.top.replace_middle_row(d.reverse(), 1); 

            this.move_history.push(9);
        }
    }

    Si() {
        this.S();
        this.S();
        this.S();
    }

    f() {
        this.F();
        this.S();
    }

    fi() {
        this.f();
        this.f();
        this.f();
    }

    b() {
        this.B();
        this.Si();
    }

    bi() {
        this.b();
        this.b();
        this.b();
    }

    u() {
        this.U();
        this.Ei();
    }

    ui() {
        this.u();
        this.u();
        this.u();
    }

    d() {
        this.D();
        this.E();
    }

    di() {
        this.d();
        this.d();
        this.d();
    }

    l() {
        this.L();
        this.M();
    }

    li() {
        this.l();
        this.l();
        this.l();
    }

    r() {
        this.R();
        this.Mi();
    }

    ri() {
        this.r();
        this.r();
        this.r();
    }

    x() {
        // rotate the entire Cube on R
        this.right.rotate_clockwise();
        this.left.rotate_counterclockwise();
        
        const a = this.front;
        const b = this.top;
        const c = this.back;
        const d = this.bottom;

        this.top = a;
        this.back = b;
        this.bottom = c;
        this.front = d;

        this.back.rotate_twice();
        this.bottom.rotate_twice();

        this.move_history.push(10);
    }

    xi() {
        // rotate the entire Cube on R
        this.right.rotate_counterclockwise();
        this.left.rotate_clockwise();
        
        const a = this.front;
        const b = this.bottom;
        const c = this.back;
        const d = this.top;

        this.bottom = a;
        this.back = b;
        this.top = c;
        this.front = d;

        this.back.rotate_twice();
        this.top.rotate_twice();

        this.move_history.push(-10);
    }

    y() {
        // rotate the entire Cube on U
        this.top.rotate_clockwise();
        this.bottom.rotate_counterclockwise();

        const a = this.front;
        const b = this.left;
        const c = this.back;
        const d = this.right;

        this.left = a;
        this.back = b;
        this.right = c;
        this.front = d;

        this.move_history.push(11);
    }

    yi() {
        this.y();
        this.y();
        this.y();
    }

    z() {
        // rotate the entire Cube on F
        this.front.rotate_clockwise();
        this.back.rotate_counterclockwise();

        this.top.rotate_clockwise();
        this.right.rotate_clockwise();
        this.bottom.rotate_clockwise();
        this.left.rotate_clockwise();

        const a = this.top;
        const b = this.right;
        const c = this.bottom;
        const d = this.left;

        this.right = a;
        this.bottom = b;
        this.left = c;
        this.top = d;

        this.move_history.push(12);
    }

    zi() {
        this.z();
        this.z();
        this.z();
    }
}