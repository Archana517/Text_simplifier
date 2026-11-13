const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== RUNNING AUTOMATED TESTS FOR TEXT SIMPLIFIER ===");

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

// 1. Check file existence
const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');
const jsPath = path.join(__dirname, 'script.js');

assert(fs.existsSync(htmlPath), "index.html exists");
assert(fs.existsSync(cssPath), "style.css exists");
assert(fs.existsSync(jsPath), "script.js exists");

// 2. Check HTML structure and required elements
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert(htmlContent.includes('id="inputText"'), "HTML has #inputText large textarea");
assert(htmlContent.includes('id="simplifyBtn"'), "HTML has #simplifyBtn Simplify Text button");
assert(htmlContent.includes('id="clearBtn"'), "HTML has #clearBtn Clear button");
assert(htmlContent.includes('id="copyBtn"'), "HTML has #copyBtn Copy Result button");
assert(htmlContent.includes('id="originalTextDisplay"'), "HTML has #originalTextDisplay for original text");
assert(htmlContent.includes('id="simplifiedTextDisplay"'), "HTML has #simplifiedTextDisplay for simplified text");
assert(htmlContent.includes('id="wordsList"'), "HTML has #wordsList for difficult words explanation");
assert(htmlContent.includes('viewport'), "HTML contains responsive viewport meta tag");

// 3. Check CSS for responsive design and required styling
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('@media (max-width: 768px)'), "CSS contains tablet/mobile media queries");
assert(cssContent.includes('.comparison-grid'), "CSS contains .comparison-grid styling");
assert(cssContent.includes('.word-item'), "CSS contains .word-item styling");
assert(cssContent.includes('.btn-copy'), "CSS contains .btn-copy styling");

// 4. Test JavaScript Core Logic
const domMock = {
  document: {
    getElementById: (id) => ({
      id,
      value: '',
      textContent: '',
      innerHTML: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      addEventListener: () => {},
      focus: () => {},
      scrollIntoView: () => {}
    }),
    createElement: (tag) => ({
      tag,
      className: '',
      innerHTML: '',
      appendChild: () => {},
      style: {}
    }),
    body: { appendChild: () => {}, removeChild: () => {} }
  },
  window: { isSecureContext: true },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};

const jsContent = fs.readFileSync(jsPath, 'utf8');
const context = vm.createContext(domMock);
vm.runInContext(jsContent, context);

// Test Case 1: Simple sentence with complex words
const test1 = context.simplifyText("We must utilize the resources to commence our project.");
console.log("\nTest Case 1 output:", test1.simplifiedText);
assert(test1.simplifiedText.toLowerCase().includes("use"), "Replaced 'utilize' with 'use'");
assert(test1.simplifiedText.toLowerCase().includes("start"), "Replaced 'commence' with 'start'");
assert(test1.identifiedWords.length === 2, "Identified exactly 2 difficult words");
assert(test1.identifiedWords.some(w => w.difficult.toLowerCase() === 'utilize'), "Identified 'utilize'");
assert(test1.identifiedWords.some(w => w.difficult.toLowerCase() === 'commence'), "Identified 'commence'");

// Test Case 2: Multi-word phrase replacement
const test2 = context.simplifyText("In order to succeed, prior to taking action, we must think.");
console.log("\nTest Case 2 output:", test2.simplifiedText);
assert(test2.simplifiedText.startsWith("To succeed"), "Replaced 'In order to' with 'To'");
assert(test2.simplifiedText.includes("before taking action"), "Replaced 'prior to' with 'before'");

// Test Case 3: Case preservation (Title Case and ALL CAPS)
const test3 = context.simplifyText("UTILIZE the tools. Commence the mission.");
console.log("\nTest Case 3 output:", test3.simplifiedText);
assert(test3.simplifiedText.includes("USE"), "Preserved ALL CAPS 'UTILIZE' -> 'USE'");
assert(test3.simplifiedText.includes("Start"), "Preserved Title Case 'Commence' -> 'Start'");

// Test Case 4: Text with no difficult words
const test4 = context.simplifyText("The cat sat on the mat and drank milk.");
console.log("\nTest Case 4 output:", test4.simplifiedText);
assert(test4.simplifiedText === "The cat sat on the mat and drank milk.", "Text without difficult words remains unchanged");
assert(test4.identifiedWords.length === 0, "No difficult words identified for simple text");

// Test Case 5: Word inflections (e.g., facilitates, scrutinized, eradicating)
const test5 = context.simplifyText("The team facilitates progress and scrutinized the data before eradicating errors.");
console.log("\nTest Case 5 output:", test5.simplifiedText);
assert(test5.simplifiedText.includes("helps"), "Replaced 'facilitates' with 'helps'");
assert(test5.simplifiedText.includes("examined"), "Replaced 'scrutinized' with 'examined'");
assert(test5.simplifiedText.includes("wiping out"), "Replaced 'eradicating' with 'wiping out'");

// Test Case 6: Matching explanations
const utilizeWord = test1.identifiedWords.find(w => w.difficult.toLowerCase() === 'utilize');
assert(utilizeWord && utilizeWord.meaning.length > 10, "Difficult word has a valid explanation");
console.log("Utilize explanation:", utilizeWord.meaning);

console.log(`\n=== TEST SUMMARY: ${passed} Passed, ${failed} Failed ===`);
if (failed > 0) {
  process.exit(1);
}
