import { AcGAmeObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGAmeObject {
    // ctx 画布；parent 画布的父元素，用于动态的修改画布的长宽
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0; // 格子的边长

        this.rows = 13;
        this.cols = 14;

        this.inner_walls_count = 20; // 障碍物的数量
        this.walls = []; // 存放所有的障碍物

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 0, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ];
    }

    // 判断双方是否可以连通
    cherk_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0 , 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.cherk_connectivity(g, x, y, tx, ty)) {
                return true;
            }
        }

        return false;
    }

    // 创建障碍物
    create_walls() {
        // g[r][c] 为 true 表示有障碍物
        const g = [];
        for (let r = 0; r < this.rows; r ++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++) {
                g[r][c] = false;
            }
        }
        
        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r ++) {
            g[r][0] = g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c ++) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物（为了公平，需要做到轴对称，所以只需要创建一半）
        for (let i = 0; i < this.inner_walls_count / 2; i ++) {
            for (let j = 0; j < 1000; j ++) {
                //随机位置
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                // 如果随机位置已经被填充过，重新找
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) {
                    continue;
                }
                // 如果随机位置是左下角和右上角（初始点），重新找
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) {
                    continue;
                }
 
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.cherk_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) {
            return false;
        }

        for (let r = 0; r < this.rows; r ++) {
            for (let c = 0; c < this.cols; c ++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }
        
    add_listenint_events() {
        // 为了获取用户输出，需要先让 canvas 聚焦
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') {
                snake0.set_direction(0);
            } else if (e.key === 'd') {
                snake0.set_direction(1);
            } else if (e.key === 's') {
                snake0.set_direction(2);
            } else if (e.key == 'a') {
                snake0.set_direction(3);
            } else if (e.key == 'ArrowUp') {
                snake1.set_direction(0);
            } else if (e.key == 'ArrowRight') {
                snake1.set_direction(1);
            } else if (e.key == 'ArrowDown') {
                snake1.set_direction(2);
            } else if (e.key == 'ArrowLeft') {
                snake1.set_direction(3);
            }
        });
    }

    start() {
        for (let i = 0; i < 1000; i ++) {
            if (this.create_walls()) {
                break;
            }
        }

        this.add_listenint_events();
    }

    // 每帧都更新一次格子边长
    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 判断两条蛇是否都准备好下一回合（两条蛇都处于静止，都走完了，都获取了下一步操作的指令）
    cherk_ready() {
        for (const snake of this.snakes) {
            // JS 中判断相等要用三个等号
            if (snake.status !== "idle") {
                return false;
            }
            if (snake.direction === -1) {
                return false;
            }
        }
        return true;
    }

    next_step() { // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    cherk_valid(cell) { // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c == cell.c) {
                return false;
            }
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.cherk_tail_increasing()) { // 当蛇尾会前进的时候，蛇尾不要判断
                k --;
            }
            for (let i = 0; i < k; i ++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) {
                    return false;
                }
            }
        }

        return true;
    }

    update() {
        this.update_size();
        if (this.cherk_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        // 偶数格和奇数格的颜色
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++) {
            for (let c = 0; c < this.cols; c ++) {
                // 判断是奇数格还是偶数格
                if ((c + r) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                // 坐标，长宽
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}