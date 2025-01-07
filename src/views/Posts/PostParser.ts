export interface PostData{
    title: string;
    description: string;
    date: Date;
    url: string;
    sections: SectionData[];
}

export interface SectionData{
    sectionType : SectionType;
    content: string[];
}

export type SectionType = 
    'title' |
    'subtitle' |
    'paragraph' |
    'dotlist' |
    'numtitle';

export function CreatePostData(postFile : string) : PostData{
    const titleIndex = postFile.indexOf('_title_:');
    const descriptionIndex = postFile.indexOf('_description_:');
    const dateIndex = postFile.indexOf('_date_:');
    const urlIndex = postFile.indexOf('_url_:');

    if (titleIndex === -1 || descriptionIndex === -1 || dateIndex === -1 || urlIndex === -1) {
        throw new Error('Missing required metadata fields in post');
    }

    // Find start of actual content (after the colon)
    const titleStart = postFile.indexOf(':', titleIndex) + 1;
    const descriptionStart = postFile.indexOf(':', descriptionIndex) + 1;
    const dateStart = postFile.indexOf(':', dateIndex) + 1;
    const urlStart = postFile.indexOf(':', urlIndex) + 1;

    // Find the end of each section (next newline)
    const titleEnd = postFile.indexOf('\n', titleStart);
    const urlEnd = postFile.indexOf('\n', urlStart);

    // Extract and trim the values
    const title = postFile.substring(titleStart, titleEnd !== -1 ? titleEnd : descriptionIndex).trim();
    const description = postFile.substring(descriptionStart, dateIndex).trim();
    const dateStr = postFile.substring(dateStart, urlIndex).trim();
    const url = postFile.substring(urlStart, urlEnd !== -1 ? urlEnd : undefined).trim();

    // Parse the date
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Next, find the start of the file after the long series of -----
    const postStart = postFile.indexOf('----\n') + 5;

    let startIndex = postStart;
    for (let index = 0; index < 3; index++) {
        const ret = SearchForNextSection(postFile, startIndex);
        console.log(ret?.text);
        startIndex += ret!.text.length;
    }
    // Now, we loop and look for things within brackets
    SearchForNextSection(postFile, postStart);

    return {
        title: title,
        description: description,
        date: date,
        url: url,
        sections: []
    }
}

const sectionStringKeys = [
    '[title]',
    '[subtitle]',
    '[paragraph]',
    '[dotlist]',
    '[numlist]',
]

function SearchForNextSection(file : string, startIndex : number){
    // First, grab the type of section we are looking at
    const closeBracketIndex = file.indexOf(']', startIndex);
    const typeOfSection = file.substring(startIndex + 1, closeBracketIndex);

    const nextOccurrences = sectionStringKeys
        .map(phrase => ({
            phrase,
            index: file.indexOf(phrase, closeBracketIndex + 1)
        }))
        .filter(occurrence => occurrence.index !== -1);
    
    // If no next phrase is found
    if (nextOccurrences.length === 0) {
        console.log("nothing found!");
        console.log(file.slice(closeBracketIndex + 1).trim());
        return;
    }
    
    // Find the closest next phrase
    const nextOccurrence = nextOccurrences.reduce((closest, current) => 
        current.index < closest.index ? current : closest
    );

    return{
        sectionType: ToSectionType(typeOfSection),
        text: file.slice(closeBracketIndex + 1, nextOccurrence.index).trim(),
    }
}

function ToSectionType(key : string) : SectionType{
    if(key === 'title'){
        return key;
    }
    return 'title';
}