<template>
    <div class="center-main-content">
		<MainContent :animate="false">
			<Nav class="header"></Nav>
			<div ref="scrollingContent" class="scrolling-content">
                    <div class="word-game-container">
                    <div class="game-header">
                        <h1>Cluedle</h1>
                        <div class="game-date">{{ formattedDate }}
                            <button @click="faqOptionsRef?.showModal()" class="how-to-play-btn">
                                (how to play)
                            </button>
                        </div>
                        <div style="font-size: 13pt; margin-top: .5rem;"><b>{{ playerCount }}</b> {{playerCount == 1 ? 'person has' : 'people have'}} played today!</div>
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
                        <div class="wildcard-clue" :class="gameOver ? 'over' : ''">
                            <h3>Wildcard</h3>
                            <div class="wildcard-word">{{ currentGame?.wildcard }}</div>
                            <div v-if="gameWon || gameOver" style="margin-top: 5px;">{{ currentGame?.wildcardReason }}</div>
                        </div>
                    </div>

                    <div v-if="incorrectGuess" class="incorrect-feedback">
                        "{{ incorrectGuess }}" is incorrect
                    </div>

                    <div class="input-section" v-if="!gameOver">
                        <div v-if="!gameOver"
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
                            name="guess"
                            autocomplete="off"
                        >
                        <button 
                            class="guess-button vine-button"
                            @touchend="handleTouchEnd"
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

                    <div v-if="gameWon" class="game-result win" style="margin-top: 5rem;">
                        <h3>Congratulations!</h3>
                        <p>You guessed "{{ currentGame?.word }}" correctly in {{ attempts }} guess{{ attempts === 1 ? '' : 'es' }}!</p>
                    </div>

                    <div v-if="gameOver && !gameWon" class="game-result lose">
                        <h3>Game Over!</h3>
                        <p>The word was "{{ currentGame?.word }}"</p>
                    </div>

                    <div v-if="showStats" class="stats-display">
                        <h3>Your Stats</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">{{ stats.totalWins }}</div>
                                <div class="stat-label">Total Wins</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number bad">{{ stats.totalFailures }}</div>
                                <div class="stat-label">Failures</div>
                            </div>
                        </div>
                        <div class="guess-distribution">
                            <h4>Guess Distribution</h4>
                            <div class="distribution-bars">
                                <div class="distribution-row">
                                    <span class="guess-number">1</span>
                                    <div class="bar-container">
                                        <div class="bar" :style="{ width: stats.totalWins > 0 ? (stats.wins1Guess / stats.totalWins * 100) + '%' : '0%' }"></div>
                                    </div>
                                    <span class="count">{{ stats.wins1Guess }}</span>
                                </div>
                                <div class="distribution-row">
                                    <span class="guess-number">2</span>
                                    <div class="bar-container">
                                        <div class="bar" :style="{ width: stats.totalWins > 0 ? (stats.wins2Guess / stats.totalWins * 100) + '%' : '0%' }"></div>
                                    </div>
                                    <span class="count">{{ stats.wins2Guess }}</span>
                                </div>
                                <div class="distribution-row">
                                    <span class="guess-number">3</span>
                                    <div class="bar-container">
                                        <div class="bar" :style="{ width: stats.totalWins > 0 ? (stats.wins3Guess / stats.totalWins * 100) + '%' : '0%' }"></div>
                                    </div>
                                    <span class="count">{{ stats.wins3Guess }}</span>
                                </div>
                                <div class="distribution-row">
                                    <span class="guess-number">4</span>
                                    <div class="bar-container">
                                        <div class="bar" :style="{ width: stats.totalWins > 0 ? (stats.wins4Guess / stats.totalWins * 100) + '%' : '0%' }"></div>
                                    </div>
                                    <span class="count">{{ stats.wins4Guess }}</span>
                                </div>
                            </div>
                        </div>
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
    import { WordGameData, CluedleStats } from '@/types';
    import { gameData } from '../gameData';
    import localforage from 'localforage';

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

            const playerCount = ref(0);
            const showStats = ref(false);
            const stats = ref<CluedleStats>({
                totalWins: 0,
                wins1Guess: 0,
                wins2Guess: 0,
                wins3Guess: 0,
                wins4Guess: 0,
                totalFailures: 0
            });

            const formattedDate = computed(() => {
                const today = new Date();
                return today.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                });
            });

            const knownLetters = computed(()=>{
                if(gameOver.value){
                    let ret = '';
                    for(let i = 0; i < revealedLetters.value.length; i++){
                        if(revealedLetters.value.length > i){
                            ret += revealedLetters.value[i];
                        }
                        ret += ' ';
                    }
                    ret = ret.trim();
                    return ret;
                }
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
                return ret;
            });

            function initializeGame(){
                const today = new Date();
                let daysSince0 = Math.floor((today.getTime() - today.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24));
                daysSince0 -= 20265;
                const randomGame = gameData[daysSince0 % gameData.length];

                currentGame.value = randomGame;
                guessInput.value = '';
                attempts.value = 0;
                gameWon.value = false;
                gameOver.value = false;
                incorrectGuess.value = '';
                revealedSynonyms.value = [true, false, false, false];
                
                revealedLetters.value = [];

                getPlayerCount(currentGame.value.word);
                loadUserStats();
            };

            const getPlayerCount = async (word : string) => {
                // const baseUrl = 'http://127.0.0.1:5000';
                const baseUrl = 'https://oysterhey.com';
                const getParams = new URLSearchParams({
                    word: word,
                });
                fetch(baseUrl + '/get_cluedle_count?' + getParams.toString())
                    .then(response => response.json())
                    .then(data => playerCount.value = data.count);
            }

            const sendPlayerCount = async (word : string) => {
                // const baseUrl = 'http://127.0.0.1:5000';
                const baseUrl = 'https://oysterhey.com';
                const params = new URLSearchParams({
                    word: word, 
                });
                fetch(baseUrl + '/cluedle_count?' + params.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({message: ""}),
                });
            }

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
                    revealedLetters.value = currentGame.value.word.split(' ');

                    sendPlayerCount(currentGame.value.word);
                    playerCount.value++;
                    updateUserStats(newAttempts, true);
                    showStats.value = true;
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
                        revealedLetters.value = currentGame.value.word.split(' ');
                        sendPlayerCount(currentGame.value.word);
                        playerCount.value++;
                        updateUserStats(newAttempts, false);
                        showStats.value = true;
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

            function handleTouchEnd(event: TouchEvent) {
                event.preventDefault();
                if (!gameOver.value && guessInput.value.trim()) {
                    handleSubmitGuess();
                }
            }

            onUnmounted(()=>{
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('focusout', handleFocusOut);
            })

            function skip(){
                tryAnswer('');
            }

            const loadUserStats = async () => {
                try {
                    const savedStats = await localforage.getItem('cluedle-stats') as string;
                    if (savedStats) {
                        stats.value = JSON.parse(savedStats) as CluedleStats;
                    }
                } catch (error) {
                    console.error('Error loading user stats:', error);
                }
            };

            const saveUserStats = async () => {
                try {
                    console.dir(stats.value);
                    await localforage.setItem('cluedle-stats', JSON.stringify(stats.value));
                } catch (error) {
                    console.error('Error saving user stats:', error);
                }
            };

            const updateUserStats = async (attempts: number, won: boolean) => {
                if (won) {
                    stats.value.totalWins++;
                    switch (attempts) {
                        case 1:
                            stats.value.wins1Guess++;
                            break;
                        case 2:
                            stats.value.wins2Guess++;
                            break;
                        case 3:
                            stats.value.wins3Guess++;
                            break;
                        case 4:
                            stats.value.wins4Guess++;
                            break;
                    }
                } else {
                    stats.value.totalFailures++;
                }
                await saveUserStats();
            };

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
                knownLetters,
                playerCount,
                handleTouchEnd,
                stats,
                showStats
            };
        },
    }
);
</script>