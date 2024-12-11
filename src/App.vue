<template>
	<div class="background"></div>
	<div class="background-grid" @click="spawnLeaf">
		<div class="leaves">
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
	import Leaf from './views/title/Leaf.vue';

	const appDiv = ref<HTMLElement | null>(null);
	const appBody = ref<HTMLElement | null>(null);

	interface LeafSpawnData {
		xPos: number; yPos: number;
	}

	export default defineComponent({
		components:{
			Leaf
		}, 
		setup() {
			const router = useRouter()
			const route = useRoute()
			const assetImport = import.meta.glob("./assets/**/*"); // Force imports everything in the assets folder

			const leafData = ref<LeafSpawnData[]>([]);

			function spawnLeaf(mouseEvent : MouseEvent){
				console.log("hee");
				leafData.value.push({
					xPos: mouseEvent.pageX - 15, // Use mouse event coordinates
					yPos: mouseEvent.pageY - 25,
				});

				setTimeout(() => {
					if (leafData.value[0]) {
						leafData.value.splice(0, 1);
					}
				}, 5000);
			}

            return {router, leafData, spawnLeaf }
		}

	});
</script>