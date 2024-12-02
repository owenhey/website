<template>
	<div class="center-main-content">
		<main class="main-content">
			<nav class="header">
				<ul class="header-list">
					<button class="header-button">home</button>
					<button class="header-button">portfolio</button>
					<button class="header-button">blog</button>
					<button class="header-button">flags</button>
					<button class="header-button">about</button>
				</ul>
			</nav>
			<div class="scrolling-content">
				<h1>welcome to my website</h1>
				<p>here is some information about me</p>
			</div>
		</main>
	</div>
</template>

<script lang='ts'>
	import '@/assets/base.css'

	import { onMounted } from 'vue'
	import { useRouter } from 'vue-router'

	export default{
		setup(){
			const router = useRouter()

			onMounted(() => {
				
			})

			return{
				router
			}
		}
	}
</script>