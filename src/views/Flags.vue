<template>
    <div class="flags-base">
        <div class="flags-content" ref="flagContentDiv">
            <Nav class="flags-nav-header"></Nav>
            <h1 style="text-align: center; margin-top: 1rem;">Welcome to the flag game</h1>
            <div style="display: flex; width: fit-content; justify-content: center; gap: 20px;">
                <button class="vine-button" style="width: 12em; margin-right: auto; font-size: 10pt; margin-bottom: .5rem;" 
                    @click="clickTimer">
                    {{getTimerButtonText()}}
                </button>
                <button class="vine-button" style="width: 10em; margin-left: auto; font-size: 10pt; margin-bottom: .5rem;" 
                    @click="openSettings">
                    Game Options
                </button>
            </div>
            <div class="flag-question-answer">
                <div class="flag-question">
                    <span v-html="question" style="text-align: center; height: 3rem; width: 20rem;"
                    :style="currentOptions.questionMode == 'globe' ? 'width: 30rem;' : 'width: 20rem;'"></span>
                    <button 
                        class="vine-button" 
                        style="font-size: 10pt; translate: 0px -5px;"
                        @click="skipQuestion"
                        >Skip
                    </button>
                    <div v-if="currentOptions.questionMode==='flag'" 
                        class="flag-button-holder no-input" 
                        style="height: 35vh; width: auto;">
                        <img :src="questionFlagUrl"> 
                    </div>
                    <div class="globe-container" v-if="currentOptions.questionMode === 'globe'"
                    style="height: 400px; width: 400px; min-height: 400px; min-width: 400px;">
                        <GlobeGL 
                            ref="globeQuestionRef"
                            :size="400"
                            :mode="'highlight'"
                            :countryName="correctAnswer?.countryName">
                        </GlobeGL>
                    </div>
                    <span class="flag-feedback-text" v-html="feedbackText" :class="feedbackClass"></span>
                    <FlagAnswer v-if="tempFlagAnswer != null && currentOptions.answerMode == 'flag'"
                        :answer-data="tempFlagAnswer"
                        :display="'flag'"
                        :interactable="false">

                    </FlagAnswer>
                </div>
                <div class="flag-answer">
                    <div class="flag-answer-display" 
                        v-if="(currentOptions.answerMode !== 'name' || currentOptions.nameEntryType !== 'inputField') && currentOptions.answerMode !== 'globe'"
                        :style="flagAnswerDisplayStyle()">
                        <FlagAnswer
                            v-for="(answer, index) in questionAnswerList"
                            :answerData="answer"
                            :display="currentOptions.answerMode"
                            :grey-out="currentOptions.multipleAnswerMode==='checkoff' && answeredList.includes(answer.countryName) ? true : false"
                            @onClick="handleAnswerPicked">
                        </FlagAnswer>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: -1rem; translate: 2.3rem; width: 28rem;" 
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
                            :size="550"
                            ref="globeAnswerRef"
                            :country-name="answerTempHighlight"
                            :mode="globeAnswerMode"
                            @onCountryClick="handleFlagCountryClicked">
                        </GlobeGL>
                    </div>
                </div>
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
            <h3 v-if="tempOptions.answerMode == 'name'">Answer Mode</h3>
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
            <h3 
                :style="tempOptions.answerMode == 'flag'|| (tempOptions.answerMode == 'name' && tempOptions.nameEntryType == 'button')? '' : 'opacity: 20%'">
                Answer Pool Type
            </h3>
            <div class="flag-mode-settings" 
                :style="tempOptions.answerMode == 'flag'|| (tempOptions.answerMode == 'name' && tempOptions.nameEntryType == 'button') ? '' : 'opacity: 20%'">
                <button class="flag-toggle-button"
                    :disabled="!(tempOptions.answerMode == 'flag'|| (tempOptions.answerMode == 'name' && tempOptions.nameEntryType == 'button'))"
                    :class="tempOptions.multipleAnswerMode === 'switch' ? 'selected' : ''"
                    @click="tempOptions.multipleAnswerMode = 'switch'">
                    New Each Question
                </button>
                <button class="flag-toggle-button"
                    :disabled="!(tempOptions.answerMode == 'flag'|| (tempOptions.answerMode == 'name' && tempOptions.nameEntryType == 'button'))"
                    :class="tempOptions.multipleAnswerMode === 'checkoff' ? 'selected' : ''"
                    @click="tempOptions.multipleAnswerMode = 'checkoff'">
                    Persistent
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
    <dialog ref="timerDialogRef">
        <div class="flags-options-dialog" style="width: 375px">
            <h3 style="margin-top: 0;">Showing highscores for:</h3>
            <div style="display: flex; width: 100%; gap: 10px; justify-content: center;">
                <button class="flag-toggle-button"
                    :class="highscoreDisplayMode === 'global' ? 'selected' : ''"
                    @click="highscoreDisplayMode = 'global'">
                    Global
                </button>
                <button class="flag-toggle-button"
                    :class="highscoreDisplayMode === 'personal' ? 'selected' : ''"
                    @click="highscoreDisplayMode = 'personal'">
                    Personal
                </button>
            </div>
            <button class="vine-button" style="margin: auto; margin-top: 1rem; font-size: 10pt; width: 10rem;"
            @click="cycleHighscoreDisplay">
                {{ capitalize(highscoreModes[highscoreModeDisplayIndex][0]) }} / {{ capitalize(highscoreModes[highscoreModeDisplayIndex][1]) }}
            </button>
            <div class="highscores-table" style="margin-top: 1rem;">
                <div class="highscore-row" style="margin-bottom: .5rem;">
                    <h4 class="highscore-region">Region</h4>
                    <h4 v-if="highscoreDisplayMode === 'global'" style="margin-left: auto;" class="highscore-region">Name</h4>
                    <h4 style="width: 4rem;" :style="highscoreDisplayMode === 'global' ? 'margin-left: 1rem;' : 'margin-left: auto;'" class="highscore-time">Time</h4>
                </div>
                <div class="highscore-row" style="padding-bottom: .3rem; padding-top: .3rem; background-color: var(--lightwhite1);">
                    <span class="highscore-region">All</span>
                    <span v-if="highscoreDisplayMode === 'global'" style="margin-left: auto; text-align: right; padding-left: .25rem;" class="highscore-time">
                        {{defaultIfNull(getHighscoreData(highscoreModes[highscoreModeDisplayIndex][0], 
                        highscoreModes[highscoreModeDisplayIndex][1], 'All')?.name, 
                        '--')}}
                    </span>
                    <span 
                        style="width: 4rem;"
                        :style="highscoreDisplayMode === 'global' ? 'margin-left: 1rem;' : 'margin-left: auto;'" class="highscore-time">
                        {{ formatTime(getHighscoreData(highscoreModes[highscoreModeDisplayIndex][0], 
                        highscoreModes[highscoreModeDisplayIndex][1], 'All')?.time) }}
                    </span>
                </div>
                <div class="highscore-row" 
                        v-for="(region, index) in regionList"
                         style="padding-bottom: .3rem; padding-top: .3rem;"
                         :style="'background-color: ' + (index % 2 == 0 ? 'var(--lightwhite2)' : 'var(--lightwhite1)')">
                    <span class="highscore-region">{{ region }}</span>
                    <span v-if="highscoreDisplayMode === 'global'" style="margin-left: auto; text-align: right; padding-left: .25rem;" class="highscore-time">
                        {{defaultIfNull(getHighscoreData(highscoreModes[highscoreModeDisplayIndex][0], 
                        highscoreModes[highscoreModeDisplayIndex][1], region)?.name, 
                        '--')}}
                    </span>
                    <span 
                        style="width: 4rem;"
                        :style="highscoreDisplayMode === 'global' ? 'margin-left: 1rem;' : 'margin-left: auto;'" class="highscore-time">
                        {{ formatTime(getHighscoreData(highscoreModes[highscoreModeDisplayIndex][0], 
                        highscoreModes[highscoreModeDisplayIndex][1], region)?.time) }}
                    </span>
                </div>
            </div>
            <br>
            <div style="background-color: #000; height: 1px; width: 100%;"></div>
            <br>
            <h3 style="margin-top: 0;">Timer</h3>
            <span v-if="(currentOptions.answerMode == 'flag' || (currentOptions.answerMode == 'name' && currentOptions.nameEntryType == 'button')) && isTimedRunValid()"
                style="display: block;">
                <i>Note: All timed runs use <b>persistent answer pool</b> mode.</i>
            </span>
            <span v-if="isTimedRunValid()" style="display: block; margin-top: .5rem;">
                Selected region:
            </span>
            <span v-if="isTimedRunValid()" style="display: block; margin-top: .25rem;">
                <b>{{getRegionFilterString()}}</b>
            </span>
            <span v-else style="display: block; margin-top: .5rem; color: red;">
                Region filter not valid for a timed run.
            </span>
            <span v-if="isTimedRunValid()" 
                style="display: block; margin-top: .5rem;">
                Starting run for mode:
            </span>
            <span v-if="isTimedRunValid()" 
                style="display: block; margin-top: .25rem;">
                <b>{{ capitalize(currentOptions.questionMode) }} / {{capitalize(currentOptions.answerMode) }}</b>
            </span>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                <button class="vine-button" style="font-size: 12pt;" @click="closeTimer">
                    Close
                </button>
                <button class="vine-button" style="font-size: 12pt;"
                :disabled="!isTimedRunValid()"
                :class="isTimedRunValid() ? '' : 'disabled'"
                @click="startTimer">
                    Start
                </button>
            </div>
        </div>
    </dialog>
    <dialog ref="timerFinishRef">
        <div class="flags-options-dialog" style="width: 350px">
            <h2>Timed run complete!</h2>
            <h3>Settings</h3>
            <p style="margin-bottom: .5rem;"> Mode:  {{ capitalize(currentOptions.questionMode) }} / {{ capitalize(currentOptions.answerMode) }}</p>
            <p> Region: {{ getRegionFilterString() }}</p>
            <br>
            <h3>Your time:</h3>
            <span>{{ formatTime(totalTimeElapsed) }}</span>
            <br>
            <br>
            <h3 v-if="gotNewPersonalHighcore">Personal Highscore!</h3>
            <h3 v-if="gotNewGlobalHighcore">Global Highscore!</h3>
            <span  v-if="gotNewGlobalHighcore" >Enter name: </span> 
                <input v-if="gotNewGlobalHighcore" 
                        ref="highscoreNameInput" 
                        class="flag-highscore-name-input raleway" 
                        maxlength="20"
                        @input="handleHighscoreNameChange">
            <div style="display: flex; width: 100%; justify-content: center; gap: 20px;">
                <button v-if="gotNewGlobalHighcore" class="vine-button" style="font-size: 12pt; margin-top: 1rem;"
                    @click="submitHighscore"
                    :class="highscoreName.length==0 ? 'disabled' : ''"
                    :disabled="highscoreName.length==0">
                        Submit
                </button>
                <button v-else class="vine-button" style="font-size: 12pt; margin-top: 1rem;"
                    @click="timerFinishRef?.close()">
                        Close
                </button>
            </div>
        </div>
    </dialog>
    <!-- <button @click="testpython">Hello</button> -->
</template>
  
<script lang="ts">
    import '@/assets/flags.css';
    import { defineComponent, ref, onMounted, onUnmounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import FlagAnswer from './FlagAnswer.vue';
    import { FlagAnswerData, FlagGameOptions, FlagHighscore, FlagHighscores } from '@/types';
    import { GetDefaultFlagGameOptions } from '@/utils';
    import GlobeGL from './GlobeGL.vue';
    import localforage from 'localforage';

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
                const goodForAnswerPool = this.tempOptions.multipleAnswerMode == 'switch';
                return (goodForName || goodForFlag) && goodForAnswerPool;
            },
            formatTime(milliseconds: number | undefined): string {
                if(!milliseconds) return '--';
                const totalSeconds = Math.floor(milliseconds / 1000)
                const ms = Math.floor((milliseconds % 1000) / 10)
                
                const minutes = Math.floor(totalSeconds / 60)
                const seconds = totalSeconds % 60
                
                const minutesStr = minutes.toString().padStart(2, '0')
                const secondsStr = seconds.toString().padStart(2, '0')
                const msStr = ms.toString().padStart(2, '0')
                
                return `${minutesStr}:${secondsStr}:${msStr}`
            },
            getTimeCountriesLeftDisplay() : string {
                const countriesAnswered = this.answerPool.length - this.pseudoRandomPool.length;
                const totalCountries = this.answerPool.length;

                return `(${countriesAnswered}/${totalCountries})`
            },
            isTimedRunValid() : boolean {
                const regionListLength = this.currentOptions.regionFilter.length;
                return (regionListLength == 0 || regionListLength == 1 || regionListLength == 9);
            },
            getRegionFilterString() : string {
                const regionListLength = this.currentOptions.regionFilter.length;
                if(regionListLength == 0 || regionListLength == 9){
                    return 'All';
                }
                return this.currentOptions.regionFilter[0];
            },
            capitalize(s : string) : string {
                const bigStart = s[0].toUpperCase();
                return s.substring(0, 0) + bigStart + s.substring(1)
            },
            getTimerButtonText() : string{
                if(this.timing){
                    return `${this.formatTime(this.totalTimeElapsed)} ${this.getTimeCountriesLeftDisplay()}`;
                }
                else if(this.displayScore){
                    return `Done! - ${this.formatTime(this.totalTimeElapsed)}`;
                }
                return 'Highscores / Timer';
            },
            getHighscoreData(questionMode : string, answerMode : string, region : string){
                const useThisHighscore = this.highscoreDisplayMode === 'personal' ? 
                                         this.loadedHighscoreData : this.globalHighscoreData;
                if(!useThisHighscore) return null;

                for (let index = 0; index < useThisHighscore.highscores.length; index++) {
                    const element = useThisHighscore.highscores[index];
                    if(element.questionMode != questionMode) continue;
                    if(element.answerMode != answerMode) continue;
                    if(element.region != region) continue;

                    return element;
                }
                return null;
            },
            flagAnswerDisplayStyle(){
                if(this.currentOptions.answerMode == 'flag'){
                    if(this.currentOptions.questionMode == 'name'){
                        return 'margin-top: 1rem';
                    }
                    else{ // globe
                        return 'margin-top: 10rem';
                    }
                }
                else{
                    if(this.currentOptions.questionMode == 'globe'){
                        return 'margin-top: 15rem';
                    }
                    else{ // flag
                        return 'margin-top: 1rem';
                    }
                }
            },
            defaultIfNull(data : any, defa : string){
                if(!data){
                    return defa;
                }
                return data;
            }
        },
        setup() {
            // options
            const optionsDialogRef = ref<HTMLDialogElement>();
            const timerDialogRef = ref<HTMLDialogElement>();
            const timerFinishRef = ref<HTMLDialogElement>();
            const currentOptions = ref<FlagGameOptions>(GetDefaultFlagGameOptions());
            const tempOptions = ref<FlagGameOptions>(GetDefaultFlagGameOptions());
            const countSlider = ref<HTMLInputElement>();
            const regionList = ref<string[]>([]);
            let forceGenerateAnswerPool = false;

            const question = ref("Which flag is this?");
            const questionFlagUrl = ref("");
            const feedbackText = ref("");

            const answerList = ref<FlagAnswerData[]>([]);
            const answerPool = ref<FlagAnswerData[]>([]);
            const answeredList = ref<string[]>([]);

            // Just has one copy of everything so all the countries show up before showing again
            const pseudoRandomPool = ref<FlagAnswerData[]>([]);
            const questionAnswerList = ref<FlagAnswerData[]>([]);
            const correctAnswer = ref<FlagAnswerData>();

            const autoInputOptions = ref<FlagAnswerData[]>([]);
            const nameInput = ref<HTMLInputElement>();
            const guessButton = ref<HTMLButtonElement>();
            const feedbackClass = ref("");
            const autoOptionFocused = ref(-1);
            const tempFlagAnswer = ref<FlagAnswerData | null>(null);


            let startTime : Date;
            let rafId: number | null = null;
            const totalTimeElapsed = ref(0);
            const timing = ref(false);
            const displayScore = ref(false);
            let failedTimedGuesses = 0;

            const loadedHighscoreData = ref<FlagHighscores | null>();
            const globalHighscoreData = ref<FlagHighscores | null>();
            const highscoreDisplayMode = ref<'personal' | 'global'>('global');
            const gotNewPersonalHighcore = ref(false);
            const gotNewGlobalHighcore = ref(false);
            const highscoreNameInput = ref<HTMLInputElement>();
            const highscoreName = ref<string>('');

            const highscoreModes = [
                ['flag', 'name'],
                ['flag', 'globe'],
                ['name', 'flag'],
                ['name', 'globe'],
                ['globe', 'flag'],
                ['globe', 'name'],
            ]
            const highscoreModeDisplayIndex = ref(0);

            let allFlagData : FlagAnswerData[];

            // Globe stuff
            const flagContentDiv = ref<HTMLDivElement>();
            const globeAnswerRef = ref<InstanceType<typeof GlobeGL>>();
            const globeQuestionRef = ref<InstanceType<typeof GlobeGL>>();
            const answerTempHighlight = ref<string>("");
            const globeAnswerMode = ref<string>("highlight");

            let waitingForSomething = false;

            onMounted(()=>{
                loadInFlagData();
                document.getElementById('click-me-text')?.classList.add('invisible');
                rafId = requestAnimationFrame(timerUpdate);

                getHighscores();
                getGlobalHighscores();
            })

            async function getHighscores(){
                const highscores = await localforage.getItem<string>('highscores');
                if(highscores){
                    loadedHighscoreData.value = JSON.parse(highscores);
                }
                else{
                    loadedHighscoreData.value = {
                        highscores: []
                    };
                }
            }

            onUnmounted(()=>{
                document.getElementById('click-me-text')?.classList.remove('invisible');
                if (rafId !== null) {
                    cancelAnimationFrame(rafId)
                }
            })

            async function loadInFlagData(){
                try {
                    const response = await fetch('/flags.csv');
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
                                area: values[3],
                                hasGlobeData: values[4] == 'True'  // Is there globe data?
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

                answerTempHighlight.value = '';
                globeAnswerMode.value = 'click';
                setTimeout(() => {
                    globeAnswerRef.value?.showCountry();
                }, 25);

                // Choose a random flag
                let randomIndex = Math.floor(Math.random() * pseudoRandomPool.value.length);
                correctAnswer.value = pseudoRandomPool.value[randomIndex];

                if(currentOptions.value.questionMode === 'name'){
                    if(currentOptions.value.answerMode === 'flag'){
                        question.value = `Which flag is <b>${correctAnswer.value.countryName}<b>?`;
                    }
                    else if(currentOptions.value.answerMode === 'globe'){
                        question.value = `Where is <b>${correctAnswer.value.countryName}<b>?`;
                    }
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
                        globeQuestionRef.value?.showCountry();
                    }, 25);
                }

                // Generate n number of other options. Only do this if we are in switch mode
                if(currentOptions.value.multipleAnswerMode == 'switch' || forceGenerateAnswerPool){
                    forceGenerateAnswerPool = false;
                    let numAnswers = currentOptions.value.answerCount;
                    if(currentOptions.value.multipleAnswerMode == 'checkoff'){
                        numAnswers = answerPool.value.length;
                    }
                    questionAnswerList.value = 
                        getRandomOptions(correctAnswer.value, numAnswers);

                    if(currentOptions.value.answerMode==='name'){
                        // Sort the question answer list if we are in name answer mode
                        questionAnswerList.value.sort((a, b) => a.countryName > b.countryName ? 1 : -1);
                    }
                }

                pseudoRandomPool.value.splice(randomIndex, 1);
            }

            function skipQuestion(){
                if(waitingForSomething) return;

                if(currentOptions.value.questionMode != 'name'){
                    feedbackText.value = `That was <b>${correctAnswer.value?.countryName}</b>`
                }
                if(timing.value){
                    timing.value = false;
                }
                answeredList.value.push(correctAnswer.value!.countryName);

                if(currentOptions.value.answerMode == 'flag'){
                    feedbackText.value = `This is ${correctAnswer.value?.countryName}`;
                    tempFlagAnswer.value = correctAnswer.value!;
                }

                if(currentOptions.value.answerMode == 'globe'){
                    showCorrectCountryOnGlobe();
                }
                else{
                    generateQuestion();
                }
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
                if(waitingForSomething) return;
                
                autoOptionFocused.value = -1;
                tempFlagAnswer.value = null;

                if(nameInput.value){
                    nameInput.value.value = '';
                    autoInputOptions.value = [];
                    focusInputField();
                }

                if(correctAnswer.value?.countryName == answerPicked.countryName){
                    feedbackText.value = `✅ <b>${answerPicked.countryName}</b> is correct!`
                    feedbackClass.value = "feedback-correct";
                    answeredList.value.push(correctAnswer.value!.countryName);

                    setTimeout(() => {
                        flagContentDiv.value!.scrollTo({
                        top: 0,
                        behavior: 'smooth' 
                    });
                    }, 25);

                    // Check for a timed run to have finished
                    if(pseudoRandomPool.value.length == 0){
                        if(timing.value == true){
                            timing.value = false;
                            displayScore.value = true;
                            gotNewGlobalHighcore.value = false;
                            gotNewPersonalHighcore.value = false;

                            // Look for this mode in the highscores
                            tryUpdateHighscores(totalTimeElapsed.value);

                            timerFinishRef.value?.showModal();
                            console.log("highscore values: " + gotNewGlobalHighcore.value + gotNewPersonalHighcore.value);
                        }
                        answeredList.value = [];
                        forceGenerateAnswerPool = true;
                    }
                    generateQuestion();
                }
                else{
                    let introText = '';
                    if(timing.value){
                        failedTimedGuesses++;
                        if(failedTimedGuesses >= 1){
                            if(timing.value){
                                timing.value = false;
                                introText = '<b>FAILED </b><br><br>';
                            }
                        }
                        else{
                            introText = `${failedTimedGuesses}/3 wrong <br><br>`
                        }
                    }
                    feedbackClass.value = "shake";
                    setTimeout(() => {
                        feedbackClass.value = "";
                    }, 500);
                    if(currentOptions.value.answerMode === 'flag'){
                        feedbackText.value = introText + `Incorrect! That's <b>${answerPicked.countryName}</b>`;
                    }
                    else{
                        feedbackText.value = introText + `<b>${answerPicked.countryName}</b> is incorrect!`;
                    }
                }
            }

            function tryUpdateHighscores(time : number){
                if(!loadedHighscoreData.value) return;
                if(time == 0) return;

                let region = 'All';
                if(currentOptions.value.regionFilter.length == 1){
                    region = currentOptions.value.regionFilter[0];
                }

                checkForGlobalHighscore();

                // Check to see if this time exists
                for (let index = 0; index < loadedHighscoreData.value.highscores.length; index++) {
                    const element = loadedHighscoreData.value.highscores[index];
                    if(element.questionMode != currentOptions.value.questionMode) continue;
                    if(element.answerMode != currentOptions.value.answerMode) continue;
                    if(element.region != region) continue;

                    if(time < element.time){
                        console.log("New personal highscore! " + time + " old time: " + element.time);
                        gotNewPersonalHighcore.value = true;
                        loadedHighscoreData.value.highscores[index].time = time;
                        localforage.setItem('highscores', JSON.stringify(loadedHighscoreData.value));
                    }
                    return;
                }
                
                // Otherwise, add it
                loadedHighscoreData.value.highscores.push({
                    region: region,
                    questionMode: currentOptions.value.questionMode,
                    answerMode: currentOptions.value.answerMode,
                    time: time,
                    name: ''
                });
                gotNewPersonalHighcore.value = true;
                localforage.setItem('highscores', JSON.stringify(loadedHighscoreData.value));
            }

            function openSettings(){
                timing.value = false;
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
                    if(currentOptions.value.multipleAnswerMode == 'checkoff'){
                        forceGenerateAnswerPool = true;
                    }
                    generateAnswerPool();
                    generateQuestion();
                    tempFlagAnswer.value = null;
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
                answeredList.value = [];
                if(currentOptions.value.regionFilter.length !== 0){
                    const hasGlobe = currentOptions.value.answerMode == 'globe' || currentOptions.value.questionMode == 'globe';
                    answerPool.value = answerList.value.filter(x=>{
                        const allowedWithGlobe = !hasGlobe || x.hasGlobeData;
                        return allowedWithGlobe && currentOptions.value.regionFilter.includes(x.area);
                    });
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

            function showCorrectCountryOnGlobe(){
                if(globeAnswerRef.value == null) return;

                answerTempHighlight.value = correctAnswer.value!.countryName;
                globeAnswerMode.value = 'highlight';
                waitingForSomething = true;
                
                setTimeout(() => {
                    globeAnswerRef.value!.showCountry();
                }, 25);

                setTimeout(() => {
                    generateQuestion();
                    waitingForSomething = false;
                }, 2000);
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

            function zoomInOnCountry(countryName : string){
                if(!globeAnswerRef.value) return;
                answerTempHighlight.value = countryName.toLowerCase();

                setTimeout(() => {
                    globeAnswerRef.value?.showCountry();
                }, 25);
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

            function clickTimer(){
                if(timing.value){
                    timing.value = false;
                }

                let hsDisplayIndex = 0;
                //#region flag display index 
                if(currentOptions.value.questionMode == 'flag' && currentOptions.value.answerMode == 'name'){
                    hsDisplayIndex = 0;
                }
                if(currentOptions.value.questionMode == 'flag' && currentOptions.value.answerMode == 'globe'){
                    hsDisplayIndex = 1;
                }
                if(currentOptions.value.questionMode == 'name' && currentOptions.value.answerMode == 'flag'){
                    hsDisplayIndex = 2;
                }
                if(currentOptions.value.questionMode == 'name' && currentOptions.value.answerMode == 'globe'){
                    hsDisplayIndex = 3;
                }
                if(currentOptions.value.questionMode == 'globe' && currentOptions.value.answerMode == 'flag'){
                    hsDisplayIndex = 4;
                }
                if(currentOptions.value.questionMode == 'globe' && currentOptions.value.answerMode == 'name'){
                    hsDisplayIndex = 5;
                }
                highscoreModeDisplayIndex.value = hsDisplayIndex;
                //#endregion

                displayScore.value = false;
                timerDialogRef.value?.showModal();
            }

            function closeTimer(){
                timerDialogRef.value?.close();
            }

            function cycleHighscoreDisplay(){
                highscoreModeDisplayIndex.value += 1;
                if(highscoreModeDisplayIndex.value > 5){
                    highscoreModeDisplayIndex.value = 0;
                }
            }

            function startTimer(){
                startTime = new Date();
                timing.value = true;

                currentOptions.value.multipleAnswerMode = 'checkoff';
                forceGenerateAnswerPool = true;
                failedTimedGuesses = 0;

                closeTimer();
                generateAnswerPool();
                generateQuestion();
            }

            const timerUpdate = () => {
                if(timing.value){
                    totalTimeElapsed.value = (new Date()).getTime() - startTime.getTime();
                }
                rafId = requestAnimationFrame(timerUpdate)
            }

            function testpython(){
                zoomInOnCountry(allFlagData[Math.floor(Math.random() *allFlagData.length)].countryName.toLowerCase());
            }


            function getGlobalHighscores(){
                globalHighscoreData.value = {highscores: []};
                // const baseUrl = 'http://127.0.0.1:5000';
                const baseUrl = 'http://oysterhey.com:5000';
                fetch(baseUrl + '/send?', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if(data['message']==''){
                        console.log("hs data was empty");
                        return;
                    }
                    const x = JSON.parse(data['message']);
                    for (let index = 0; index < x.length; index++) {
                        const element = x[index];
                        const qaData = element.mode.split("/");
                        const hsData : FlagHighscore = {
                            questionMode: qaData[0],
                            answerMode: qaData[1],
                            region: element.region,
                            time: element.time,
                            name: element.name
                        }
                        globalHighscoreData.value!.highscores.push(hsData);
                    }
                })
                .catch(error => {
                    console.log('Failed to fetch highscores, using empty array');
                });
            }

            function checkForGlobalHighscore(){
                if(!globalHighscoreData.value){
                    console.warn("did not have global high score data");
                    return;
                }
                
                const time = totalTimeElapsed.value;
                let region = 'All';
                if(currentOptions.value.regionFilter.length == 1){
                    region = currentOptions.value.regionFilter[0];
                }
                // Go thru our local global highscores and see if this is less
                for (let index = 0; index < globalHighscoreData.value.highscores.length; index++) {
                    const element = globalHighscoreData.value.highscores[index];
                    if(element.questionMode != currentOptions.value.questionMode) continue;
                    if(element.answerMode != currentOptions.value.answerMode) continue;
                    if(element.region != region) continue;

                    if(time < element.time){
                        gotNewGlobalHighcore.value = true;
                    }
                    return;
                }
                gotNewGlobalHighcore.value = true;
            }

            function submitHighscore(){
                timerFinishRef.value?.close();
                let region = 'All';
                if(currentOptions.value.regionFilter.length == 1){
                    region = currentOptions.value.regionFilter[0];
                }

                let name = highscoreName.value.replace(/[^a-zA-Z0-9_\s-]/g, '').trim();

                // const baseUrl = 'http://127.0.0.1:5000';
                const baseUrl = 'http://oysterhey.com:5000';
                const params = new URLSearchParams({
                    name: name,
                    mode: `${currentOptions.value.questionMode}/${currentOptions.value.answerMode}`,
                    region: region,
                    time_ms: totalTimeElapsed.value.toString(),
                });
                fetch(baseUrl + '/receive?' + params.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({message: ""}),
                });
            }

            const handleHighscoreNameChange = (event: Event): void => {
                const target = event.target as HTMLInputElement;
                const value = target.value;

                highscoreName.value = value;
            };

            return {
                openSettings, optionsDialogRef, closeSettings, question, countSlider,
                answerList, questionAnswerList, feedbackText, handleAnswerPicked, 
                tempOptions, currentOptions, saveSettings, handleSliderChange,
                questionFlagUrl, regionList, toggleRegion, autoInputOptions, handleAutoOptionFocused,
                handleNameEntryInputChange, nameInput, feedbackClass, handleAutoOptionKey,
                autoOptionFocused, tryGuessOfInput, guessButton, handleNameInputKey, handleGuessInputKey,
                skipQuestion, flagContentDiv, globeAnswerRef, handleFlagCountryClicked, correctAnswer,
                globeQuestionRef, timerDialogRef, clickTimer, cycleHighscoreDisplay, highscoreModes,
                highscoreModeDisplayIndex, closeTimer, timing, startTimer, totalTimeElapsed, pseudoRandomPool,
                answerPool, displayScore, loadedHighscoreData, answeredList, answerTempHighlight, globeAnswerMode,
                testpython, timerFinishRef, submitHighscore, highscoreDisplayMode, globalHighscoreData,
                highscoreNameInput, gotNewPersonalHighcore, gotNewGlobalHighcore, highscoreName,
                handleHighscoreNameChange, tempFlagAnswer
            }
        },
    }
);
</script>