<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content">
				<h1>Here is the portfolio page</h1>
			</div>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';

    export default defineComponent({
        name: 'Portfolio',
        components:{
            MainContent, Nav
        },
        setup() {
            return {}
        },
    }
);
</script>