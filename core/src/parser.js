const { Consonant, Affix, Vowel, Variable } = require('./rules.js')

function parse(input) {
    let ptr = 0;
    const rules = []

    let side = 0;
    let derivation = [];
    let root_production = [];
    let aux_data = "";

    while (ptr < input.length) {
        const chr = input[ptr++]
        let component;
        switch (chr) {
            case 'V':
                component = new Vowel();
                break;
            case 'C':
                component = new Consonant();
                break;
            case ' ':
            case '\t':
                break;
            case '"':
                let affix = "";
                while (ptr < input.length && input[ptr] != '"') {
                    affix += input[ptr];
                    ptr++;
                }
                if (input[ptr++] != '"') {
                    throw `Syntax Error at character ${ptr - 1}`
                }
                component = new Affix(affix)
                break;
            case '-':
                if (input[ptr++] != '>') {
                    throw `Syntax Error at character ${ptr - 1}`
                }
                side = 1
                break;
            case '\n':
                if (derivation.length == 0) continue;
                rules.push({
                    derivation,
                    root_production,
                    aux_data: JSON.parse(aux_data)
                })
                derivation = []
                root_production = []
                side = 0
                break;
            case '/':
                if (input[ptr++] != '/') {
                    throw `Syntax Error at character ${ptr - 1}`
                }
                while (ptr < input.length && input[ptr] != '\n') {
                    ptr++;
                }
                break;
            case '.':
                aux_data = "";
                while (ptr < input.length && input[ptr] != '\n' && input[ptr] != '/') {
                    aux_data += input[ptr];
                    ptr++;
                }
                break;
            default:
                component = new Variable(chr);
                break;
        }

        if (component) {
            if (side == 0) {
                derivation.push(component)
            } else {
                if (!(component instanceof Variable)) {
                    throw 'Syntax Error'
                }

                root_production.push(component)
            }
        }
    }
    if (derivation.length) {
        rules.push({
            derivation,
            root_production,
            aux_data: JSON.parse(aux_data)
        })
    }
    return rules;
}

module.exports = parse