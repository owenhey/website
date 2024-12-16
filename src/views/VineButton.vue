<template>
    <a tabindex="0" class="vine-button" :class="tabSelected ? 'tab-selected' : ''" @click="router.push(link)" >
        <slot></slot>
        <div class="vine-mask">
            <img draggable="false" class="vine-img" src="@/assets/png/vine3.png">
        </div>
    </a>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed } from 'vue';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'VineButton',
        props: {
            link: {
                required: false,
                type: String,
                default: '/sdf'
            },
            tabSelected: {
                required: false,
                type: Boolean,
                default: false
            },
        },
        setup(props) {
            const router = useRouter();

            return { router }
        },
    }
);
</script>