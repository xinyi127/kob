export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        // canvas 的x是列，y是行，这里的 xy 代表格子中点
        this.x = c + 0.5;
        this.y = r + 0.5;
    }
}