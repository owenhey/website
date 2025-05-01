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
    import Globe, { GlobeInstance } from 'globe.gl';
    import { 
        Feature, 
        FeatureCollection, 
        Geometry, 
        Point, 
        LineString, 
        Polygon, 
        MultiPoint, 
        MultiLineString, 
        MultiPolygon, 
        GeometryCollection, 
        GeoJsonProperties
    } from 'geojson';

    export default defineComponent({
        name: 'About',
        components:{
            MainContent, Nav
        },
        setup() {
            onMounted(()=>{
                fetch('/country_data.geojson').then(res => res.json()).then(countries =>
                {
                    const globe : GlobeInstance = new Globe(document.getElementById('globeViz')!)
                        .globeImageUrl('/worldmap_blank.png')
                        .lineHoverPrecision(0)
                        .width(800)
                        .backgroundColor("#0000")
                        .polygonsData(countries.features.filter((d:Feature) => d.properties?.ISO_A2 !== 'AQ'))
                        .polygonAltitude(0.01)
                        .polygonSideColor(() => 'rgba(0, 100, 100, 0.15)')
                        .polygonStrokeColor(() => '#111')
                        .polygonCapColor(()=>'#DCA')
                            .onPolygonHover(hoverD => globe
                            .polygonAltitude(d => d === hoverD ? 0.02 : 0.01)
                            .polygonCapColor(d => d === hoverD ? '#FEC' : '#DCA')
                        )
                        .onPolygonClick(hoverD => handleCountryClick(hoverD))
                        .polygonsTransitionDuration(50);

                        const controls = globe.controls();
                        controls.dampingFactor = .3;
                    });
             })

             function handleCountryClick(name : any){
                console.log(name.properties?.ADMIN);
             }

            return {}
        },
    }
);
</script>