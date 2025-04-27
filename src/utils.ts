import { FlagGameOptions } from "./types";

export function GetReadableDate(date : Date){
    return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'})
}

export function ParseString(text : string) : string{
    text = text.replace(/\[b\](.*?)\[b\]/g, '<b>$1</b>');
    text = text.replace(/\[i\](.*?)\[i\]/g, '<i>$1</i>');
    text = text.replace(/\[code\](.*?)\[code\]/g, '<span class="code-font">$1</span>');
    text = text.replace(/\[link\](.*?),(.*?)\[link\]/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    text = text.replace(/\[tab\]/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    text = text.replace(/\[startbracket\]/g, '[');
    text = text.replace(/\[endbracket\]/g, ']');
    return text;
}

export function GetDefaultFlagGameOptions() : FlagGameOptions{
    return {
        answerCount: 8,
        mode: 'flag',
        nameEntryType: 'button',
        regionFilter: []
    }
}