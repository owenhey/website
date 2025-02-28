<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content">
				<h1 style="margin-top: 1rem; width: 100%; text-align: center;">Portfolio</h1>
                <PortfolioSpotlight
                    :content="portfolioObjects[selectedIndex]">
                </PortfolioSpotlight>
                <h2 style="margin-top: 2rem;">Other Projects</h2>
                <div class="portfolio-buttons">
                    <template v-for="content in portfolioObjects">
                        <PortfolioButton 
                            :data="content"
                            @on-select="onPieceSelected">

                        </PortfolioButton>
                    </template>
                </div>
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
    import PortfolioButton from './PortfolioButton.vue';

    export default defineComponent({
        name: 'Portfolio',
        components:{
            MainContent, Nav, PortfolioSpotlight, PortfolioButton
        },
        setup() {
            const selectedIndex = ref(0);

            const portfolioObjects = ref<PortfolioContent[]>([
                {
                    title: "Isles of Ilkmaar",
                    images: ['/src/assets/png/isles.png'],
                    content: "Isles of Ilkmaar is a game.",
                },
                {
                    title: "Nunaka",
                    images: ['/src/assets/png/isles.png'],
                    content: "Nunaka",
                },
                {
                    title: "Polygunners",
                    images: ['/src/assets/jpg/polygunners.jpg'],
                    content: "Nunaka",
                },
                {
                    title: "Ludum Dare 56 - Char Chase",
                    images: ['/src/assets/jpg/charchase.jpg'],
                    content: "[link]Char Chase,https://oysterhey.itch.io/char-chase[link] is a game made I made for ludum dare 56.",
                },
                {
                    title: "Boss Rush 2025 - Steel Rose Revolution",
                    images: ['/src/assets/jpg/steelroserevolution.jpg'],
                    content: "[link]Char Chase,https://oysterhey.itch.io/char-chase[link] is a game made I made for ludum dare 56.",
                },
                {
                    title: "Museum Suite",
                    images: ['/src/assets/jpg/parity.jpg'],
                    content: "[link]Char Chase,https://oysterhey.itch.io/char-chase[link] is a game made I made for ludum dare 56.",
                },
            ]);

            function onPieceSelected(data : PortfolioContent){
                for (let index = 0; index < portfolioObjects.value.length; index++) {
                    const element = portfolioObjects.value[index];
                    if(element.title === data.title){
                        selectedIndex.value = index;
                        break;
                    }
                }
            }

            return { portfolioObjects, onPieceSelected, selectedIndex }
        },
    }
);
</script>