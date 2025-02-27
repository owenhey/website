<template>
    <div class="portfolio-spotlight">
        <div class="portfolio-spotlight-image-section">
            <img :src="content.images[0]">
            <div class="caroseul-buttons">
                <button class="p-s-caroseul-button" type="button" aria-label="Back">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button class="p-s-caroseul-button" type="button" aria-label="Forward">
                    <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="portfolio-spotlight-text-section">
            <h2><span v-html="FormatText(content.title)"></span></h2>
            <p><span v-html="FormatText(content.content)"></span></p>
        </div>
    </div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PortfolioContent } from '@/types';
import { ParseString } from '@/utils';
    import { PropType, defineComponent, computed, } from 'vue';

    export default defineComponent({
        name: 'PortfolioSpotlight',
        props: {
            content: {
                type: Object as PropType<PortfolioContent>,
                required: true
            }
        },
        methods:{
            FormatText(text : string){
                return ParseString(text);
            }
        },
        setup() {
            return {

            }
        },
    }
);
</script>