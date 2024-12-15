<template>
    <div class="leaf-parent" :style="positionStyle">
        <div class="leaf-x">
            <div class="leaf-y">
                <img draggable="false" class="leaf" src="@/assets/png/leaf.png" :style="`animation-delay: -${xPos + yPos}s;`">
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';

    export default defineComponent({
        name: 'Leaf',
        props:{
            xPos: {
                required: true,
                type: Number
            },
            yPos: {
                required: true,
                type: Number
            },
        },
        setup(props) {
            const positionStyle = computed(()=>{
                let ret = "";
                ret += `left: ${props.xPos}px; top: ${props.yPos}px;`;

                return ret;
            });

            return { positionStyle}
        },
    }
);
</script>