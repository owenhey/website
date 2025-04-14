<template>
   <button class="flag-name-button" v-if="display==='name'">
        {{answerData.countryName}}
   </button>
   <div v-if="display==='flag'">
        <img style="width: 10vw;" :src="answerData.imageUrl"> 
   </div>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';
    import { FlagAnswerData } from '@/types';

    export default defineComponent({
        name: 'Leaf',
        props:{
            display: {
                required: true,
                type: String
            },
            answerData: {
                required: true,
                type: Object as PropType<FlagAnswerData>
            },
        },
        setup(props) {
            

            return { }
        },
    }
);
</script>