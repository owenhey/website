<template>
    <div class="flags-base">
        <div class="flags-content">
            <Nav class="flags-nav-header"></Nav>
            <h1>Welcome to the flag game</h1>
            <button class="vine-button" style="width: 10em; font-size: 14pt;" @click="openSettings">
                Game Options
            </button>
            <span v-html="question"></span>
            <div v-if="currentOptions.mode==='name'" 
                class="flag-button-holder no-input" 
                style="height: 20vh; width: auto; max-height: 300px;">
                <img :src="questionFlagUrl"> 
            </div>
            <span class="flag-feedback-text" v-html="feedbackText" :class="feedbackClass"></span>
            <div class="flag-answer-display" 
                v-if="currentOptions.mode !== 'name' || currentOptions.nameEntryType !== 'inputField'">
                <FlagAnswer
                    v-for="(answer, index) in questionAnswerList"
                    :answerData="answer"
                    :display="currentOptions.mode"
                    @onClick="handleAnswerPicked">
                </FlagAnswer>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: -1rem; translate: 2.3rem;" 
                v-if="currentOptions.mode === 'name' && currentOptions.nameEntryType === 'inputField'">
                <input class="flag-game-input raleway" @input="handleNameEntryInputChange" ref="nameInput" tabindex="1">
                <button class="vine-button" style="font-size: 10pt;" :tabindex="7">Guess</button>
            </div>
            <div class="flags-auto-options" 
                v-if="currentOptions.mode === 'name' && currentOptions.nameEntryType === 'inputField'">
                <template v-for="(option, index) in autoInputOptions">
                    <button class="flag-game-input-auto-option" v-if="index < 5" :tabindex="index + 2" @keydown="handleAutoOptionKey"
                        @click="handleAnswerPicked(option)"
                        :style="getAutoOptionBorderStyle(index == 0, index == autoInputOptions.length - 1 || index == 4)">
                        {{ option.countryName }}
                    </button>
                </template>
            </div>
        </div>
	</div>
    <dialog ref="optionsDialogRef">
        <div class="flags-options-dialog">
            <h2>Flag Game Settings</h2>
            <h3>Mode</h3>
            <div class="flag-mode-settings">
                <button class="flag-toggle-button" 
                    :class="tempOptions.mode === 'flag' ? 'selected' : ''"
                    @click="tempOptions.mode = 'flag'">
                    Flag
                </button>
                <button class="flag-toggle-button" 
                    :class="tempOptions.mode === 'name' ? 'selected' : ''"
                    @click="tempOptions.mode = 'name'">
                    Name
                </button>
            </div>
            <h3 v-if="tempOptions.mode === 'name'">Answer Type</h3>
            <div class="flag-mode-settings" v-if="tempOptions.mode === 'name'">
                <button class="flag-toggle-button"
                    :class="tempOptions.nameEntryType === 'button' ? 'selected' : ''"
                    @click="tempOptions.nameEntryType = 'button'">
                    Button
                </button>
                <button class="flag-toggle-button"
                    :class="tempOptions.nameEntryType === 'inputField' ? 'selected' : ''"
                    @click="tempOptions.nameEntryType = 'inputField'">
                    Input Field
                </button>
            </div>
            <h3>Answer Count: {{ tempOptions.answerCount }}</h3>
            <input type="range" min="2" max="20" value="6" class="flag-count-slider" ref="countSlider"
                style="margin-bottom: 1rem;"
                @input="handleSliderChange">
            <h3>Regions</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="flag-toggle-button" v-for="region in regionList"
                    :class="(tempOptions.regionFilter.includes(region)) ? 
                     'selected' : ''"
                     @click="toggleRegion(region)">
                    {{ region }}
                </button>
            </div>
            <div style="display: flex; gap: 10px; justify-content: end;">
                <button 
                    class="vine-button" 
                    style="font-size: 12pt;" 
                    @click="closeSettings">Cancel
                </button>
                <button 
                    class="vine-button" 
                    style="font-size: 12pt;" 
                    @click="saveSettings">Save
                </button>
            </div>
        </div>
    </dialog>
</template>
  
<script lang="ts">
    import '@/assets/flags.css';
    import { PropType, defineComponent, computed, ref, onMounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import FlagAnswer from './FlagAnswer.vue';
    import { FlagAnswerData, FlagGameOptions } from '@/types';
    import { GetDefaultFlagGameOptions } from '@/utils';

    export default defineComponent({
        name: 'Flags',
        components:{
            MainContent, Nav, FlagAnswer
        },
        methods:{
            getAutoOptionBorderStyle(isFirst : boolean, isLast : boolean){
                if(isFirst && isLast){
                    return 'border-radius: 5px 5px 5px 5px;';
                }

                if(isLast){
                    return 'border-radius: 0 0 5px 5px; border-top: none';
                }
                if(isFirst){
                    return 'border-radius: 5px 5px 0 0;';
                }
                return 'border-radius: 0; border-top: none';
            }
        },
        setup() {
            // options
            const optionsDialogRef = ref<HTMLDialogElement>();
            const currentOptions = ref<FlagGameOptions>(GetDefaultFlagGameOptions());
            const tempOptions = ref<FlagGameOptions>(GetDefaultFlagGameOptions());
            const countSlider = ref<HTMLInputElement>();
            const regionList = ref<string[]>([]);

            const question = ref("Which flag is this?");
            const questionFlagUrl = ref("");
            const feedbackText = ref("");

            const answerList = ref<FlagAnswerData[]>([]);
            const answerPool = ref<FlagAnswerData[]>([]);
            const questionAnswerList = ref<FlagAnswerData[]>([]);
            const previousAnswer = ref<FlagAnswerData>();
            const correctAnswer = ref<FlagAnswerData>();

            const autoInputOptions = ref<FlagAnswerData[]>([]);
            const nameInput = ref<HTMLInputElement>();
            const feedbackClass = ref("");



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
                    
                    regionList.value = [...new Set(answerList.value.map(x=>x.area))];
                    generateAnswerPool();
                    generateQuestion();
                } catch (error) {
                    console.error('Error loading flag data:', error);
                }
            }

            function generateQuestion(){
                // Choose a random flag
                let randomIndex = Math.floor(Math.random() * answerPool.value.length);
                while((answerPool.value[randomIndex].countryName === previousAnswer.value?.countryName)){
                    randomIndex = Math.floor(Math.random() * answerPool.value.length);
                }
                correctAnswer.value = answerPool.value[randomIndex];

                if(currentOptions.value.mode === 'flag'){
                    question.value = `Which flag is <b>${correctAnswer.value.countryName}<b>?`;
                }
                else{
                    question.value = `Which flag is this?`;
                    questionFlagUrl.value = correctAnswer.value.imageUrl;
                }

                // Generate n number of other options
                questionAnswerList.value = 
                    getRandomOptions(correctAnswer.value, currentOptions.value.answerCount);
            }

            function getRandomOptions(correctAnswer : FlagAnswerData, numOptions : number) {
                numOptions = Math.min(numOptions, answerPool.value.length);
                const availableAnswers = [...answerPool.value];
                const correctIndex = availableAnswers.findIndex(answer => 
                    answer.countryName === correctAnswer.countryName
                );
                availableAnswers.splice(correctIndex, 1);
                const shuffledAnswers = availableAnswers.sort(() => Math.random() - 0.5);
                const wrongAnswers = shuffledAnswers.slice(0, numOptions - 1);
                const selectedOptions = [...wrongAnswers, correctAnswer];
                return selectedOptions.sort(() => Math.random() - 0.5);
            }

            function handleAnswerPicked(answerPicked : FlagAnswerData){
                console.log(answerPicked.countryName);

                if(nameInput.value){
                    nameInput.value.value = '';
                    autoInputOptions.value = [];
                    focusInputField();
                }

                if(correctAnswer.value?.countryName == answerPicked.countryName){
                    feedbackText.value = "Correct!";
                    generateQuestion();
                }
                else{
                    feedbackClass.value = "shake";
                    setTimeout(() => {
                        feedbackClass.value = "";
                    }, 500);
                    if(currentOptions.value.mode === 'flag'){
                        feedbackText.value = `Incorrect! That's <b>${answerPicked.countryName}<b>`;
                    }
                    else{
                        feedbackText.value = "Incorrect!";
                    }
                }
            }

            function openSettings(){
                tempOptions.value = JSON.parse(JSON.stringify(currentOptions.value));
                optionsDialogRef.value?.showModal();
            }

            function saveSettings(){
                const beforeSettings = JSON.stringify(currentOptions.value);
                const afterSettings = JSON.stringify(tempOptions.value);
                const needToRegenQuestion = beforeSettings != afterSettings;

                currentOptions.value = JSON.parse(JSON.stringify(tempOptions.value));
                closeSettings();

                if(needToRegenQuestion){
                    generateAnswerPool();
                    generateQuestion();
                }
            }

            function toggleRegion(region :string){
                if(tempOptions.value.regionFilter.includes(region)){
                    const index = tempOptions.value.regionFilter.indexOf(region);
                    tempOptions.value.regionFilter.splice(index, 1);
                }
                else{
                    tempOptions.value.regionFilter.push(region);
                }
            }

            function closeSettings(){
                optionsDialogRef.value?.close();
            }

            function generateAnswerPool(){
                answerPool.value = answerList.value;
                if(currentOptions.value.regionFilter.length !== 0){
                    answerPool.value = answerList.value.filter(x=>currentOptions.value.regionFilter.includes(x.area));
                }
            }

            const handleSliderChange = (event: Event): void => {
                const target = event.target as HTMLInputElement;
                const value = parseInt(target.value, 10);
                
                tempOptions.value.answerCount = value;
            };

            const handleNameEntryInputChange = (event: Event): void => {
                const target = event.target as HTMLInputElement;
                const value = target.value;

                if(value.length < 2){
                    autoInputOptions.value = [];
                    return;
                }
                
                autoInputOptions.value = answerPool.value.filter((x=>{
                    for (let index = 0; index < value.length; index++) {
                        const letter = value[index];
                        if(x.countryName.length <= index) return false;
                        if(x.countryName[index].toLowerCase() != letter.toLowerCase()) return false;
                    }
                    return true;
                }));
            };

            const handleAutoOptionKey = (event: KeyboardEvent): void => {
                if(!nameInput.value) return;

                if(event.key === 'Tab'){
                    return;
                }

                if(event.key === 'Enter'){
                    // Find the one currently selected
                    const buttonText = (event.target as HTMLElement).textContent;
                    for (let index = 0; index < autoInputOptions.value.length; index++) {
                        const element = autoInputOptions.value[index];
                        if(element.countryName === buttonText){
                            handleAnswerPicked(element);
                        }
                    }
                    focusInputField();
                }

                if(event.key === 'ArrowDown'){
                    event.preventDefault();
                    console.log("Hello");
                    simulateTabNavigation(false);
                }
                if(event.key === 'ArrowUp'){
                    event.preventDefault();
                    simulateTabNavigation(true);
                }

                if(event.key === 'Backspace' || event.key == 'Delete'){
                    focusInputField();
                }

                if (/^[a-zA-Z0-9]$/.test(event.key)) {
                    event.preventDefault();
                    focusInputField();
                    nameInput.value.value += event.key;
                }

            };

            function focusInputField(){
                if(nameInput.value){
                    nameInput.value.focus();
                }
            }

            const simulateTabNavigation = (reverse: boolean = false): void => {
                const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const elements = Array.from(document.querySelectorAll(focusableElements)) as HTMLElement[];
                
                // No hidden elements
                const visibleElements = elements.filter(el => {
                    return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
                });
                
                if (visibleElements.length === 0) return;
                
                // Get the currently focused element
                const currentElement = document.activeElement as HTMLElement;
                const currentIndex = visibleElements.indexOf(currentElement);
                
                let nextIndex;
                if (reverse) {
                    // Go to previous element
                    nextIndex = currentIndex <= 0 ? visibleElements.length - 1 : currentIndex - 1;
                } else {
                    // Go to next element
                    nextIndex = currentIndex >= visibleElements.length - 1 ? 0 : currentIndex + 1;
                }
                
                visibleElements[nextIndex].focus();
            };

            return {
                openSettings, optionsDialogRef, closeSettings, question, countSlider,
                answerList, questionAnswerList, feedbackText, handleAnswerPicked, 
                tempOptions, currentOptions, saveSettings, handleSliderChange,
                questionFlagUrl, regionList, toggleRegion, autoInputOptions,
                handleNameEntryInputChange, nameInput, feedbackClass, handleAutoOptionKey
            }
        },
    }
);
</script>