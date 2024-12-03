<template>
    <button class="vine-button" @click="handleClick">
        <slot></slot>
        <div class="vine-mask">
            <img class="vine-img" src="@/assets/png/vine.png">
        </div>
    </button>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';

    export default defineComponent({
        name: 'VineButton',
        emits: ['click'],
        props: {
            test: {
                required: false,
                default: 0
            }
        },
        setup(props, {emit}) {
            function handleClick(){
                emit('click');
            }

            return { handleClick, }
        },
    }
);
</script>