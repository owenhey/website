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
                            return '#F00';
                        }
                    }
                    return '#DCA';
                });
            }

            onMounted(()=>{
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
                        .polygonAltitude(0.01)
                        .polygonSideColor(() => 'rgba(0, 100, 100, 0.15)')
                        .polygonStrokeColor(() => '#111');

                        if(props.mode === 'click'){
                            globe
                            .onPolygonClick(hoverD => handleCountryClick(hoverD))
                            .onPolygonHover(hoverD => globe!
                                .polygonAltitude(d => d === hoverD ? 0.02 : 0.01)
                                .polygonCapColor(d => d === hoverD ? '#FEC' : '#DCA'))
                            .polygonsTransitionDuration(50);
                        }

                        refreshHighlight();

                        const controls = globe.controls();
                        controls.dampingFactor = .3;
                    });
            })

            onUnmounted(()=>{
                
            })

            function handleCountryClick(name : any){
                emit('onCountryClick', name.properties!.ADMIN);
            }

            return {globeDiv, refreshHighlight}
        },
    }
);
</script>