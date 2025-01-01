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
    const descriptionEnd = postFile.indexOf('\n', descriptionStart);
    const dateEnd = postFile.indexOf('\n', dateStart);
    const urlEnd = postFile.indexOf('\n', urlStart);

    // Extract and trim the values
    const title = postFile.substring(titleStart, titleEnd !== -1 ? titleEnd : descriptionIndex).trim();
    const description = postFile.substring(descriptionStart, dateIndex).trim();
    const dateStr = postFile.substring(dateStart, urlIndex).trim();
    const url = postFile.substring(urlStart, urlEnd !== -1 ? urlEnd : undefined).trim();

    // Parse the date
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return {
        title: title,
        description: description,
        date: date,
        url: url,
        sections: []
    }
}