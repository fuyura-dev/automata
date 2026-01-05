import Card from "./Card";

import inputIcon from "../assets/input.svg";
import analyzeIcon from "../assets/analyze.svg";
import resultsIcon from "../assets/results.svg";

function HowItWorks() {
  return (
    <div className="how" id="how">
      <h2 className="how-title">
        HOW FiVerba Works in <br /> Three Easy Steps
      </h2>
      <div className="how-cards">
        <Card
          icon={inputIcon}
          title={"INPUT"}
          color={"yellow"}
          desc={
            <>
              To use FiVerba, type a single Filipino verb in the input box.
              <br />
              <br />
              Note: FiVerba only accepts single words and does not analyze
              sentences, verb focus, or words not found in the dictionary.
            </>
          }
        />
        <Card
          icon={analyzeIcon}
          title={"ANALYZE"}
          color={"blue"}
          desc={
            "Press Enter or finish typing, and the system will automatically analyze the verb."
          }
        />
        <Card
          icon={resultsIcon}
          title={"RESULTS"}
          color={"green"}
          desc={
            "Vew the results, which include the root word, affixes, verb aspect (Infinitive, Completed, Uncompleted, or Contemplated), and the validity status of the verb."
          }
        />
      </div>
    </div>
  );
}

export default HowItWorks;
