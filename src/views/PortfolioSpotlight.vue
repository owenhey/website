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
                <div class="circles">
                    <template v-for="imageurl in content.images">
                        <div></div>
                        <div></div>
                        <div class="selected"></div>
                        <div></div>
                        <div></div>
                    </template>
                </div>
                <button class="p-s-caroseul-button" type="button" aria-label="Forward" style="margin-left: -.3rem;">
                    <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div class="portfolio-spotlight-text-section">
            <h2 style="margin-bottom: .15rem;"><span v-html="FormatText(content.title)"></span></h2>
            <span><i>{{ content.date }}</i></span>
            <p v-for="paragraph in content.content" style="margin-top: 1rem;"><span v-html="FormatText(paragraph)"></span></p>
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