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
					<VineButton>home</VineButton>
					<VineButton>portfolio</VineButton>
					<VineButton>blog</VineButton>
					<VineButton>flags</VineButton>
					<VineButton>about</VineButton>
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

    import { PropType, defineComponent, computed, onMounted } from 'vue';
	import { useRouter } from 'vue-router'
	import VineButton from './VineButton.vue';

    export default defineComponent({
        name: 'HomeScreen',
		components: {
			VineButton
		},
        setup() {
			const router = useRouter();

            return {router }
        },
    }
);
</script>