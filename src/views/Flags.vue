<template>
    <div class="flags-base">
        <Nav class="flags-nav-header"></Nav>
        <h1>Welcome to the flag game</h1>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/flags.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';

    export default defineComponent({
        name: 'Flags',
        components:{
            MainContent, Nav
        },
        setup() {
            return {}
        },
    }
);
</script>