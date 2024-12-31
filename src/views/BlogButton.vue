<template>
    <button class="post-button" @click="router.push('/writing/' + postLink)">
        <img :src="`/src/assets/png/${imgFileName}.png`">
        <div>
            <h4> {{title}} </h4>
            <span> {{ description }} </span>
            <span class="post-date">{{date}}</span>
        </div>
    </button>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import router from '@/router';
    import { PropType, defineComponent, computed, } from 'vue';
import { useRouter } from 'vue-router';

    export default defineComponent({
        name: 'BlogButton',
        props:{
            imgFileName:{
                type: String,
                required: true
            },
            title:{
                type: String,
                required: true
            },
            date:{
                type: String,
                required: true
            },
            description:{
                type: String,
                required: true
            },
            postLink:{
                type: String,
                required: true
            }
        },
        setup() {
            const router = useRouter();

            return {router}
        },
    }
);
</script>