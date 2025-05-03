<template>
    <div class="flags-base">
        <div class="flags-content" ref="flagContentDiv">
            <Nav class="flags-nav-header"></Nav>
            <h1 style="text-align: center;">Welcome to the flag game</h1>
            <button class="vine-button" style="width: 10em; margin-left: auto; font-size: 10pt;" @click="openSettings">
                Game Options
            </button>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                <span v-html="question" style="text-align: center;"></span>
                <button 
                    class="vine-button" 
                    style="font-size: 10pt; translate: 0px -5px;"
                    @click="skipQuestion"
                    >Skip
                </button>
            </div>
            <div v-if="currentOptions.questionMode==='flag'" 
                class="flag-button-holder no-input" 
                style="height: 20vh; width: auto; max-height: 300px;">
                <img :src="questionFlagUrl"> 
            </div>
            <div class="globe-container" v-if="currentOptions.questionMode === 'globe'">
                <GlobeGL 
                    ref="globeQuestionRef"
                    :mode="'highlight'"
                    :countryName="correctAnswer?.countryName">
                </GlobeGL>
            </div>
            <span class="flag-feedback-text" v-html="feedbackText" :class="feedbackClass"></span>
            <div class="flag-answer-display" 
                v-if="currentOptions.answerMode !== 'name' || currentOptions.nameEntryType !== 'inputField'">
                <FlagAnswer
                    v-for="(answer, index) in questionAnswerList"
                    :answerData="answer"
                    :display="currentOptions.answerMode"
                    @onClick="handleAnswerPicked">
                </FlagAnswer>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: -1rem; translate: 2.3rem;" 
                v-if="currentOptions.answerMode === 'name' && currentOptions.nameEntryType === 'inputField'">
                <input class="flag-game-input raleway" 
                    @input="handleNameEntryInputChange" 
                    ref="nameInput" 
                    tabindex="1"
                    @keydown="handleNameInputKey"
                    @focus="autoOptionFocused = -1">
                <button 
                    class="vine-button" 
                    style="font-size: 10pt;" 
                    :tabindex="7" 
                    @click="tryGuessOfInput()"
                    @keydown="handleGuessInputKey"
                    ref="guessButton">
                    Guess
                </button>
            </div>
            <div class="flags-auto-options" 
                v-if="currentOptions.answerMode === 'name' && currentOptions.nameEntryType === 'inputField'">
                <template v-for="(option, index) in autoInputOptions">
                    <button class="flag-game-input-auto-option" 
                        v-if="index < 5" :tabindex="index + 2"
                        :id="`autoOption${index}`"
                        @keydown="handleAutoOptionKey"
                        @click="handleAnswerPicked(option)"
                        @focus="handleAutoOptionFocused(index)"
                        :style="getAutoOptionBorderStyle(index == 0, index == autoInputOptions.length - 1 || index == 4)">
                        {{ option.countryName }}
                    </button>
                </template>
            </div>
            <div class="globe-container" v-if="currentOptions.answerMode === 'globe'">
                <GlobeGL 
                    ref="globeAnswerRef"
                    @onCountryClick="handleFlagCountryClicked">
                </GlobeGL>
            </div>
        </div>
	</div>
    <dialog ref="optionsDialogRef">
        <div class="flags-options-dialog">
            <h2>Flag Game Settings</h2>
            <h3>Question Mode</h3>
            <div class="flag-mode-settings">
                <button class="flag-toggle-button" 
                    :class="tempOptions.questionMode === 'flag' ? 'selected' : ''"
                    @click="tempOptions.questionMode = 'flag'">
                    Flag
                </button>
                <button class="flag-toggle-button" 
                    :class="tempOptions.questionMode === 'name' ? 'selected' : ''"
                    @click="tempOptions.questionMode = 'name'">
                    Name
                </button>
                <button class="flag-toggle-button" 
                    :class="tempOptions.questionMode === 'globe' ? 'selected' : ''"
                    @click="tempOptions.questionMode = 'globe'">
                    Globe
                </button>
            </div>
            <h3>Answer Mode</h3>
            <div class="flag-mode-settings">
                <button class="flag-toggle-button" 
                    :class="tempOptions.answerMode === 'flag' ? 'selected' : ''"
                    @click="tempOptions.answerMode = 'flag'">
                    Flag
                </button>
                <button class="flag-toggle-button" 
                    :class="tempOptions.answerMode === 'name' ? 'selected' : ''"
                    @click="tempOptions.answerMode = 'name'">
                    Name
                </button>
                <button class="flag-toggle-button" 
                    :class="tempOptions.answerMode === 'globe' ? 'selected' : ''"
                    @click="tempOptions.answerMode = 'globe'">
                    Globe
                </button>
            </div>
            <h3 :style="tempOptions.answerMode==='name' ? '' : 'opacity: 20%'">Name Input Type</h3>
            <div class="flag-mode-settings" :style="tempOptions.answerMode==='name' ? '' : 'opacity: 20%'">
                <button class="flag-toggle-button"
                    :disabled="!(tempOptions.answerMode==='name')"
                    :class="tempOptions.nameEntryType === 'button' ? 'selected' : ''"
                    @click="tempOptions.nameEntryType = 'button'">
                    Button
                </button>
                <button class="flag-toggle-button"
                    :disabled="!(tempOptions.answerMode==='name')"
                    :class="tempOptions.nameEntryType === 'inputField' ? 'selected' : ''"
                    @click="tempOptions.nameEntryType = 'inputField'">
                    Input Field
                </button>
            </div>
            <h3 :style="showAnswerCountSlider() ? '' : 'opacity: 20%'">
                Answer Count: {{ tempOptions.answerCount }}
            </h3>
            <input type="range" min="2" max="20" value="6" class="flag-count-slider" ref="countSlider"
                :style="showAnswerCountSlider() ? '' : 'opacity: 20%'"
                :disabled="!showAnswerCountSlider()"
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
            <div style="display: flex; gap: 10px; justify-content: end; margin-top: 20px;">
                <span style="color: red;" v-if="tempOptions.answerMode === tempOptions.questionMode">
                    Answer and question mode cannot match.
                </span>
                <button 
                    class="vine-button" 
                    style="font-size: 12pt;" 
                    @click="closeSettings">Cancel
                </button>
                <button 
                    class="vine-button" 
                    style="font-size: 12pt;" 
                    :disabled="tempOptions.answerMode === tempOptions.questionMode"
                    @click="saveSettings">Save
                </button>
            </div>
        </div>
    </dialog>
</template>
  
<script lang="ts">
    import '@/assets/flags.css';
    import { PropType, defineComponent, computed, ref, onMounted, onUnmounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import FlagAnswer from './FlagAnswer.vue';
    import { FlagAnswerData, FlagGameOptions } from '@/types';
    import { GetDefaultFlagGameOptions } from '@/utils';
    import { Feature } from 'geojson';
    import Globe, { GlobeInstance } from 'globe.gl';
    import GlobeGL from './GlobeGL.vue';

    export default defineComponent({
        name: 'Flags',
        components:{
            MainContent, Nav, FlagAnswer, GlobeGL
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
            },
            showAnswerCountSlider(){
                const goodForFlag = this.tempOptions.answerMode === 'flag';
                const goodForName = this.tempOptions.answerMode === 'name' && this.tempOptions.nameEntryType === 'button';
                return goodForName || goodForFlag;
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
            // Just has one copy of everything so all the countries show up before showing again
            const pseudoRandomPool = ref<FlagAnswerData[]>([]);
            const questionAnswerList = ref<FlagAnswerData[]>([]);
            const correctAnswer = ref<FlagAnswerData>();

            const autoInputOptions = ref<FlagAnswerData[]>([]);
            const nameInput = ref<HTMLInputElement>();
            const guessButton = ref<HTMLButtonElement>();
            const feedbackClass = ref("");
            const autoOptionFocused = ref(-1);

            let allFlagData : FlagAnswerData[];

            // Globe stuff
            const flagContentDiv = ref<HTMLDivElement>();
            const globeAnswerRef = ref<InstanceType<typeof GlobeGL>>();
            const globeQuestionRef = ref<InstanceType<typeof GlobeGL>>();

            onMounted(()=>{
                loadInFlagData();
                document.getElementById('click-me-text')?.classList.add('invisible');
            })

            onUnmounted(()=>{
                document.getElementById('click-me-text')?.classList.remove('invisible');
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
                if(!pseudoRandomPool.value || pseudoRandomPool.value.length == 0){
                    pseudoRandomPool.value = answerPool.value.filter(x=>true);
                }
                // Choose a random flag
                let randomIndex = Math.floor(Math.random() * pseudoRandomPool.value.length);
                correctAnswer.value = pseudoRandomPool.value[randomIndex];

                if(currentOptions.value.questionMode === 'name'){
                    question.value = `Which flag is <b>${correctAnswer.value.countryName}<b>?`;
                }
                else if(currentOptions.value.questionMode ==='flag'){
                    question.value = `Which flag is this?`;
                    questionFlagUrl.value = correctAnswer.value.imageUrl;
                }
                else if(currentOptions.value.questionMode === 'globe'){
                    if(currentOptions.value.answerMode === 'flag'){
                        question.value = `Which flag represents this country?`;
                    }
                    else if(currentOptions.value.answerMode === 'name'){
                        question.value = `Which country is this?`;
                    }

                    setTimeout(() => {
                        globeQuestionRef.value?.refreshHighlight();
                    }, 25);
                }

                // Generate n number of other options
                questionAnswerList.value = 
                    getRandomOptions(correctAnswer.value, currentOptions.value.answerCount);

                pseudoRandomPool.value.splice(randomIndex, 1);
            }

            function skipQuestion(){
                if(currentOptions.value.questionMode != 'name'){
                    feedbackText.value = `That was <b>${correctAnswer.value?.countryName}</b>`
                }
                generateQuestion();
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
                autoOptionFocused.value = -1;

                if(nameInput.value){
                    nameInput.value.value = '';
                    autoInputOptions.value = [];
                    focusInputField();
                }

                if(correctAnswer.value?.countryName == answerPicked.countryName){
                    feedbackText.value = `<b>${answerPicked.countryName}</b> is correct!`;
                    generateQuestion();
                }
                else{
                    feedbackClass.value = "shake";
                    setTimeout(() => {
                        feedbackClass.value = "";
                    }, 500);
                    if(currentOptions.value.answerMode === 'flag'){
                        feedbackText.value = `Incorrect! That's <b>${answerPicked.countryName}</b>`;
                    }
                    else{
                        feedbackText.value = `<b>${answerPicked.countryName}</b> is incorrect!`;
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
                pseudoRandomPool.value = answerPool.value.filter(x=>true);
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

            const handleNameInputKey = (event: KeyboardEvent): void => {
                if(!nameInput.value) return;
                if(event.key === 'ArrowDown'){
                    event.preventDefault();
                    const firstAutoOption = document.getElementById('autoOption0');
                    if(firstAutoOption){
                        firstAutoOption.focus();
                    }
                }
                if(event.key === 'Enter'){
                    if(autoInputOptions.value.length == 0) return;
                    event.preventDefault();
                    const countryName = autoInputOptions.value[0].countryName;
                    allFlagData.forEach(element => {
                        if(element.countryName == countryName){
                            handleAnswerPicked(element);
                            return;
                        }
                    });
                }
            }

            const handleGuessInputKey = (event: KeyboardEvent): void => {
                if(!nameInput.value) return;
                if(event.key === 'ArrowUp'){
                    event.preventDefault();
                    const lastAutoOption = document.getElementById(`autoOption${autoInputOptions.value.length-1}`);
                    if(lastAutoOption){
                        lastAutoOption.focus();
                    }
                }
            }

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

                    // Override if bottom one
                    if(autoOptionFocused.value === Math.max(0, autoInputOptions.value.length - 1)){
                        guessButton.value?.focus();
                        return;
                    }
                    simulateTabNavigation(false);
                }
                if(event.key === 'ArrowUp'){
                    event.preventDefault();

                    // Override if top one
                    if(autoOptionFocused.value === 0){
                        nameInput.value?.focus();
                        return;
                    }

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

            function handleAutoOptionFocused(index : number){
                autoOptionFocused.value = index;
            }

            function tryGuessOfInput(){
                if(!nameInput.value) return;
                
                const enteredCountryName = nameInput.value.value.toLowerCase();
                allFlagData.forEach(element => {
                    if(element.countryName.toLowerCase() == enteredCountryName){
                        handleAnswerPicked(element);
                        return;
                    }
                });
            }

            function handleFlagCountryClicked(countryName : string){
                for (let index = 0; index < allFlagData.length; index++) {
                    const element = allFlagData[index];
                    if(element.countryName.toLowerCase() == countryName.toLowerCase()){
                        handleAnswerPicked(element);
                        return;
                    }
                }

                console.log("Could not find matching data for country: " + countryName);
            }

            return {
                openSettings, optionsDialogRef, closeSettings, question, countSlider,
                answerList, questionAnswerList, feedbackText, handleAnswerPicked, 
                tempOptions, currentOptions, saveSettings, handleSliderChange,
                questionFlagUrl, regionList, toggleRegion, autoInputOptions, handleAutoOptionFocused,
                handleNameEntryInputChange, nameInput, feedbackClass, handleAutoOptionKey,
                autoOptionFocused, tryGuessOfInput, guessButton, handleNameInputKey, handleGuessInputKey,
                skipQuestion, flagContentDiv, globeAnswerRef, handleFlagCountryClicked, correctAnswer,
                globeQuestionRef
            }
        },
    }
);
</script>