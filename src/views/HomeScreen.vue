<template>
	<div class="center-main-content">
		<MainContent>
			<Nav class="header"></Nav>
			<div class="scrolling-content home-content">
				<h1>My name is Owen! And welcome to my website.</h1>
				<p>I am a Boston-based game developer, currently working at <a href="https://www.fablevisionstudios.com/">FableVision Studios</a> as a developer.</p>
				<h3>Explore my page: </h3>
				<div style="display: flex; justify-content: center; align-items: center;">
					<div class="window-links">
						<WindowLink :link="'about'" :text="'Learn about me'">
							<img src="@/assets/png/me.png">
						</WindowLink>
						<WindowLink :link="'about'" :text="'See what I\'ve worked on'">
							<img src="@/assets/png/whativedone.png">
						</WindowLink>
						<WindowLink :link="'about'" :text="'Read dev notes'">
							<img src="@/assets/png/papers.png">
						</WindowLink>
						<WindowLink :link="'about'" :text="'Play the flag game'">
							<img src="@/assets/png/flag.png">
						</WindowLink>
					</div>
				</div>
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
	import WindowLink from './WindowLink.vue';


    export default defineComponent({
        name: 'HomeScreen',
		components: {
			VineButton, Nav, MainContent, WindowLink
		},
        setup() {
			return {
				
			}
        },
    }
);
</script>