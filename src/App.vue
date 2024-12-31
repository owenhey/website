<template>
	<div class="background"></div>
	<div class="background-grid" @mousedown="spawnLeaf">
		<div class="leaves" draggable="false">
			<p style="margin: 10px;">click me!</p>
			<Leaf v-for="leaf in leafData"
				:x-pos="leaf.xPos"
				:y-pos="leaf.yPos">
			</Leaf>
		</div>
	</div>
	<RouterView />
</template>

<script lang="ts">
	import { ref, onMounted, computed, defineComponent } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import Leaf from './views/Leaf.vue';

	const appDiv = ref<HTMLElement | null>(null);
	const appBody = ref<HTMLElement | null>(null);

	interface LeafSpawnData {
		xPos: number; yPos: number; timeSpawned: Date
	}

	export default defineComponent({
		components:{
			Leaf
		}, 
		setup() {
			const router = useRouter();
			const route = useRoute();
			const assetImport = import.meta.glob("./assets/**/*"); // Force imports everything in the assets folder

			const leafData = ref<LeafSpawnData[]>([]);

			function spawnLeaf(mouseEvent : MouseEvent){
				console.log("leaf added");
				leafData.value.push({
					xPos: mouseEvent.pageX - (Math.random() * 20 + 5), // Use mouse event coordinates
					yPos: mouseEvent.pageY - (Math.random() * 20 + 5),
					timeSpawned: new Date()
				});

				setTimeout(() => {
					let removeAll = true;
					const now = new Date().getTime();
					leafData.value.forEach(leaf => {
						const secondsBetween = (now - leaf.timeSpawned.getTime()) / 1000;
						if(secondsBetween < 5){
							removeAll = false;
						}
					});

					if(removeAll){
						leafData.value = [];
					}
				}, 5000);
			}

            return {router, leafData, spawnLeaf }
		}

	});
</script>