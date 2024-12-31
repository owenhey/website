<template>
    <h2>Latest post</h2>
    <BlogButton
        :title="'Charting My Year'"
        :description="'In 2024, I decided to rate every day of the year with a score from 1-10. Here are some visualizations with that data.'"
        :img-file-name="'blogpost'"
        :date="'December 28th, 2024'"
        :post-link="'python'"
        >
    </BlogButton>
    <h2 style="margin-top: 2rem;">Other posts</h2>
    <BlogButton
        :title="'My Title 2'"
        :description="'The description here'"
        :img-file-name="'blogpost'"
        :date="'January 6th'"
        :post-link="'python'"
        >
    </BlogButton>
    <BlogButton
        :title="'My Title 3'"
        :description="'The description here'"
        :img-file-name="'blogpost'"
        :date="'January 6th'"
        :post-link="'python'"
        >
    </BlogButton>
    <BlogButton
        :title="'My Title 4'"
        :description="'The description here'"
        :img-file-name="'blogpost'"
        :date="'January 6th'"
        :post-link="'python'"
        >
    </BlogButton>
    <BlogButton
        :title="'My Title 5'"
        :description="'The description here'"
        :img-file-name="'blogpost'"
        :date="'January 6th'"
        :post-link="'python'"
        >
    </BlogButton>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import BlogButton from './BlogButton.vue';

    export default defineComponent({
        name: 'AllPosts',
        components:{
            BlogButton
        },
        setup() {
            return {}
        },
    }
);
</script>