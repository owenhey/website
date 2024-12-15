<template>
	<div class="center-main-content">
		<MainContent>
			<Nav></Nav>
			<div class="scrolling-content">
				<h1>welcome to my website</h1>
				<p>here is some information about me</p>
			</div>
		</MainContent>
	</div>
</template>	

<script lang="ts">
	import '@/assets/base.css';

    import { PropType, defineComponent, computed, onMounted, ref } from 'vue';
	import VineButton from './VineButton.vue';
	import Nav from './Nav.vue';
	import MainContent from './MainContent.vue';


    export default defineComponent({
        name: 'HomeScreen',
		components: {
			VineButton, Nav, MainContent
		},
        setup() {
			return {
				
			}
        },
    }
);
</script>