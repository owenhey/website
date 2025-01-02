<template>
    <span v-if="postData" class="single-post-date">{{ GetReadableDate(postData.date) }}</span>
    <h1>{{ postData?.title }}</h1>
    <h3>{{ postData?.title }}</h3>
    <p>{{ postData?.description }}</p>
    <p>Occaecat magna ullamco culpa nulla Lorem do. Elit ad esse laboris ex laboris voluptate deserunt ea quis anim magna. Reprehenderit minim consequat nostrud incididunt velit nostrud culpa. Aliqua et quis amet exercitation sunt. Nostrud commodo deserunt consectetur ipsum ea ad sint proident minim elit occaecat adipisicing laboris. Elit cupidatat reprehenderit laborum laborum mollit excepteur.</p>
    <p>{{ postData?.description }}</p>
</template>
  
<script lang="ts">
    import '@/assets/posts.css';
    import { PropType, defineComponent, computed, ref, onMounted} from 'vue';
    import { CreatePostData, PostData } from './PostParser';
    import { useRoute } from 'vue-router';
    import { GetReadableDate } from '@/utils';

    export default defineComponent({
        name: 'Post',
        methods:{
            GetReadableDate(date : Date){
                return GetReadableDate(date);
            }
        },
        setup() {
            const postData = ref<PostData | null>(null);
            const postTexts = import.meta.glob('@/assets/posts/*.txt', { as: 'raw' });

            const route = useRoute();

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

            return { postData }
        },
    }
);
</script>