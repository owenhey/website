<template>
    <main class="main-content">
        <div class="vine-left-mask">
            <div class="vert-vine-left"></div>
        </div>
        <div class="vine-right-mask">
            <div class="vert-vine-right"></div>
        </div>
        <slot></slot>
    </main>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';

    export default defineComponent({
        name: 'MainContent',
        setup() {

            return {}
        },
    }
);
</script>