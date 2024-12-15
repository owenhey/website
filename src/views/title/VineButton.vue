<template>
    <button class="vine-button" @click="handleClick" :class="tabSelected ? 'tab-selected' : ''">
        <slot></slot>
        <div class="vine-mask">
            <img class="vine-img" src="@/assets/png/vine3.png">
        </div>
    </button>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';

    export default defineComponent({
        name: 'VineButton',
        emits: ['click'],
        props: {
            tabSelected: {
                required: false,
                type: Boolean,
                default: false
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