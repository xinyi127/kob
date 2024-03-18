const AC_GAME_OBJECTS = [];  // 存所有游戏对象

export class AcGAmeObject {
    constructor() { // 在构造函数中加入到 AC_GAME_OBJECTS 里面
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0; // 两帧之间的时间间隔（不一定相同）
        this.has_called_start = false; // start 函数是否被执行过
    }

    start() { // 只在创建时执行一次

    }

    update() { // 除第一帧之外，每一帧执行一次

    }

    on_destroyed() { // 删除之前执行
        
    }

    destroyed() { // 从 AC_GAME_OBJECTS 中删除游戏对象
        this.on_destroyed();
        
        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj == this) {
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }

    }
}

let last_timestamp; // start 或 update 上一次执行的时刻
const step = timesatmp => { // 迭代函数，浏览器每刷新一帧就执行一次
    // JS 中 in 表示遍历下标，of 表示遍历值
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timesatmp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timesatmp;
    requestAnimationFrame(step)
} 

requestAnimationFrame(step) // 所传入的函数会在浏览器下一帧渲染之前执行一次