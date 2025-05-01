<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			 <div id="globeViz" class="globe-canvas"></div>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, onMounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import resume from '../assets/downloads/Resume Owen Hey.pdf';
    import Globe from 'globe.gl';

    export default defineComponent({
        name: 'About',
        components:{
            MainContent, Nav
        },
        setup() {
            onMounted(()=>{

                const globe = new Globe(document.getElementById('globeViz')!)
                    .globeImageUrl('/public/worldmap.jpg')
                    .pointAltitude('size')
                    .width(800)
                    .showAtmosphere(false)
                    .backgroundColor('#00000000')
                    .pointColor('color');
                const controls = globe.controls();

                controls.dampingFactor = .3;
            })

            return {}
        },
    }
);
</script>