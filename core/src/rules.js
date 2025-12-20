class Variable {
    constructor(name) {
        this.name = name
    }
    try_match(inp, ind, instances) {
        instances.set(this.name, inp.substr(ind));
        return inp.length - ind;
    }
}

class Affix {
    constructor(content) {
        this.content = content
    }
    try_match(inp, ind, instances) {
        if (inp.substring(ind, ind + this.content.length) == this.content) {
            return this.content.length
        }
        return 0
    }    
}

const VOWELS = 'aeiou'

class Vowel extends Variable {
    constructor() {
        super('V')
    }
    try_match(inp, ind, instances) {
        const instance = instances.get(this.name)
        if (instance) {
            return +(instance == inp[ind])
        }
        instances.set(this.name, inp[ind])
        return +(VOWELS.indexOf(inp[ind]) != -1)
    }    
}

class Consonant extends Variable {
    constructor() {
        super('C')
    }
    try_match(inp, ind, instances) {
        const instance = instances.get(this.name)
        if (instance) {
            return +(instance == inp[ind])
        }
        instances.set(this.name, inp[ind])
        return +(VOWELS.indexOf(inp[ind]) == -1)        
    }
}

module.exports = {
    Variable, Consonant, Affix, Vowel
}