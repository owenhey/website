export interface PostData{
    title: string;
    description: string;
    date: Date;
    url: string;
    thumbnail: string,
    sections: SectionData[];
}

export interface SectionData{
    sectionType : SectionType;
    content: string[];
}

type ValueOf<T> = T[keyof T];

// Create an object with all the values
const SectionTypeValues = {
    title: 'title',
    subtitle: 'subtitle',
    paragraph: 'paragraph',
    dotlist: 'dotlist',
    numlist: 'numlist',
    image: 'image',
    html: 'html',
    centeredText: 'centeredtext',
    codeBlock: 'codeblock',
    video: 'video',
    error: 'error'
} as const;

// Get union type from the object values
type SectionType = ValueOf<typeof SectionTypeValues>;

export function CreatePostData(postFile : string) : PostData{
    console.log("------ Creating post data for file: " + postFile.substring(0, 20));
    const titleIndex = postFile.indexOf('_title_:');
    const descriptionIndex = postFile.indexOf('_description_:');
    const dateIndex = postFile.indexOf('_date_:');
    const thumbnailIndex = postFile.indexOf('_thumbnail_:');
    const urlIndex = postFile.indexOf('_url_:');

    if (titleIndex === -1 || descriptionIndex === -1 || dateIndex === -1 || urlIndex === -1 || thumbnailIndex === -1)  {
        throw new Error('Missing required metadata fields in post');
    }

    // Find start of actual content (after the colon)
    const titleStart = postFile.indexOf(':', titleIndex) + 1;
    const descriptionStart = postFile.indexOf(':', descriptionIndex) + 1;
    const dateStart = postFile.indexOf(':', dateIndex) + 1;
    const thumbnailStart = postFile.indexOf(':', thumbnailIndex) + 1;
    const urlStart = postFile.indexOf(':', urlIndex) + 1;

    // Find the end of each section (next newline)
    const titleEnd = postFile.indexOf('\n', titleStart);
    const descriptionEnd = postFile.indexOf('\n', descriptionStart);
    const thumbnailEnd = postFile.indexOf('\n', thumbnailStart);
    const dateEnd = postFile.indexOf('\n', dateStart);
    const urlEnd = postFile.indexOf('\n', urlStart);

    // Extract and trim the values
    const title = postFile.substring(titleStart, titleEnd !== -1 ? titleEnd : descriptionIndex).trim();
    const description = postFile.substring(descriptionStart, descriptionEnd).trim();
    const dateStr = postFile.substring(dateStart, dateEnd).trim();
    const thumbNail = postFile.substring(thumbnailStart, thumbnailEnd).trim();
    const url = postFile.substring(urlStart, urlEnd !== -1 ? urlEnd : undefined).trim();

    // Parse the date
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Next, find the start of the file after the long series of -----
    const postStart = postFile.indexOf('----\n') + 5;

    let startIndex = postStart;
    for (let index = 0; index < 3; index++) {
        const ret = SearchForNextSection(postFile, startIndex);
        startIndex += ret!.text.length;
    }

    // Now, we loop and look for things within brackets
    startIndex = postStart;
    const sectionList : SectionData[] = [];
    let nextSection = SearchForNextSection(postFile, postStart);
    while(nextSection.nextIndex >= 0){
        addSection(sectionList, nextSection);

        nextSection = SearchForNextSection(postFile, nextSection!.nextIndex);
    }
    // Add the last one
    addSection(sectionList, nextSection);

    return {
        title: title,
        description: description,
        date: date,
        url: url,
        thumbnail: thumbNail,
        sections: sectionList
    }
}

function addSection(sectionData : SectionData[], nextSectionInfo : NextSectionInformation){
    let content : string[] = [];
    if(nextSectionInfo.sectionType === 'dotlist' ||
        nextSectionInfo.sectionType === 'numlist' ||
        nextSectionInfo.sectionType === 'image' ||
        nextSectionInfo.sectionType === 'video' ||
        nextSectionInfo.sectionType === 'codeblock'
    ){
        content = nextSectionInfo.text.split('\n');
    }
    else{
        content.push(nextSectionInfo.text);
    }

    sectionData.push({
        sectionType: nextSectionInfo.sectionType,
        content: content
    });
}

const sectionStringKeys = (Object.values(SectionTypeValues) as SectionType[]).map(key => `[${key}]`);

interface NextSectionInformation{
    sectionType: SectionType,
    text: string,
    nextIndex : number
}

function SearchForNextSection(file : string, startIndex : number) : NextSectionInformation{
    // First, grab the type of section we are looking at
    const closeBracketIndex = file.indexOf(']', startIndex);
    const typeOfSection = file.substring(startIndex + 1, closeBracketIndex);
    // console.log("type of section: "  + typeOfSection);
    // console.log("start and end brackets: "  + (startIndex + 1) + " " + closeBracketIndex);

    const nextOccurrences = sectionStringKeys
        .map(phrase => ({
            phrase,
            index: file.indexOf(phrase, closeBracketIndex + 1)
        }))
        .filter(occurrence => occurrence.index !== -1);

    // If no next phrase is found
    if (nextOccurrences.length === 0) {
        return{
            sectionType: ToSectionType(typeOfSection),
            text: file.slice(closeBracketIndex + 1).trim(),
            nextIndex: -1
        }
    }
    
    // Find the closest next phrase
    const nextOccurrence = nextOccurrences.reduce((closest, current) => 
        current.index < closest.index ? current : closest
    );

    const content = file.slice(closeBracketIndex + 1, nextOccurrence.index);
    return{
        sectionType: ToSectionType(typeOfSection),
        text: content.trim(),
        nextIndex: closeBracketIndex + content.length + 1
    }
}

function ToSectionType(key : string) : SectionType{
    if(isSectionType(key)){
        return key as SectionType;
    }
    return 'error';
}

function isSectionType(value: string): value is SectionType {
    return Object.values(SectionTypeValues).includes(value as SectionType);
}