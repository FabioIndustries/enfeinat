const cleanString = (str) => {
    return str.replace(/[\W_]+/g, " ").trim();
}

export { cleanString }