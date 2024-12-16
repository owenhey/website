<template>
    <div>
        <ul class="header-list">
            <VineButton :link="'/'" :tab-selected="isCurrentRoute('/')">home</VineButton>
            <VineButton :link="'/portfolio'" :tab-selected="isCurrentRoute('/portfolio')">portfolio</VineButton>
            <VineButton :link="'/writing'" :tab-selected="isCurrentRoute('/writing')">writing</VineButton>
            <VineButton :link="'/flags'" :tab-selected="isCurrentRoute('/flags')">flags</VineButton>
            <VineButton :link="'/about'" :tab-selected="isCurrentRoute('/about')">about</VineButton>
        </ul>
    </div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import { useRouter, useRoute } from 'vue-router'
import VineButton from './VineButton.vue';

    export default defineComponent({
        name: 'Nav',
        components:{
            VineButton
        },
		methods: {
			isCurrentRoute(path: string) : boolean {
				const ret = this.route.path === path;
				return ret;
			}
		},
        setup() {
            const router = useRouter();
			const route = useRoute();

            return {router, route}
        },
    }
);
</script>