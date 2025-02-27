<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content">
				<h1 style="margin-top: 1rem; width: 100%; text-align: center;">Portfolio</h1>
                <PortfolioSpotlight
                    :content="portfolioObjects[0]">
                </PortfolioSpotlight>
			</div>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, ref, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import PortfolioSpotlight from './PortfolioSpotlight.vue';
    import { PortfolioContent } from '@/types';

    export default defineComponent({
        name: 'Portfolio',
        components:{
            MainContent, Nav, PortfolioSpotlight
        },
        setup() {
            const portfolioObjects = ref<PortfolioContent[]>([
                {
                    title: "[link]Char Chase,https://oysterhey.itch.io/char-chase[link]",
                    images: ['/src/assets/jpg/charchase.jpg'],
                    content: "[link]Char Chase,https://oysterhey.itch.io/char-chase[link] is a game made for ludum dare 56",
                }
            ]);

            return {portfolioObjects}
        },
    }
);
</script>