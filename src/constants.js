
export const DEFAULT_EMPTY_HIGHSCORES = {
    "easy": [],
    "normal": [],
    "hard": [],
    "veryHard": [],
    "maniac": [],
    'loaded': false
}

export const DEFAULT_WRAPPER_STATE = {
    username: undefined,
    useremail: undefined,
    userimageurl: undefined,
    token: undefined,
    isSignedIn: false,
    loaded : false,
    highscores : DEFAULT_EMPTY_HIGHSCORES,
    globalhighscores : DEFAULT_EMPTY_HIGHSCORES,
    difficulty: 'easy'
}

export const DIFF_COLORS = {
    "easy": "green",
    "normal": "orange",
    "hard": "tomato",
    "veryHard": "orangered",
    "maniac": "darkslategray",
}
