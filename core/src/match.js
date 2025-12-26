const { readFileSync, lstatSync } = require("node:fs");
const { join } = require("node:path");
const parse = require("./parser.js");

let cached_rules = null;
let last_modify_rules = 0;

function parse_rules() {
  const RULES_PATH = join(__dirname, "transformation.rules");
  const { mtimeMs } = lstatSync(RULES_PATH);
  if (mtimeMs != last_modify_rules) {
    last_modify_rules = mtimeMs;
    const rules = readFileSync(RULES_PATH, "utf-8");
    cached_rules = parse(rules);
  }
  return cached_rules;
}

const ROOT_WORDS_PATH = join(__dirname, "data", "root_words.json");
let cached_root_words = null;

function load_root_words() {
  if (cached_root_words) {
    return cached_root_words;
  }

  try {
    let data = readFileSync(ROOT_WORDS_PATH, "utf8");

    if (data.charCodeAt(0) === 0xfeff) {
      data = data.slice(1);
    }

    const parsed = JSON.parse(data);

    cached_root_words = parsed.words;
    return cached_root_words;
  } catch (err) {
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
    result += instances.get(comp.name)[0];
  }
  return result;
}

function try_match(input) {
  const rules = parse_rules();
  let matched_rule, matched_instances;

  for (const rule of rules) {
    let instances = new Map();
    instances.set("affixes", []);
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

  if (!matched_rule) {
    return null;
  }

  const affixes = matched_instances.get("affixes");
  let variables = Array.from(matched_instances.entries())
    .filter(([key, _]) => key != "affixes")
    .map(([_, val]) => val.slice())
    .sort((a, b) => a[1] - b[1]);

  variables = (() => {
    // merge consecutive variables
    const result = [variables[0]];
    for (let i = 1; i < variables.length; i++) {
      const last = result.at(-1);
      if (last[1] + last[0].length == variables[i][1]) {
        last[0] += variables[i][0];
      } else {
        result.push(variables[i]);
      }
    }
    return result;
  })();

  let used = new Array(input.length);
  used.fill(0, 0, input.length);
  for (const [str, ind] of affixes) {
    used.fill(1, ind, ind + str.length);
  }
  for (const [str, ind] of variables) {
    used.fill(1, ind, ind + str.length);
  }

  const redups = [];
  for (let i = 0; i < input.length; i++) {
    if (!used[i]) {
      let redup = "";
      for (let j = i; j < input.length && !used[j]; j++) {
        used[j] = 1;
        redup += input[j];
      }
      redups.push([redup, i]);
    }
  }

  const objectify = (kind) => {
    return ([str, ind]) => {
      return {
        str,
        ind,
        kind,
      };
    };
  };

  const components = affixes
    .map(objectify("affix"))
    .concat(variables.map(objectify("root")))
    .concat(redups.map(objectify("redup")))
    .sort((a, b) => a.ind - b.ind)
    .map(({ str, kind }) => {
      return { str, kind };
    });
  return {
    rule: matched_rule,
    root: produce_rootword(matched_rule, matched_instances),
    components: components,
  };
}

module.exports = {
  try_match,
};
