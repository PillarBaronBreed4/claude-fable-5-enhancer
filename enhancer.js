#!/usr/bin/env node

const fs = require("fs");

const defaults = {
  genre: "literary speculative fiction",
  tone: "clear, vivid, emotionally grounded",
  length: "900-1200 words",
};

function parseArgs(argv) {
  const options = { ...defaults };
  const parts = [];

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (item === "--genre" && argv[index + 1]) {
      options.genre = argv[index + 1];
      index += 1;
      continue;
    }

    if (item === "--tone" && argv[index + 1]) {
      options.tone = argv[index + 1];
      index += 1;
      continue;
    }

    if (item === "--length" && argv[index + 1]) {
      options.length = argv[index + 1];
      index += 1;
      continue;
    }

    if (item === "--help" || item === "-h") {
      options.help = true;
      continue;
    }

    parts.push(item);
  }

  return { options, idea: parts.join(" ").trim() };
}

function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }

  return fs.readFileSync(0, "utf8").trim();
}

function usage() {
  return [
    "Claude Fable 5 Enhancer JS",
    "",
    "Usage:",
    "  node enhancer.js [--genre value] [--tone value] [--length value] \"story idea\"",
    "  echo \"story idea\" | node enhancer.js",
  ].join("\n");
}

function buildPrompt(idea, options) {
  return [
    "# Claude Fable 5 Enhanced Prompt",
    "",
    "## Core Idea",
    idea,
    "",
    "## Writing Objective",
    "Develop the idea into a polished fiction draft or planning response with a strong sense of scene, character motivation, and narrative momentum.",
    "",
    "## Creative Direction",
    `- Genre: ${options.genre}`,
    `- Tone: ${options.tone}`,
    `- Target length: ${options.length}`,
    "- Prioritize concrete sensory detail over exposition.",
    "- Keep character choices emotionally legible.",
    "- Preserve ambiguity when it makes the scene stronger.",
    "",
    "## Continuity Notes",
    "- Track names, locations, promises, injuries, objects, and unresolved questions.",
    "- Avoid contradicting earlier scene logic.",
    "- If a detail is missing, make one restrained assumption and keep going.",
    "",
    "## Output Format",
    "1. Brief premise refinement",
    "2. Scene or chapter draft",
    "3. Revision notes",
    "4. Continuity checklist",
    "",
    "## Final Pass",
    "Before finishing, tighten repeated phrasing, remove generic lines, and make the final paragraph carry a clear emotional turn.",
  ].join("\n");
}

const { options, idea } = parseArgs(process.argv.slice(2));
const input = idea || readStdin();

if (options.help) {
  console.log(usage());
  process.exit(0);
}

if (!input) {
  console.error(usage());
  process.exit(1);
}

console.log(buildPrompt(input, options));
