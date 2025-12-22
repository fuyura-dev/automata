const { readFileSync } = require( "node:fs");
const { join } = require('node:path')
const parse = require("./parser.js");

function parse_rules() {
    const RULES_PATH = join(__dirname, 'transformation.rules')
    const rules = readFileSync(RULES_PATH, 'utf-8')
    return parse(rules)
}

const ROOT_WORDS_PATH = join(__dirname, "data", "root_words.json")
let cached_root_words = null;

function load_root_words() {
    if (cached_root_words) {
        return cached_root_words;
    }

    try{
        let data = readFileSync(ROOT_WORDS_PATH, "utf8");

        if (data.charCodeAt(0) === 0xfeff) {
            data = data.slice(1);
        }

        const parsed = JSON.parse(data);
        
        cached_root_words = parsed.words;
        return cached_root_words;
    } catch(err) {
        console.error("Failed to read file:", err);
        return [];
    }
}

function is_valid_root(input) {
    const root_words = load_root_words();
    return root_words.includes(input);
}

function produce_rootword(rule, instances) {
    let result = "";
    for (const comp of rule.root_production) {
        result += instances.get(comp.name);
    }
    return result;
}

function try_match(input) {
    const rules = parse_rules();
    let matched_rule, matched_instances;

    for (const rule of rules) {
        let instances = new Map();
        let matched = 0;
        let fail = false;
        let remain = rule.derivation.reduce((sum, comp) => {
            return sum + comp.min_length();
        }, 0);

        for (const comp of rule.derivation) {
            remain -= comp.min_length();
            const cur_matched = comp.try_match(input, matched, instances, remain);
            if (!cur_matched) {
                fail = true;
                break;
            }
            matched += cur_matched;
        }

        if (!fail) {
            const root = produce_rootword(rule, instances);
            if (is_valid_root(root)) {
                matched_rule = rule;
                matched_instances = instances;
            }

        }
    }

    return [
        matched_rule, matched_instances
    ]
}

module.exports = {
    try_match,
    produce_rootword
}