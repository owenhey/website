<template>
    <h2 >Latest</h2>
    <PostButton
        v-if="posts.length > 0"
        @on-select="handlePostClick"
        :post-data="posts[0]"
        :type="'latest'"
        >
    </PostButton>
    <h2  style="margin-top: 2rem;">Archive</h2>
    <div class="post-card-grid">
        <template v-for="(post, index) in posts">
            <PostButton 
                v-if="index !== 0"
                @on-select="handlePostClick"
                :post-data="posts[index]"
                :img-file-name="'blogpost'"
                >
            </PostButton>
        </template>
    </div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, ref, onMounted} from 'vue';
    import { CreatePostData, PostData } from './PostParser';
    import PostButton from '../PostButton.vue';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'Post',
        components:{
            PostButton
        },
        emits: [
            'onSelect'
        ],
        props:{
            postData:{
                required: false
            }
        },
        setup(props, {emit}) {
            const router = useRouter();
            const posts = ref<PostData[]>([]);
            const postTexts = import.meta.glob('@/assets/posts/*.txt', { as: 'raw' });

            onMounted(async ()=>{
                const loadedPosts: PostData[] = [];
                
                // import meta glob makes it a dictionary, turn it into an array
                for (const path in postTexts) {
                    try {
                        const content = await postTexts[path]();
                        const postData = CreatePostData(content);
                        loadedPosts.push(postData);
                    } catch (error) {
                        console.error(`Error loading post from ${path}:`, error);
                    }
                }
                
                loadedPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
                posts.value = loadedPosts;
            });

            function handlePostClick(postData : PostData){
                router.push(postData.url);
            }

            return {handlePostClick, posts}
        },
    }
);
</script>