<template>
    <button :class="type === 'latest' ? 'post-button-latest' : 'post-button-card'" 
        @click="onClick">
        <img v-if="type === 'latest'" :src="`/src/assets/jpg/${postData.thumbnail}.jpg`">
        <div v-if="type === 'latest'" >
            <h4> {{postData.title}} </h4>
            <span><i> {{ postData.description }}</i></span>
            <span class="post-date">{{getReadable(postData.date)}}</span>
        </div>
        <div class="img-container">
            <img v-if="type === 'card'" :src="`/src/assets/jpg/${postData.thumbnail}.jpg`">
        </div>
        <h4 v-if="type==='card'"> {{postData.title}} </h4>
        <p v-if="type==='card'"> <i> {{ postData.description }}</i> </p>
        <span v-if="type==='card'" style="margin-top: auto; padding-top: 1rem; text-align: right; float: right">{{getReadable(postData.date)}}</span>
    </button>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import router from '@/router';
    import { PropType, defineComponent, computed, } from 'vue';
    import { useRouter } from 'vue-router';
    import { PostData } from './Posts/PostParser';
    import { GetReadableDate } from '@/utils';

    export default defineComponent({
        name: 'PostButton',
        methods:{
            getReadable(date : Date){
                return GetReadableDate(date);
            }
        },
        props:{
            type:{ // 'latest' or 'card'
                type: String,
                default: 'card'
            },
            postData:{
                type: Object as PropType<PostData>,
                required: true,
            }
        },
        emits:[
            'onSelect'
        ],
        setup(props, {emit}) {
            const router = useRouter();

            function onClick(){
                emit('onSelect', props.postData);
            }

            return {router, onClick}
        },
    }
);
</script>