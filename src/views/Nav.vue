<template>
    <nav>
        <ul class="header-list">
            <VineButton :link="'/'" :tab-selected="isCurrentRoute('/', true)">home</VineButton>
            <VineButton :link="'/portfolio'" :tab-selected="isCurrentRoute('/portfolio')">portfolio</VineButton>
            <VineButton :link="'/writing/all-posts'" :tab-selected="isCurrentRoute('/writing/')">writing</VineButton>
            <VineButton :link="'/flags'" :tab-selected="isCurrentRoute('/flags')">flags</VineButton>
            <VineButton :link="'/about'" :tab-selected="isCurrentRoute('/about')">about</VineButton>
        </ul>
    </nav>
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
			isCurrentRoute(path: string, forceExact : boolean = false) : boolean {
                if(forceExact){
                    return this.route.path === path;
                }
                else{
                    return this.route.path.includes(path);
                }
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