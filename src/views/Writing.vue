<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div class="scrolling-content" style="margin-top: 2vw;">
                <RouterView/>
			</div>
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

    export default defineComponent({
        name: 'Writing',
        components:{
            MainContent, Nav, PostButton, Post
        },
        setup() {
            
        },
    }
);
</script>