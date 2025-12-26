const readline = require("readline/promises");
const { try_match } = require("./match.js");
const { Variable } = require("./rules.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function stringify(rule) {
  const derivation = [];
  const root_production = [];

  for (const comp of rule.derivation) {
    if (comp instanceof Variable) {
      derivation.push(comp.name);
    } else {
      derivation.push(`"${comp.content}"`);
    }
  }

  for (const comp of rule.root_production) {
    root_production.push(comp.name);
  }

  return `${derivation.join(" ")} -> ${root_production.join(" ")}`;
}

async function run() {
  while (true) {
    const input = await rl.question("Enter verb: ");
    let result;

    try {
      result = try_match(input);
    } catch (e) {
      console.log(e);
      continue;
    }

    if (!result) {
      console.log("Invalid verb");
      continue;
    }

    const { rule, root, components } = result;

    console.log(stringify(rule));
    console.log("root word: ", root);
    console.log("aux data: ", rule.aux_data);
    console.log(components);
    console.log();
  }
}

run();
