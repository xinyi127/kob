//import { createTextVNode } from "vue";
import { AcGAmeObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGAmeObject {
    // info 是传过来的蛇的信息
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        
        this.cells = [new Cell(info.r, info.c)]; // 蛇的所有格子，cells[0] 存放蛇头
        this.next_cell = null; // 下一步的目标位置

        this.speed = 5; // 蛇每秒钟走5个格子
        this.direction = -1; // -1 没有指令，0 1 2 3 分别表示上右下左
        this.status = "idle"; // idle 表示静止，move 表示正在移动，die 表示已经死亡
        
        this.dr = [-1, 0, 1, 0]; // 四个方向行的偏移量
        this.dc = [0, 1, 0, -1]; // 四个方向列的偏移量

        this.step = 0; // 当前回合数，前十回合每回合增长1，之后每三回合增长1
        this.eps = 1e-2; // 允许的误差

        this.eye_direction = 0; // 左下角的蛇初始朝上，右上角的蛇初始朝下
        if (this.id === 1) {
            this.eye_direction = 2;
        }

        this.eye_dx = [ // 蛇眼睛不同方向的x的偏移量
            [-1, 1],
            [1, 1],
            [-1, 1],
            [-1, -1],
        ];
        this.eye_dy = [ // 蛇眼睛不同方向的y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    start() {
    }

    set_direction(d) {
        this.direction = d;
    }

    cherk_tail_increasing() { // 检测当前回合，蛇的长度是否增加
        if (this.step <= 10) {
            return true;
        }
        if (this.setp % 3 === 1) {
            return true;
        }
        return false;
    }

    next_step() { // 将蛇的状态更新为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;
        this.direction = -1; // 清空操作
        this.status = "move";
        this.step ++;

        const k = this.cells.length;
        for (let i = k; i > 0; i --) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }
    }

    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) { // 走到目标点了
            this.cells[0] = this.next_cell; // 添加一个新蛇头
            this.next_cell = null;
            this.status = "idle"; // 走完了，停下来
            
            if (!this.cherk_tail_increasing()) { // 蛇不变长，砍掉蛇尾
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000; // 每两帧之间走过的距离
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy /distance;

            if (!this.cherk_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if (this.status === "move") {
            this.update_move();
        }

        this.rander();
    }

    rander() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {
            ctx.beginPath();
            // 圆心坐标，半径，起始角度，终止角度（画整个圆就是0到2π）
            ctx.arc(cell.x * L,  cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i ++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
                continue;
            }
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}