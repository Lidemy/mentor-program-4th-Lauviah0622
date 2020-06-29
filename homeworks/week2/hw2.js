function capitalize(str) {
    let firstCha = isLowerCase(str[0]) ? chaCapitalize(str[0]) : str[0];
    return firstCha + str.slice(1)
}

const getChaCode = (str) => {
    return str.charCodeAt(0)
}

const isLowerCase = (str) => {
    return getChaCode(str) >= 97 && getChaCode(str) <= 122
}


const chaCapitalize = (cha) => {
    return String.fromCharCode(getChaCode(cha) - 32)
}

console.log(capitalize('a2aasd'))
