module.exports = encodedURL => {
    const map = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7, 'i': 8, 'j': 9, 'k': 'a', 'l': 'b', 'm': 'c', 'n': 'd', 'o': 'e', 'p': 'f', 'q': 'g', 'r': 'h', 's': 'i', 't': 'j', 'u': 'k', 'v': 'l', 'w': 'm', 'x': 'n', 'y': 'o', 'z': 'p' };
    return parseInt(encodedURL.split('').reverse().map(item => map[item]).join(''), 26);
};