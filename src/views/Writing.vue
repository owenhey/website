<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content" style="margin-top: 2vw;">
                <RouterView></RouterView>
			</div>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed } from 'vue';
    import { RouterView, useRouter } from 'vue-router';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import BlogButton from './BlogButton.vue';

    export default defineComponent({
        name: 'Writing',
        components:{
            MainContent, Nav, BlogButton
        },
        setup() {
            const router = useRouter();

            return {router}
        },
    }
);
</script>