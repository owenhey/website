<template>
    <div class="window-link">
        <a class="window-link-header" @click="router.push(link)">{{text}}</a>
        <div class="window-link-content" @mousemove="handleMouseMove">
            <div class="window-slats"></div>
            <slot></slot>
        </div>
    </div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, ref} from 'vue';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'WindowLink',
        props: {
            link: {
                required: false,
                type: String,
                default: '/'
            },
            text: {
                type: String
            }
        },
        setup(props) {
            const router = useRouter();

            const mouseX = ref(.5);
            const mouseY = ref(.5);

            const gradientPos = computed(()=>{

                return {
                    x: (mouseX.value * 100) - 150,
                    y: (mouseY.value * 100) - 150
                }
            });

            function handleMouseMove(mousePos : MouseEvent){
                const rect = (mousePos.target as HTMLElement).getBoundingClientRect();

                // Calculate percentage across the element (0-100)
                let x = ((mousePos.clientX - rect.left) / rect.width);
                let y = ((mousePos.clientY - rect.top) / rect.height);
                if(x > .25 && x < .75){
                    mouseX.value = x;
                }
                if(y > .25 && y < .75){
                    mouseY.value = y;
                }
            }

            return { router, handleMouseMove, gradientPos }
        },
    }
);
</script>