const rubiks = {}

export {rubiks};

const Face = rubiks.Face = class Face {
    constructor(n, image) {
        this.n = n;
        this.grid = [];
        for(let i = 0; i < this.n; i++) {
            const row = [];
            for(let j = 0; j < this.n; j++) {
                row.push({
                    image,
                    piece: i * n + j
                });
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

    replace_row(row, arr) {
        this.grid[row] = arr;
    }

    replace_col(col, arr) {
        for(let i = 0; i < this.n; i++) {
            this.grid[i][col] = arr[i];
        }
    }

    replace_top(arr) {
        this.replace_row(0, arr);
    }

    replace_bottom(arr) {
        this.replace_row(this.n - 1, arr);
    }

    replace_left(arr) {
        this.replace_col(0, arr);
    }

    replace_right(arr) {
        this.replace_col(this.n - 1, arr);
    }

    replace_middle_row(arr) {
        this.replace_row(Math.floor(this.n / 2), arr);
    }

    replace_middle_col(arr) {
        this.replace_col(Math.floor(this.n / 2), arr);
    }

    replace_top_two(arr1, arr2) {
        this.replace_row(0, arr1);
        this.replace_row(1, arr2);
    }

    replace_bottom_two(arr1, arr2) {
        this.replace_row(this.n - 1, arr1);
        this.replace_row(this.n - 2, arr2);
    }

    replace_left_two(arr1, arr2) {
        this.replace_col(0, arr1);
        this.replace_col(1, arr2);
    }

    replace_right_two(arr1, arr2) {
        this.replace_col(this.n - 1, arr1);
        this.replace_col(this.n - 2, arr2);
    }

    rotate_clockwise() {
        const result = this.grid;
        
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
}

const Rubiks = rubiks.Rubiks = class Rubiks {
    constructor(n) {
        this.n = n;
        this.front = new Face(n, 'white');
        this.back = new Face(n, 'yellow');
        this.top = new Face(n, 'blue');
        this.bottom = new Face(n, 'green');
        this.left = new Face(n, 'orange');
        this.right = new Face(n, 'red');
    }

    F() {
        this.front.rotate_clockwise();

        const a = this.top.get_row(this.n - 1);
        const b = this.right.get_col(0);
        const c = this.bottom.get_row(0);
        const d = this.left.get_col(this.n - 1);

        this.right.replace_left(a);
        this.bottom.replace_top(b.reverse());
        this.left.replace_right(c);
        this.top.replace_bottom(d.reverse()); 
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

        this.left.replace_left(a.reverse());
        this.bottom.replace_bottom(b);
        this.right.replace_right(c.reverse());
        this.top.replace_top(d);
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
        this.back.replace_right(b.reverse());
        this.top.replace_left(c.reverse());
        this.front.replace_left(d);
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
        this.back.replace_left(b.reverse());
        this.bottom.replace_right(c.reverse());
        this.front.replace_right(d);
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
            this.back.replace_middle_col(b.reverse());
            this.top.replace_middle_col(c.reverse());
            this.front.replace_middle_col(d);
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

            this.right.replace_middle_col(a);
            this.bottom.replace_middle_row(b.reverse());
            this.left.replace_middle_col(c);
            this.top.replace_middle_row(d.reverse()); 
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

        this.top.grid = this.top.grid.reverse();
        this.back.grid = this.back.grid.reverse();
        
        const a = this.front;
        const b = this.top;
        const c = this.back;
        const d = this.bottom;

        this.top = a;
        this.back = b;
        this.bottom = c;
        this.front = d;
    }

    xi() {
        this.x();
        this.x();
        this.x();
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
    }

    zi() {
        this.z();
        this.z();
        this.z();
    }
}