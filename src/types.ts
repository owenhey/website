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
}

export interface FlagGameOptions{
    answerCount : number;
    mode: 'flag' | 'name';
    nameEntryType: 'button' | 'inputField';
    regionFilter: string[];
}