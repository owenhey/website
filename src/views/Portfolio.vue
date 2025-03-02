<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content" ref="scrollingElement">
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

            const scrollingElement = ref<HTMLElement>();

            const portfolioObjects = ref<PortfolioContent[]>([
                {
                    title: "Isles of Ilkmaar",
                    images: ['/src/assets/png/isles.png'],
                    date: "2022-present",
                    content: [
                        "[i]Isles of Ilkmaar[i] is a multiplayer game, trying to ignite an interest in data science in middle schoolers.",
                        "Players work together to forage resources, craft items, interact with creatures, and restore balance to the isles.",
                        "Everything that happens is sent to a database, which players can query to ask questions about trends and patterns in the world.",
                    ],
                },
                {
                    title: "Nunaka",
                    date: "2022-2023",
                    images: ['/src/assets/png/isles.png'],
                    content: [
                        "[i]Nunaka[i] is a celebration and showcase of Sugpiaq (an Alaskan Native people) heritage. We worked with the Chugachmiut organization to create something that would excite their youth about their culture.",
                        "The game takes place in a styalized replica of the tribe's town, with elders and talking animals to guide the player through various minigames and activities.",
                        "The minigames focus on individual aspects of daily life, including fishing, cooking, and bead-jewlery making.",
                    ],
                },
                {
                    title: "Polygunners",
                    date: "2022-2023",
                    images: ['/src/assets/jpg/polygunners.jpg'],
                    content: [
                        "An intense cooperative bullet-hell game released on Steam in 2022, played by over 60,000 players.",
                        "Players navigate three distinct areas with increasing difficulty, gathering weapons and abilities along the way.",
                        "The game supports 1-4 players and Steam remote play. There are hundreds of items to collect, as well as dozens of abilities and NPCs to play with with across the campaign.",
                    ],
                },
                {
                    title: "Ludum Dare 56 - Char Chase",
                    date: "2022-2023",
                    images: ['/src/assets/jpg/charchase.jpg'],
                    content: [
                        "Made for Ludum Dare 56, [link]Char Chase,https://oysterhey.itch.io/char-chase[link].",
                        "Collect letters, spell words, and try to get the highest score you can in under two minutes!",
                        "The highest score as of March 2nd, 2025, is [b]792[b]. Email me if you beat it!"
                    ],
                },
                {
                    title: "Museums Around the World",
                    date: "2022-2023",
                    images: ['/src/assets/jpg/parity.jpg'],
                    content: [
                        "I've developed games and interactives for museums around the world:",
                        "The [link]Plimoth Patuxet museums,https://plimoth.org/[link] in Plymouth, MA",
                        "The [link]Swiss National Museum,https://www.nationalmuseum.ch/en[link], in Zürich",
                        "the [link]SFMOMA,https://www.sfmoma.org/[link] in San Fransisco",
                        "The [link]Museum Aargau,https://www.myswitzerland.com/en-us/experiences/museum-aargau-experience-history-where-it-took-place/[link] in Aargau, Switzerland.",
                    ],
                },
                {
                    title: "Boss Rush 2025 - Steel Rose Revolution",
                    date: "2022-2023",
                    images: ['/src/assets/jpg/steelroserevolution.jpg'],
                    content: ["[link]Char Chase,https://oysterhey.itch.io/char-chase[link] is a game made I made for ludum dare 56."],
                },
                {
                    title: "4D Missile",
                    date: "Sept 2024",
                    images: ['/src/assets/jpg/steelroserevolution.jpg'],
                    content: ["A sequel to the classic flash game 3D-missile - made in 1 month."],
                },
            ]);

            function onPieceSelected(data : PortfolioContent){
                scrollingElement.value!.scroll({
                    top: 0, 
                    left: 0, 
                    behavior: 'smooth' 
                });

                for (let index = 0; index < portfolioObjects.value.length; index++) {
                    const element = portfolioObjects.value[index];
                    if(element.title === data.title){
                        selectedIndex.value = index;
                        break;
                    }
                }
            }

            return { portfolioObjects, onPieceSelected, selectedIndex, scrollingElement }
        },
    }
);
</script>