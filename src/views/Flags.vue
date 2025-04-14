<template>
    <div class="flags-base">
        <Nav class="flags-nav-header"></Nav>
        <h1>Welcome to the flag game</h1>
        <button class="vine-button" style="width: 10em; font-size: 14pt;" @click="openSettings">
            Game Options
        </button>
        <span>{{ questionLeadIn }} <b> {{ questionTarget }}</b></span>
        <div class="flag-answer-display">
            <FlagAnswer
                v-for="answer in answerList"
                :answerData="answer">
            </FlagAnswer>
        </div>
	</div>
    <dialog ref="optionsDialogRef">
        <div class="flags-options-dialog">
            <h2>Flag Game Settings</h2>
            <h3>Mode</h3>
            <div class="flag-mode-settings">
                <button class="vine-button" style="font-size: 10pt;">
                    Flag
                </button>
                <button class="vine-button" style="font-size: 10pt;">
                    Name
                </button>
            </div>
            <h3>Answer Type</h3>
            <div class="flag-mode-settings">
                <button class="vine-button" style="font-size: 10pt;">
                    Button
                </button>
                <button class="vine-button" style="font-size: 10pt;">
                    Input Field
                </button>
            </div>
            <button 
                class="vine-button" 
                style="font-size: 12pt; margin: auto; margin-top: 20px;" 
                @click="closeSettings">Close
            </button>
        </div>
    </dialog>
</template>
  
<script lang="ts">
    import '@/assets/flags.css';
    import { PropType, defineComponent, computed, ref, onMounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import FlagAnswer from './FlagAnswer.vue';
    import { FlagAnswerData } from '@/types';

    export default defineComponent({
        name: 'Flags',
        components:{
            MainContent, Nav, FlagAnswer
        },
        setup() {
            const optionsDialogRef = ref<HTMLDialogElement>();

            const questionLeadIn = ref("Which flag is this?");
            const questionTarget = ref("Armenia");

            const answerList = ref<FlagAnswerData[]>([]);

            let allFlagData : FlagAnswerData[];

            onMounted(()=>{
                loadInFlagData();
            })

            async function loadInFlagData(){
                try {
                    const response = await fetch('/src/assets/flags.csv');
                    const csvText = await response.text();
                    const lines = csvText.split('\n');
                    const headers = lines[0].split(',');

                    // Skip header row and map data to FlagAnswerData
                    allFlagData = lines
                        .slice(1)
                        .filter(line => line.trim() !== '')
                        .map(line => {
                            const values = line.split(',');
                            return {
                                countryName: values[1], // Country column
                                imageUrl: values[2],    // Flag_image_url column
                                area: values[3]         // Region column
                            };
                    });

                    allFlagData.forEach(element => {
                        answerList.value.push(element);
                    });
                } catch (error) {
                    console.error('Error loading flag data:', error);
                }
            }

            function openSettings(){
                optionsDialogRef.value?.showModal();
            }

            function closeSettings(){
                optionsDialogRef.value?.close();
            }

            return {
                openSettings, optionsDialogRef, closeSettings, questionLeadIn, questionTarget,
                answerList
            }
        },
    }
);
</script>