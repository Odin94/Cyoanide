
const LEVEL_STATE_KEY = "LEVEL_STATE"

export const saveLevelState = (levelSlug: string): string[] => {
    const rawLevelState = localStorage.getItem(LEVEL_STATE_KEY) ?? "[]"
    let levelState = JSON.parse(rawLevelState) as string[]

    const currentLevelIndex = levelState.indexOf(levelSlug)
    if (currentLevelIndex > -1) {
        levelState = levelState.slice(0, currentLevelIndex + 1)
    } else {
        levelState.push(levelSlug)
    }

    localStorage.setItem(LEVEL_STATE_KEY, JSON.stringify(levelState))

    return levelState
}

export const getLevelState = (): string[] => {
    const rawLevelState = localStorage.getItem(LEVEL_STATE_KEY) ?? "[]"
    return JSON.parse(rawLevelState) as string[]
}

export const resetLevelState = () => {
    localStorage.setItem(LEVEL_STATE_KEY, "[]")
}