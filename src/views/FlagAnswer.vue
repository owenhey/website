<template>
   <button>
        {{answerData.countryName}}
   </button>
</template>
  
<script lang="ts">
    import { PropType, defineComponent, computed } from 'vue';
    import { FlagAnswerData } from '@/types';

    export default defineComponent({
        name: 'Leaf',
        props:{
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