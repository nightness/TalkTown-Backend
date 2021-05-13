const error = (message: string) => {
    return {
        isError: true,
        type: 'error',
        message: message
    }
}

const silentError = (message: string) => {
    return {
        isError: true,
        type: 'silent',
        message: message
    }
}

export { error, silentError }
