<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div ref="scrollingContent" class="scrolling-content">
                    <div class="word-game-container">
                    <div class="game-header">
                        <h1>the word game</h1>
                        <div class="game-date">{{ formattedDate }}</div>
                    </div>

                    <div class="letters-section">
                        <div class="letters-title">Known Letters</div>
                        <div class="known-letters"
                            :style="gameOver ? '' : 'width: 5em;'">
                            {{ knownLetters }}
                        </div>
                    </div>

                    <div class="clues-section">
                        <div class="synonyms-grid">
                            <div 
                                v-for="(synonym, index) in currentGame?.synonyms" 
                                :key="index"
                                :class="['synonym', { revealed: revealedSynonyms[index] }]"
                            >
                                {{ revealedSynonyms[index] ? synonym : '???' }}
                            </div>
                        </div>
                        <div class="wildcard-clue">
                            <h3>Wildcard</h3>
                            <div class="wildcard-word">{{ currentGame?.wildcard }}</div>
                            <div v-if="gameWon || gameOver" style="margin-top: 5px;">{{ currentGame?.wildcardReason }}</div>
                        </div>
                    </div>

                    <div v-if="incorrectGuess" class="incorrect-feedback">
                        "{{ incorrectGuess }}" is incorrect
                    </div>

                    <div class="input-section">
                        <div v-if="attempts < 4"
                        class="attempts-counter" style="margin-bottom: 1rem; margin-top: 1rem;">
                            {{ maxAttempts - attempts }} attempt{{attempts == 3 ? '' : 's'}} left
                        </div>
                        <input 
                            type="text" 
                            class="guess-input" 
                            placeholder="Enter your guess..."
                            v-model="guessInput"
                            @keyup.enter="handleSubmitGuess"
                            :disabled="gameOver"
                            autocomplete="cc-csc"
                        >
                        <button 
                            class="guess-button vine-button"
                            @click="handleSubmitGuess"
                            :disabled="gameOver || !guessInput.trim()"
                        >
                            Submit Guess
                        </button>
                        <button 
                            class="vine-button"
                            @click="skip"
                            :disabled="gameOver"
                            style="font-size: 12pt; margin: auto; margin-top: 1rem;"
                        >
                            Skip
                        </button>
                    </div>

                    <div v-if="gameWon" class="game-result win">
                        <h3>Congratulations!</h3>
                        <p>You guessed "{{ currentGame?.word }}" correctly!</p>
                    </div>

                    <div v-if="gameOver && !gameWon" class="game-result lose">
                        <h3>Game Over!</h3>
                        <p>The word was "{{ currentGame?.word }}"</p>
                    </div>
<!-- 
                    <div class="new-game-section">
                        <button class="vine-button" 
                        style="margin: auto; margin-top: 1rem; font-size: 14pt; width: 10rem;" 
                        @click="initializeGame">
                            New Game
                        </button>
                    </div> -->
                </div>
			</div>
		</MainContent>
	</div>
    <dialog ref="faqOptionsRef">
        <div class="words-faq-dialog">
            <h2>
                Try to guess the secret word each day using the clues!
            </h2>
            <p>
                An example of a solved puzzle to get you started:
            </p>
            <br>
            <div style="margin: 0; padding: 0; display: flex; align-items: center; flex-direction: column;">
                <img class="words-tut-image" src="/src/assets/png/word-game-tut-1.png">
                <img class="words-tut-image" src="/src/assets/png/word-game-tut-2.png">
            </div>
            <br>
            <button class="vine-button" style="font-size: 12pt; margin: auto;" @click="faqOptionsRef?.close()">Close</button>
        </div>
    </dialog>
</template>
  
<script lang="ts">
    import '@/assets/words.css';
    import { PropType, defineComponent, computed, onMounted, ref, onUnmounted, } from 'vue';
    import MainContent from './MainContent.vue';
    import Nav from './Nav.vue';
    import { WordGameData } from '@/types';
    import { gameData } from '../gamedata';

    export default defineComponent({
        name: 'Words',
        components:{
            MainContent, Nav
        },
        setup() {
            const currentGame = ref<WordGameData | null>(null);
            const guessInput = ref('');
            const attempts = ref(0);
            const maxAttempts = ref(4);
            const gameWon = ref(false);
            const gameOver = ref(false);
            const revealedLetters = ref<string[]>([]);
            const revealedSynonyms = ref<boolean[]>([]);
            const incorrectGuess = ref('');

            const faqOptionsRef = ref<HTMLDialogElement>();
            const scrollingContent = ref<HTMLDivElement>();

            const formattedDate = computed(() => {
                const today = new Date();
                return today.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                });
            });

            const knownLetters = computed(()=>{
                let ret = '';
                for(let i = 0; i < Math.max(3, revealedLetters.value.length); i++){
                    if(revealedLetters.value.length > i){
                        ret += revealedLetters.value[i];
                    }
                    else{
                        ret += "?";
                    }
                    ret += ' ';
                }
                ret = ret.trim();
                console.log(ret);
                return ret;
            });

            function initializeGame(){
                const today = new Date();
                const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24) + 7);
                const randomGame = gameData[daysSinceEpoch % gameData.length];

                currentGame.value = randomGame;
                guessInput.value = '';
                attempts.value = 0;
                gameWon.value = false;
                gameOver.value = false;
                incorrectGuess.value = '';
                revealedSynonyms.value = [true, false, false, false];
                
                revealedLetters.value = [];
            };

            function handleSubmitGuess(){
                if (!currentGame.value || gameWon.value || gameOver.value || !guessInput.value.trim()) return;
                tryAnswer(guessInput.value.toUpperCase().trim());
            };

            function tryAnswer(answer : string){
                if(currentGame.value == null) return;

                const guess = answer;
                const newAttempts = attempts.value + 1;
                attempts.value = newAttempts;
                
                if (guess === currentGame.value.word) {
                    gameWon.value = true;
                    gameOver.value = true;
                    incorrectGuess.value = '';
                    revealedSynonyms.value = [true, true, true, true];
                    const allLetters = [...new Set(currentGame.value.word.split(''))];
                    revealedLetters.value = allLetters;
                } else {
                    incorrectGuess.value = guess;
                    
                    if (newAttempts < maxAttempts.value) {
                        const newRevealedSynonyms = [...revealedSynonyms.value];
                        newRevealedSynonyms[newAttempts] = true;
                        revealedSynonyms.value = newRevealedSynonyms;
                        
                        const newLetter = currentGame.value.letters[newAttempts - 1];
                        revealedLetters.value = [...revealedLetters.value, newLetter];
                    } else {
                        gameOver.value = true;
                        revealedSynonyms.value = [true, true, true, true];
                        const allLetters = [...new Set(currentGame.value.word.split(''))];
                        revealedLetters.value = allLetters;
                    }
                }
                
                guessInput.value = '';
            }

            onMounted(() => {
                initializeGame();
                faqOptionsRef.value?.showModal();

                window.addEventListener('focusout', handleFocusOut);
                window.addEventListener('scroll', handleScroll);
            });

            function handleFocusOut(e: FocusEvent){
                const target = e.target as HTMLElement;
                var isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
                if (isInput) {
                    scrollingContent.value?.scrollTo(0,0);
                    window.scrollTo(0,0);
                }
            }

            function handleScroll(e: Event){
                const activeElement = document.activeElement as HTMLElement;
                var isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
                if (!isInputFocused) {
                    scrollingContent.value?.scrollTo(0,0);
                    window.scrollTo(0,0);
                }
            }

            onUnmounted(()=>{
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('focusout', handleFocusOut);
            })

            function skip(){
                tryAnswer('');
            }

            return {
                currentGame,
                guessInput,
                attempts,
                maxAttempts,
                gameWon,
                gameOver,
                revealedLetters,
                revealedSynonyms,
                incorrectGuess,
                initializeGame,
                handleSubmitGuess,
                faqOptionsRef,
                skip,
                scrollingContent,
                formattedDate,
                knownLetters
            };
        },
    }
);
</script>