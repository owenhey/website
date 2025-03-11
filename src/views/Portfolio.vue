<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content" ref="scrollingElement">
				<h1 style="margin-top: 1rem; width: 100%; text-align: center;">Portfolio</h1>
                <PortfolioSpotlight
                    ref="portfolioSpotlight"
                    :content="portfolioObjects[selectedIndex]">
                </PortfolioSpotlight>
                <h2 style="margin-top: 2rem;">Other Projects</h2>
                <div class="portfolio-buttons">
                    <template v-for="(content, index) in portfolioObjects">
                        <PortfolioButton 
                            :data="content"
                            @on-select="onPieceSelected"
                            :class="index == selectedIndex ? 'selected' : ''">
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

            const portfolioSpotlight = ref<InstanceType<typeof PortfolioSpotlight>>();

            const portfolioObjects = ref<PortfolioContent[]>([
                {
                    title: "Isles of Ilkmaar",
                    images: [
                        '/src/assets/jpg/isles1.jpg',
                        '/src/assets/jpg/isles2.jpg',
                        '/src/assets/jpg/isles3.jpg',
                        '/src/assets/jpg/isles4.jpg',
                        '/src/assets/jpg/isles5.jpg',
                        '/src/assets/jpg/isles6.jpg',
                        '/src/assets/jpg/isles7.jpg',
                    ],
                    date: "2022-present",
                    content: [
                        "[i]Isles of Ilkmaar[i] is a multiplayer game, trying to ignite an interest in data science in middle schoolers.",
                        "Players work together to forage resources, craft items, interact with creatures, and restore balance to the isles.",
                        "Everything that happens is sent to a database, which players can query to ask questions about trends and patterns in the world.",
                        "This game is still in development and not available to the public."
                    ],
                },
                {
                    title: "Nunaka: My Village",
                    date: "2022-2023",
                    images: [
                        '/src/assets/jpg/chugach4.jpg',
                        '/src/assets/jpg/chugach1.jpg',
                        '/src/assets/jpg/chugach2.jpg',
                        '/src/assets/jpg/chugach3.jpg',
                        '/src/assets/jpg/chugach5.jpg',
                    ],
                    content: [
                        "[link][i]Nunaka: My Village[i],https://www.fablevisionstudios.com/game-nunaka[link] is a celebration and showcase of Sugpiaq (an Alaskan Native people) heritage. We worked with the Chugachmiut organization to create something that would excite their youth about their culture.",
                        "The game takes place in a styalized replica of the tribe's town, with elders and talking animals to guide the player through various minigames and activities.",
                        "The minigames focus on individual aspects of daily life, including fishing, cooking, and bead-jewlery making.",
                        "Nunaka: My Village can be found on the iOS and Android app stores.",
                    ],
                },
                {
                    title: "Polygunners",
                    date: "2022-2023",
                    images: [
                        '/src/assets/jpg/polygunners.jpg',
                        '/src/assets/mp4/polygunners.mp4',
                        '/src/assets/jpg/polygunners1.jpg',
                        '/src/assets/jpg/polygunners2.jpg',
                    ],
                    content: [
                        "An intense cooperative bullet-hell game [link]released on Steam in 2022,https://store.steampowered.com/app/1853840/Polygunners/[link], played by over 60,000 players.",
                        "Players navigate three distinct areas with increasing difficulty, gathering weapons and abilities along the way.",
                        "The game supports 1-4 players and Steam remote play. There are hundreds of items to collect, as well as dozens of abilities and NPCs to play with with across the campaign.",
                    ],
                },
                {
                    title: "Char Chase (Ludum Dare 56)",
                    date: "2022-2023",
                    images: [
                        '/src/assets/jpg/charchase.jpg',
                        '/src/assets/jpg/charchase2.jpg',
                        '/src/assets/jpg/charchase3.jpg',
                        '/src/assets/jpg/charchase4.jpg',
                        '/src/assets/jpg/charchase5.jpg',
                    ],
                    content: [
                        "Made for Ludum Dare 56, [link]Char Chase,https://oysterhey.itch.io/char-chase[link].",
                        "Collect letters, spell words, and try to get the highest score you can in under two minutes!",
                        "Independently designed and developed over a single weekend.",
                        "The highest score as of March 2nd, 2025, is [b]792[b]. Email me if you beat it!",
                        "[link]Source Code,https://github.com/owenhey/ludum-dare-2024[link]"
                    ],
                },
                {
                    title: "Museums Around the World",
                    date: "2022-2023",
                    images: [
                        '/src/assets/jpg/ami4.jpg',
                        '/src/assets/jpg/ami2.jpg',
                        '/src/assets/jpg/ami3.jpg',
                        '/src/assets/jpg/ami1.jpg'
                    ],
                    content: [
                        "I've developed games and interactives for museums around the world:",
                        "The [link]Plimoth Patuxet museums,https://plimoth.org/[link] in Plymouth, MA",
                        "The [link]Swiss National Museum,https://www.nationalmuseum.ch/en[link], in Zürich",
                        "the [link]SFMOMA,https://www.sfmoma.org/[link] in San Fransisco",
                        "The [link]Museum Aargau,https://www.myswitzerland.com/en-us/experiences/museum-aargau-experience-history-where-it-took-place/[link] in Aargau, Switzerland.",
                        "All the games and interactives are screen-reader accessible."
                    ],
                },
                {
                    title: "Boss Rush 2025 - Steel Rose Revolution",
                    date: "2022-2023",
                    images: [
                        '/src/assets/jpg/steelroserevolution.jpg',
                        '/src/assets/mp4/steelrosejump.mp4',
                        '/src/assets/jpg/steelrose1.jpg',
                        '/src/assets/jpg/steelrose2.jpg',
                        '/src/assets/jpg/steelrose3.jpg',
                    ],
                    content: [
                        "[link]Steel Rose Revolution,https://oysterhey.itch.io/steel-rose-revolution[link] was made in one month for the Boss Rush 2025 game jam.",
                        "You play as a knight on a quest for love, battling through three tough enemies and a final boss.",
                        "Music made by my friend Andrew K.",
                        "[link]Source code,https://github.com/owenhey/owen-andrew-boss-rush-2025/[link]"
                    ],
                },
                {
                    title: "4D Missile",
                    date: "Sept 2024",
                    images: [
                        '/src/assets/jpg/4dmissile2.jpg',
                        '/src/assets/mp4/4dgameplay.mp4',
                        '/src/assets/jpg/4dmissile1.jpg',
                        '/src/assets/jpg/4dmissile3.jpg',
                    ],
                    content: [
                        "A sequel to the classic flash game 3D-missile - made as a challenge to myself in 1 month.",
                        "Emphasis on good project structure and coding patterns.",
                        "[link]Source code,https://github.com/owenhey/4d-missile/[link]"
                    ],
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

                portfolioSpotlight.value?.setToImage0();
            }

            return { portfolioObjects, onPieceSelected, selectedIndex, scrollingElement,
                    portfolioSpotlight
            }
        },
    }
);
</script>