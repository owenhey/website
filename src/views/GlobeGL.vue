<template>
    <div ref="globeDiv" class="globe-canvas">

    </div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, onMounted, ref, onUnmounted, } from 'vue';
    import Globe, { GlobeInstance } from 'globe.gl';
    import { 
        Feature, 
    } from 'geojson';

    export default defineComponent({
        name: 'GlobeGL',
        props:{
            mode:{
                type: String,
                default: 'click'
            },
            countryName:{
                type: String,
                default: '_none_'
            }
        },
        emits:[
            'onCountryClick'
        ],
        setup(props, {emit}) {
            let globe : GlobeInstance | null;
            const globeDiv = ref<HTMLDivElement>();

            function refreshHighlight(){
                if(!globe) return;
                globe!.polygonCapColor((d:any)=>{
                    if(props.mode === 'click'){
                        return '#DCA';
                    }
                    else if(props.mode==='highlight'){
                        if(d.properties.ADMIN.toLowerCase() === props.countryName.toLowerCase()){
                            const bboxMiddle = [d.bbox[0] + d.bbox[2], d.bbox[1] + d.bbox[3]];
                            bboxMiddle[0] /= 2;
                            bboxMiddle[1] /= 2;
                            let altitude = 1;

                            const maxDiff = Math.max(Math.abs(d.bbox[0] - d.bbox[2]), Math.abs(d.bbox[1] - d.bbox[3]));
                            if(maxDiff < 2){
                                altitude = .3;
                            }
                            else if(maxDiff < 5){
                                altitude = .5;
                            }
                            else if (maxDiff < 15){
                                altitude = .7
                            }
                            else {
                                altitude = 1.25;
                            }


                            if(d.properties.ADMIN.toLowerCase() == 'russia'){ // have to manually fix russia
                                bboxMiddle[0] = 90 // longitude
                                bboxMiddle[1] = 60 // latitude
                                altitude = 1.5;
                            }

                            
                            globe?.pointOfView({
                                lat: bboxMiddle[1],
                                lng: bboxMiddle[0],
                                altitude: altitude
                            }, 500);
                            return '#F00';
                        }
                    }
                    return '#DCA';
                });
            }

            const raisedCountries = ['Andorra', 'Vatican City', 'Monaco', 'Liechtenstein', 'Singapore', 
                                     'Hong Kong', 'Macau', 'San Marino'
            ];

            function openGlobe(){
                fetch('/country_data.geojson').then(res => res.json()).then(countries =>
                {
                    console.log("Generating globe");
                    globe = new Globe(globeDiv.value!)
                        .globeImageUrl('/worldmap_blank.png')
                        .lineHoverPrecision(0)
                        .width(375)
                        .height(375)
                        .backgroundColor("#0000")
                        .showAtmosphere(false)
                        .polygonsData(countries.features.filter((d:Feature) => d.properties?.ISO_A2 !== 'AQ'))
                        .polygonAltitude((d : any)  => raisedCountries.includes(d.properties.ADMIN) ? 0.011 : 0.01)
                        .polygonSideColor(() => 'rgba(0, 100, 100, 0.15)')
                        .polygonStrokeColor(() => '#111');

                        if(props.mode === 'click'){
                            globe
                            .onPolygonClick(hoverD => handleCountryClick(hoverD))
                            .onPolygonHover(hoverD => globe!
                                .polygonCapColor(d => d === hoverD ? '#FEC' : '#DCA'))
                            .polygonsTransitionDuration(50);
                        }

                        refreshHighlight();

                        const controls = globe.controls();
                        controls.dampingFactor = .3;
                    });
            }

            function closeGlobe(){
                if (globe) {
                    globe.pauseAnimation();
                    globe._destructor();
                    globe = null;
                }
            }

            onMounted(()=>{
                openGlobe();
            })

            onUnmounted(()=>{
                closeGlobe();
            })

            function handleCountryClick(name : any){
                emit('onCountryClick', name.properties!.ADMIN);
            }

            return {globeDiv, refreshHighlight}
        },
    }
);
</script>