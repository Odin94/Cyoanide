
const LEVEL_STATE_KEY = "LEVEL_STATE"

const isBrowser = typeof window !== "undefined"

export const saveLevelState = (levelSlug: string): string[] => {
    if (!isBrowser) {
        // https://www.gatsbyjs.com/docs/debugging-html-builds/
        console.warn("Trying to access localstorage from SSR where it's not available")
        return []
    }

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
    if (!isBrowser) {
        // https://www.gatsbyjs.com/docs/debugging-html-builds/
        console.warn("Trying to access localstorage from SSR where it's not available")
        return []
    }

    const rawLevelState = localStorage.getItem(LEVEL_STATE_KEY) ?? "[]"
    return JSON.parse(rawLevelState) as string[]
}

export const resetLevelState = () => {
    if (!isBrowser) {
        // https://www.gatsbyjs.com/docs/debugging-html-builds/
        console.warn("Trying to access localstorage from SSR where it's not available")
        return
    }

    localStorage.setItem(LEVEL_STATE_KEY, "[]")
}