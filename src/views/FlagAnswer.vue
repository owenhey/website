<template>
   <button @click="onClick" class="flag-name-button" v-if="display==='name'"
        :style="greyOut ? 'opacity: 40%' : ''"
        :disabled="greyOut">
        {{answerData.countryName}}
   </button>
   <button @click="onClick" v-if="display==='flag'" class="flag-button-holder" 
        :style="greyOut ? 'opacity: 20%' : ''"
        :disabled="greyOut || !interactable">
        <img :src="answerData.imageUrl" draggable="false"> 
   </button>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';
    import { FlagAnswerData } from '@/types';

    export default defineComponent({
        name: 'Leaf',
        emits: [
            'onClick'
        ],
        props:{
            display: {
                required: true,
                type: String
            },
            answerData: {
                required: true,
                type: Object as PropType<FlagAnswerData>
            },
            greyOut: {
                required: false,
                type: Boolean
            },
            interactable: {
                required: false,
                default: true
            }
        },
        setup(props, {emit}) {
            function onClick(){
                emit('onClick', props.answerData);
            }

            return { onClick }
        },
    }
);
</script>