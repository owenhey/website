<template>
    <div class="single-post all-posts-link" style="margin-bottom: 2rem; text-decoration: underline;">
        <a style="color: var(--brown);" @click="router.push('allposts')">All posts</a>
    </div>
    <div class="single-post" style="margin: 0; padding: 0;">
        <span v-if="postData" class="single-post-date">{{ GetReadableDate(postData.date) }}</span>
        <h1>{{ postData?.title }}</h1>
        <template v-for="section in postData?.sections">
            <h2 v-if="section.sectionType === 'title'">
                <span v-html="FormatText(section.content[0])"></span>
            </h2>
            <h4 v-if="section.sectionType === 'subtitle'">
                <span v-html="FormatText(section.content[0])"></span>
            </h4>
            <p v-if="section.sectionType === 'paragraph'">
                <span v-html="FormatText(section.content[0])"></span>
            </p>
            <p class="code-block" v-if="section.sectionType === 'codeblock'">
                <div v-for="content in section.content">
                    <span v-html="FormatText(content)"></span>
                </div>
            </p>
            <div class="image-section" v-if="section.sectionType === 'centeredtext'">
                <span v-html="FormatText(section.content[0])"></span>
            </div>
            <ul v-if="section.sectionType === 'dotlist'">
                <li v-for="content in section.content">
                    <span v-html="FormatText(content)"></span>
                </li>
            </ul>
            <span v-if="section.sectionType === 'html'" 
                v-html="section.content[0]">
            </span>
            <div style="height: 1rem;" v-if="section.sectionType==='html'">

            </div>
            <ol v-if="section.sectionType === 'numlist'">
                <li v-for="content in section.content">
                    <span v-html="FormatText(content)"></span>
                </li>
            </ol>
            <figure class="image-section" 
                v-if="section.sectionType === 'image'">
                <img :src="section.content[0]">
                <figcaption v-if="section.content.length > 1">
                    <i>
                        <span v-html="FormatText(section.content[1])"></span>
                    </i>
                </figcaption>
            </figure>
            <figure class="video-section" 
                v-if="section.sectionType === 'video'">
                <video width="300" controls autoplay muted loop>
                    <source :src="section.content[0]" type="video/mp4">
                </video>
                <figcaption v-if="section.content.length > 1">
                    <i>
                        <span v-html="FormatText(section.content[1])"></span>
                    </i>
                </figcaption>
            </figure>
        </template>
    </div>
    <div class="single-post all-posts-link" style="display: flex; justify-content: center; margin-top: 3rem; margin-bottom: 3rem;">
        <a style="color: var(--brown);" @click="router.push('allposts')">Back to all posts</a>
    </div>
</template>
  
<script lang="ts">
    import '@/assets/posts.css';
    import { PropType, defineComponent, computed, ref, onMounted} from 'vue';
    import { CreatePostData, PostData } from './PostParser';
    import { useRoute, useRouter } from 'vue-router';
    import { GetReadableDate, ParseString } from '@/utils';

    export default defineComponent({
        name: 'Post',
        methods:{
            GetReadableDate(date : Date){
                return GetReadableDate(date);
            },

            FormatText(text : string){
                return ParseString(text);
            }
        },
        setup() {
            const postData = ref<PostData | null>(null);
            const postTexts = import.meta.glob('@/assets/posts/*.txt', { as: 'raw' });

            const route = useRoute();
            const router = useRouter();

            onMounted(async ()=>{
                // import meta glob makes it a dictionary, turn it into an array
                for (const path in postTexts) {
                    try {
                        const content = await postTexts[path]();
                        const parsedData = CreatePostData(content);

                        let postUrl = route.path.split('writing/')[1]; 
                        
                        if(parsedData.url === postUrl){
                            postData.value = parsedData;
                            break;
                        }
                    } catch (error) {
                        console.error(`Error loading post from ${path}:`, error);
                    }
                }
            });

            return { postData, router }
        },
    }
);
</script>