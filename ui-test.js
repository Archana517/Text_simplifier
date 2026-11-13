const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== RUNNING UI INTERACTION TESTS FOR TEXT SIMPLIFIER ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// Set up mock DOM elements
const elements = {
  inputText: { id: "inputText", value: "", focusCalled: false, focus() { this.focusCalled = true; }, addEventListener(e, fn) { this[e] = fn; } },
  charCount: { id: "charCount", textContent: "" },
  wordCount: { id: "wordCount", textContent: "" },
  errorMessage: {
    id: "errorMessage",
    textContent: "",
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    }
  },
  simplifyBtn: { id: "simplifyBtn", addEventListener(e, fn) { this[e] = fn; } },
  clearBtn: { id: "clearBtn", addEventListener(e, fn) { this[e] = fn; } },
  resultsSection: {
    id: "resultsSection",
    scrollIntoViewCalled: false,
    scrollIntoView() { this.scrollIntoViewCalled = true; },
    classList: {
      classes: new Set(["hidden"]),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    }
  },
  originalTextDisplay: { id: "originalTextDisplay", textContent: "" },
  simplifiedTextDisplay: { id: "simplifiedTextDisplay", textContent: "" },
  copyBtn: {
    id: "copyBtn",
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    },
    addEventListener(e, fn) { this[e] = fn; }
  },
  copyText: { id: "copyText", textContent: "Copy Result" },
  copyIcon: { id: "copyIcon", innerHTML: "" },
  wordsList: { id: "wordsList", innerHTML: "", children: [], appendChild(c) { this.children.push(c); } },
  difficultWordsCount: { id: "difficultWordsCount", textContent: "0 words" }
};

let copiedText = "";
const domMock = {
  document: {
    getElementById: (id) => elements[id],
    createElement: (tag) => ({
      tag,
      className: "",
      innerHTML: "",
      textContent: "",
      style: {},
      select() {},
      focus() {}
    }),
    body: { appendChild() {}, removeChild() {} }
  },
  window: { isSecureContext: true },
  navigator: {
    clipboard: {
      writeText: (t) => {
        copiedText = t;
        return Promise.resolve();
      }
    }
  },
  console: console,
  setTimeout: (fn, ms) => { fn(); return 1; },
  clearTimeout: () => {}
};

const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const context = vm.createContext(domMock);
vm.runInContext(jsContent, context);

// Test 1: Empty input validation on Simplify click
elements.inputText.value = "   ";
elements.simplifyBtn.click();
assert(elements.errorMessage.classList.contains("visible"), "Error message visible when input is blank");
assert(elements.errorMessage.textContent.includes("Please enter some text"), "Error message text is informative");
assert(elements.resultsSection.classList.contains("hidden"), "Results section remains hidden on empty input");
assert(elements.inputText.focusCalled, "Input was focused on validation error");

// Test 2: Typing updates counters and clears error
elements.inputText.value = "We must utilize modern methodology.";
elements.inputText.input();
assert(elements.charCount.textContent === "35 characters", "Char count correctly updated to 35");
assert(elements.wordCount.textContent === "5 words", "Word count correctly updated to 5");
assert(!elements.errorMessage.classList.contains("visible"), "Error message cleared on typing");

// Test 3: Successful simplification
elements.simplifyBtn.click();
assert(!elements.resultsSection.classList.contains("hidden"), "Results section is revealed");
assert(elements.resultsSection.scrollIntoViewCalled, "Results section scrolled into view");
assert(elements.originalTextDisplay.textContent === "We must utilize modern methodology.", "Original text preserved in display");
assert(elements.simplifiedTextDisplay.textContent === "We must use modern method.", "Simplified text correctly formatted");
assert(elements.difficultWordsCount.textContent === "2 words", "Word count badge shows 2 words");
assert(elements.wordsList.children.length === 2, "2 word cards rendered in words list");

// Test 4: Copy button functionality
elements.copyBtn.click();
setTimeout(() => {
  assert(copiedText === "We must use modern method.", "Clipboard received simplified text");
}, 10);

// Test 5: Clear button functionality
elements.clearBtn.click();
assert(elements.inputText.value === "", "Input cleared");
assert(elements.charCount.textContent === "0 characters", "Char count reset to 0");
assert(elements.wordCount.textContent === "0 words", "Word count reset to 0");
assert(elements.resultsSection.classList.contains("hidden"), "Results section hidden on clear");
assert(elements.originalTextDisplay.textContent === "", "Original text display cleared");
assert(elements.simplifiedTextDisplay.textContent === "", "Simplified text display cleared");
assert(elements.wordsList.innerHTML === "", "Words list cleared");
assert(elements.difficultWordsCount.textContent === "0 words", "Words count badge reset");

console.log(`\n=== UI TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
if (failed > 0) process.exit(1);
