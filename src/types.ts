export interface PortfolioContent{
    title: string,
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