import { WordGameData } from '@/types';

export const gameData: WordGameData[] = [
    {
        word: "GOLDFISH",
        letters: ['S', 'G', 'F'],
        wildcard: "SNACK",
        wildcardReason: 'Goldfish is also a type of snack.',
        synonyms: ["MEMORY", "ANIMAL", "AQUATIC", "PET"]
    },
    {
        word: "POKE",
        letters: ['K', 'P', 'E'],
        wildcard: "SUSHI",
        wildcardReason: 'Poke is also a dish with raw fish, or sushi, in it.',
        synonyms: ["FINGER", "FLIRT", "JAB", "PROD"]
    },
    {
        word: "DRAGON",
        letters: ['R', 'N', 'G'],
        wildcard: "BENEDICT",
        wildcardReason: 'Benedict Cumberpatch played the dragon Smaug in the new Hobbit movies.',
        synonyms: ["GOLD", "FLAMES", "FLIGHT", "MONSTER"]
    },
    {
        word: "KNIGHT",
        letters: ['H', 'N', 'K'],
        wildcard: "DARK",
        wildcardReason: "It is dark at night, which is a homophone for knight.",
        synonyms: ["HORSEBACK", "MEDIEVAL", "JOUST", "WARRIOR"]
    },
    {
        word: "GHOST",
        letters: ['S', 'G', 'T'],
        wildcard: "BUST",
        wildcardReason: "The movie Ghostbusters",
        synonyms: ["HAUNTED", "INCORPOREAL", "SPIRIT", "PHANTOM"]
    },
    {
        word: "BANANA",
        letters: ['N', 'B', 'A'],
        wildcard: "Republic",
        wildcardReason: 'The phrase / store "Banana Republic',
        synonyms: ["MONKEY", "PEEL", "FRUIT", "YELLOW"]
    },
    {
        word: "TUTORIAL",
        letters: ['T', 'A', 'R'],
        wildcard: "Skip",
        wildcardReason: 'People tend to skip tutorials, like many did while playtesting this game.',
        synonyms: ["LEARN", "POPUP", "RULES", "INTRODUCTION"]
    },
    {
        word: "BEAST",
        letters: ['S', 'B', 'A'],
        wildcard: "Mister",
        wildcardReason: 'The famous YouTuber Mr. Beast',
        synonyms: ["Controversial", "contest", "content", "youtube"]
    },
    {
        word: "TEA",
        letters: ['A', 'E', 'T'],
        wildcard: "Golf",
        wildcardReason: 'A golf tee - homophone for tea.',
        synonyms: ["bag", "mug", "steep", "caffeine"]
    },
    {
        word: "RING",
        letters: ['G', 'R', 'I'],
        wildcard: "SATURN",
        wildcardReason: "Saturn's rings",
        synonyms: ["BAND", "ROCK", "FINGER", "JEWELRY"]
    },
    {
        word: "MOUSE",
        letters: ['S', 'O', 'U'],
        wildcard: "MEN",
        wildcardReason: "Of Mice and Men - famous book",
        synonyms: ["Laboratory", "Cheese", "Disney", "Rodent"]
    },


].map(game => ({
    ...game,
    word: game.word.toUpperCase(),
    letters: game.letters.map(l => l.toUpperCase()),
    wildcard: game.wildcard.toUpperCase(),
    synonyms: game.synonyms.map(s => s.toUpperCase())
}));