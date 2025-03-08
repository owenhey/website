<template>
    <div class="portfolio-spotlight">
        <div class="portfolio-spotlight-image-section">
            <img v-if="ShowingMediaIsPicture()" :src="content.images[selectedImage]">
            <div v-else class="video-container">
                <video style="width: 100%; height: 100%; object-fit: contain;" autoplay muted controls>
                    <source :src="content.images[selectedImage]" type="video/mp4">
                </video>
            </div>
            <div class="caroseul-buttons">
                <button class="p-s-caroseul-button" type="button" aria-label="Back"
                @click="prevPicture">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div class="circles">
                    <template v-for="(imageurl, index) in content.images">
                        <div :class="selectedImage === index ? 'selected' : ''"></div>
                    </template>
                </div>
                <button class="p-s-caroseul-button" type="button" aria-label="Forward" style="margin-left: -.3rem;"
                @click="nextPicture">
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
    import { PropType, defineComponent, computed, ref, } from 'vue';

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
            },
            ShowingMediaIsPicture(){
                const media = this.content.images[this.selectedImage];
                if(media[media.length - 1] === 'g'){
                    return true;
                }
                return false;
            }
        },
        setup(props) {
            const selectedImage = ref(0);

            function nextPicture(){
                selectedImage.value++;
                if(selectedImage.value >= props.content.images.length){
                    selectedImage.value = 0;
                }
                if(selectedImage.value === -1){
                    selectedImage.value = props.content.images.length - 1;
                }
            }

            function setToImage0(){
                selectedImage.value = 0;
            }

            function prevPicture(){
                selectedImage.value--;
                if(selectedImage.value >= props.content.images.length){
                    selectedImage.value = 0;
                }
                if(selectedImage.value === -1){
                    selectedImage.value = props.content.images.length - 1;
                }
            }

            return {
                selectedImage, nextPicture, prevPicture, setToImage0
            }
        },
    }
);
</script>