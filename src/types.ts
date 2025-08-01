export interface PortfolioContent{
    title: string,
    role: string,
    content: string[],
    date: string,
    images: string[]
}

export interface FlagAnswerData{
    countryName : string;
    imageUrl : string;
    area: string;
    hasGlobeData: boolean;
}

export interface FlagGameOptions{
    answerCount : number;
    questionMode: 'flag' | 'name' | 'globe';
    answerMode: 'flag' | 'name' | 'globe';
    nameEntryType: 'button' | 'inputField';
    multipleAnswerMode: 'switch' | 'checkoff';
    regionFilter: string[];
}

export interface FlagHighscores{
    highscores : FlagHighscore[];
}

export interface FlagHighscore{
    questionMode : string;
    answerMode : string;
    region : string;
    time : number;
    name: string;
}

export interface WordGameData {
    word: string;
    letters: string[];
    wildcardReason: string;
    wildcard: string;
    synonyms: string[];
}

export interface CluedleStats {
    totalWins: number;
    wins1Guess: number;
    wins2Guess: number;
    wins3Guess: number;
    wins4Guess: number;
    totalFailures: number;
}