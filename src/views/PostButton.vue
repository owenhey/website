<template>
    <button :class="type === 'latest' ? 'post-button-latest' : 'post-button-card'" 
        @click="onClick">
        <img v-if="type === 'latest'" :src="`/src/assets/png/${imgFileName}.png`">
        <div v-if="type === 'latest'" >
            <h4> {{postData.title}} </h4>
            <span> {{ postData.description }} </span>
            <span class="post-date">{{getReadable(postData.date)}}</span>
        </div>
        <img v-if="type === 'card'" :src="`/src/assets/png/${imgFileName}.png`">
        <h4 v-if="type==='card'"> {{postData.title}} </h4>
        <p v-if="type==='card'"> {{ postData.description }} </p>
        <span v-if="type==='card'" style="margin-top: 1rem; text-align: right; float: right">{{getReadable(postData.date)}}</span>
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
            imgFileName:{
                type: String,
                required: true
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
                console.log("sf");
                emit('onSelect', props.postData);
            }

            return {router, onClick}
        },
    }
);
</script>