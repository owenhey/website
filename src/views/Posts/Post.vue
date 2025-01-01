<template>
    <h4>{{ postData.title }}</h4>
    <p>{{ postData.title }}</p>
    <p>{{ postData.date }}</p>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import { PostData } from './PostParser';

    export default defineComponent({
        name: 'Post',
        props:{
            postData:{
                required: true,
                type: Object as PropType<PostData>
            }
        },
        setup() {
            

            return {}
        },
    }
);
</script>