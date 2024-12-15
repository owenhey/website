<template>
	<div class="center-main-content">
		<main class="main-content">
			<div class="vine-left-mask">
				<div class="vert-vine-left"></div>
			</div>
			<div class="vine-right-mask">
				<div class="vert-vine-right"></div>
			</div>
			<nav class="header">
				<ul class="header-list">
					<VineButton :tab-selected="isCurrentRoute('/')">home</VineButton>
					<VineButton :tab-selected="isCurrentRoute('/portfolio')">portfolio</VineButton>
					<VineButton :tab-selected="isCurrentRoute('/blog')">blog</VineButton>
					<VineButton :tab-selected="isCurrentRoute('/flags')">flags</VineButton>
					<VineButton :tab-selected="isCurrentRoute('/about')">about</VineButton>
				</ul>
			</nav>
			<div class="scrolling-content">
				<h1>welcome to my website</h1>
				<p>here is some information about me</p>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
	import '@/assets/base.css'

    import { PropType, defineComponent, computed, onMounted, ref } from 'vue';
	import { useRouter, useRoute } from 'vue-router'
	import VineButton from './VineButton.vue';


    export default defineComponent({
        name: 'HomeScreen',
		components: {
			VineButton
		},
		methods: {
			isCurrentRoute(path: string) : boolean {
				console.log(this.route.path);
				const ret = this.route.path === path;
				console.log(ret);
				return ret;
			}
		},
        setup() {
			const router = useRouter();
			const route = useRoute();

			return {
				router, route
			}
        },
    }
);
</script>