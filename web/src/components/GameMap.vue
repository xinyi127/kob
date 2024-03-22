<template>
    <div ref="parent" class="gamemap">
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>


<script>
import { GameMap } from '@/assets/scripts/GameMap';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);

        // 当 template 完成 parent 和 canvas 的挂载（分别与 div 和 canvas 产生关联）后，执行 onMounted
        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value)
        });

        // 在此处返回后，才可以在 template 中使用这两个变量
        return {
            parent,
            canvas
        }
    }
}
</script>


<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>