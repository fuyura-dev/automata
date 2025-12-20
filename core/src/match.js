const { readFileSync } = require( "node:fs");
const { join } = require('node:path')
const parse = require("./parser.js");

function parseRules() {
    const RULES_PATH = join(__dirname, 'transformation.rules')
    const rules = readFileSync(RULES_PATH, 'utf-8')
    return parse(rules)
}

function is_valid_root(input) {
    return true; // TODO implement
}

function produce_rootword(rule, instances) {
    let result = "";
    for (const comp of rule.root_production) {
        result += instances.get(comp.name);
    }
    return result;
}

function try_match(input) {
    const rules = parseRules();
    let matched_rule, matched_instances;

    for (const rule of rules) {
        let instances = new Map();
        let matched = 0;
        let fail = false;
        for (const comp of rule.derivation) {
            const cur_matched = comp.try_match(input, matched, instances)
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