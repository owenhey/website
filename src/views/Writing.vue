<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content" style="margin-top: 2vw;">
                <h2 v-if="shownPost === null" >Latest post</h2>
                <PostButton
                    v-if="shownPost === null && posts.length > 0"
                    :post-data="posts[0]"
                    :type="'latest'"
                    :img-file-name="'blogpost'"
                    >
                </PostButton>
                <h2 v-if="shownPost === null && posts.length > 1" style="margin-top: 2rem;">Other posts</h2>
                <div v-if="shownPost === null" class="post-card-grid">
                    <PostButton
                        v-if="posts.length > 1"
                        :post-data="posts[1]"
                        :img-file-name="'blogpost'"
                        >
                    </PostButton>
                    <PostButton
                        v-if="posts.length > 2"
                        :post-data="posts[2]"
                        :img-file-name="'blogpost'"
                        >
                    </PostButton>
                    <PostButton
                        v-if="posts.length > 3"
                        :post-data="posts[3]"
                        :img-file-name="'blogpost'"
                        >
                    </PostButton>
                    <PostButton
                        v-if="posts.length > 4"
                        :post-data="posts[4]"
                        :img-file-name="'blogpost'"
                        >
                    </PostButton>
                </div>
                <Post v-if="shownPost !== null" :post-data="shownPost"></Post>
			</div>
            <RouterView v-if="shownPost!==null" v-slot="{ Component }">
                <component :is="Component" :postData="shownPost"/>
            </RouterView>
		</MainContent>
	</div>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, ref, onMounted } from 'vue';
    import { RouterView, useRouter } from 'vue-router';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import PostButton from './PostButton.vue';
    import Post from './Posts/Post.vue';
    import { CreatePostData, PostData } from './Posts/PostParser';
    import posttemplate from '@/assets/posts/posttemplate.txt?raw';

    export default defineComponent({
        name: 'Writing',
        components:{
            MainContent, Nav, PostButton, Post
        },
        setup() {
            const router = useRouter();
            const shownPost = ref<PostData | null>(null);
            const posts = ref<PostData[]>([]);

            onMounted(()=>{
                console.log("post template: " + posttemplate);
                posts.value[0] = CreatePostData(posttemplate);
                posts.value[1] = CreatePostData(posttemplate);
            });

            return {router, shownPost, posts}
        },
    }
);
</script>