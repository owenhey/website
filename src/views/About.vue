<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content">
                <div style="height: 2rem;"></div>
                <div>
                    <img 
                        style="width: 50%; float: left; margin-right: 1rem; margin-bottom: .5rem; border-radius: 1rem;" 
                        src="/src/assets/jpg/me.jpg">
                    <h1 style="font-size: clamp(14pt, 3vw, 20pt); margin-bottom: .5rem;">
                        All about Owen Hey, a game developer living in Cambridge.</h1>
                    <p>
                        I've been developing games for ten years, the last three of which at FableVision Studios in Back Bay, Boston.
                    </p>
                    <p style="margin-top: .5rem;">
                        My strengths are my enthusiasm and attention to detail. I take pride in knowing 
                        which parts of an experience need that extra "lift" to fully engage with
                        the player. I am always eager to take the initative in those situations and have lots of 
                        experience building game architectures with juice and player feedback in mind.
                    </p>
                    <p style="margin-top: .5rem;">
                        As a developer at FableVision, I mostly work on games, websites, and interactives
                        for kids. These projects move quickly, and so I've had the opportunity
                        to contribute on a large variety of projects during my time here.
                    </p>
                    <h2 style="margin-top: 1rem;">Outside of work</h2>
                    <p style="margin-top: .5rem;"> 
                        My hobbies outside of work include soccer, travel, reading, and game jams.
                    </p>
                    <p style="margin-top: .5rem;">
                        The professional soccer team I follow, Tottenham Hotspur, is doing dreadfully at the moment, so to
                        distract myself from that I like to work on little coding challenges. You can learn
                        more about some of these projects under the Writing page.
                    </p>
                    <h2 style="margin-top: 1rem;">Contact</h2>
                    <p style="margin-top: .5rem;">
                        If you're looking to reach out, send me an email at <b>oysterhey@gmail.com</b>. Or in the 
                        meantime, look over my resume below.
                    </p>
                    <button @click="downloadResume" class="resume-button">View Resume</button>
                </div>
			</div>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';

    export default defineComponent({
        name: 'About',
        components:{
            MainContent, Nav
        },
        setup() {
            function downloadResume(){

            }

            return {downloadResume}
        },
    }
);
</script>