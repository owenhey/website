<template>
    <button class="portfolio-button" @click="onClick">
        <h4>{{ data.title }}</h4>
        <div class="image-container">
            <div class="portfolio-button-gradient">

            </div>
            <img :src="data.images[0]">
        </div>
    </button>
</template>
  
<script lang="ts">
    import '@/assets/base.css';
    import { PropType, defineComponent, computed, } from 'vue';
    import { useRouter } from 'vue-router';
    import { GetReadableDate } from '@/utils';
    import { PortfolioContent } from '@/types';

    export default defineComponent({
        name: 'PostButton',
        methods:{
            getReadable(date : Date){
                return GetReadableDate(date);
            }
        },
        props:{
            data:{
                type: Object as PropType<PortfolioContent>,
                required: true,
            }
        },
        emits:[
            'onSelect'
        ],
        setup(props, {emit}) {
            const router = useRouter();

            function onClick(){
                emit('onSelect', props.data);
            }

            return {router, onClick}
        },
    }
);
</script>