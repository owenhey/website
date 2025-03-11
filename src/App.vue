<template>
	<div class="background"></div>
	<div class="background-grid" 
		@mousedown="startDragging" 
		@mousemove="handleMouseMove"
		@mouseup="stopDragging"
		@mouseleave="stopDragging">
		<div class="leaves" draggable="false">
			<p style="margin: 10px;">click or drag me!</p>
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
			const isDragging = ref(false);
			const minDragDistance = ref(30); // Minimum distance in pixels before spawning leaves
			const minSpawnDistance = ref(30); // Minimum distance in pixels between spawns
			const hasReachedThreshold = ref(false);
			const lastSpawnX = ref(0);
			const lastSpawnY = ref(0);
			const initialClickX = ref(0);
			const initialClickY = ref(0);

			function spawnLeaf(x: number, y: number) {
				console.log("leaf added");
				leafData.value.push({
					xPos: x - (Math.random() * 20 + 5),
					yPos: y - (Math.random() * 20 + 5),
					timeSpawned: new Date()
				});

				// Update last spawn position
				lastSpawnX.value = x;
				lastSpawnY.value = y;

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

			function startDragging(mouseEvent: MouseEvent) {
				isDragging.value = true;
				
				initialClickX.value = mouseEvent.pageX;
				initialClickY.value = mouseEvent.pageY;
				
				hasReachedThreshold.value = false;
				
				// Spawn a leaf on initial click
				spawnLeaf(mouseEvent.pageX, mouseEvent.pageY);
			}

			function handleMouseMove(mouseEvent: MouseEvent) {
				if (!isDragging.value) return;
				
				if (!hasReachedThreshold.value) {
					const distFromInitial = Math.sqrt(
						Math.pow(mouseEvent.pageX - initialClickX.value, 2) + 
						Math.pow(mouseEvent.pageY - initialClickY.value, 2)
					);
					
					// Check if we've moved enough to start spawning
					if (distFromInitial >= minDragDistance.value) {
						hasReachedThreshold.value = true;
					}
				} else {
					const distFromLastSpawn = Math.sqrt(
						Math.pow(mouseEvent.pageX - lastSpawnX.value, 2) + 
						Math.pow(mouseEvent.pageY - lastSpawnY.value, 2)
					);
					
					// Only spawn if we've moved enough distance since last spawn
					if (distFromLastSpawn >= minSpawnDistance.value) {
						spawnLeaf(mouseEvent.pageX, mouseEvent.pageY);
						initialClickX.value = mouseEvent.pageX;
						initialClickY.value = mouseEvent.pageY;
					}
				}
			}

			function stopDragging() {
				isDragging.value = false;
			}

            return { 
				router, 
				leafData, 
				isDragging,
				startDragging,
				handleMouseMove,
				stopDragging,
				minDragDistance,
				hasReachedThreshold
			}
		}
	});
</script>