/**
 * Text Simplifier - JavaScript Functionality
 * Handles text simplification, difficult word explanation,
 * copying to clipboard, clearing inputs, and live counters.
 */

// ============================================================================
// 1. DICTIONARY OF DIFFICULT WORDS & PHRASES
// ============================================================================
// Each entry includes:
// - word: the difficult word or phrase to detect
// - simple: the simpler, easy-English alternative
// - meaning: clear, beginner-friendly explanation of what the word means

const DICTIONARY = [
  // --- Verbose / Complex Phrases (processed first) ---
  {
    word: "in order to",
    simple: "to",
    meaning: "Used to explain the purpose of an action. It can almost always be replaced with just 'to'."
  },
  {
    word: "prior to",
    simple: "before",
    meaning: "Happening earlier than a specific time or event."
  },
  {
    word: "subsequent to",
    simple: "after",
    meaning: "Happening after a specific time or event."
  },
  {
    word: "due to the fact that",
    simple: "because",
    meaning: "For the reason that; introduces an explanation."
  },
  {
    word: "in the event that",
    simple: "if",
    meaning: "Used to say that something may happen."
  },
  {
    word: "at this point in time",
    simple: "now",
    meaning: "At the present moment."
  },
  {
    word: "at the present time",
    simple: "now",
    meaning: "Currently or at this exact moment."
  },
  {
    word: "in the near future",
    simple: "soon",
    meaning: "Within a short period of time."
  },
  {
    word: "for the purpose of",
    simple: "to",
    meaning: "With the goal or intention of doing something."
  },
  {
    word: "with regard to",
    simple: "about",
    meaning: "Concerning or relating to a topic."
  },
  {
    word: "with reference to",
    simple: "about",
    meaning: "In connection with or referring to something."
  },
  {
    word: "in close proximity to",
    simple: "near",
    meaning: "Very close to a person, place, or thing."
  },
  {
    word: "in close proximity",
    simple: "nearby",
    meaning: "Very close or in the same area."
  },
  {
    word: "take into consideration",
    simple: "consider",
    meaning: "To think carefully about something before making a decision."
  },
  {
    word: "give consideration to",
    simple: "consider",
    meaning: "To spend time thinking about an idea or proposal."
  },
  {
    word: "reach a decision",
    simple: "decide",
    meaning: "To make up one's mind after thinking."
  },
  {
    word: "reach a conclusion",
    simple: "conclude",
    meaning: "To figure out or decide something after considering facts."
  },
  {
    word: "make an inquiry",
    simple: "ask",
    meaning: "To ask a question or request information."
  },
  {
    word: "a large number of",
    simple: "many",
    meaning: "A lot of people or things."
  },
  {
    word: "a small number of",
    simple: "a few",
    meaning: "Not many; a small amount."
  },
  {
    word: "on a daily basis",
    simple: "daily",
    meaning: "Happening every day."
  },
  {
    word: "despite the fact that",
    simple: "although",
    meaning: "Even though something else is true."
  },
  {
    word: "in accordance with",
    simple: "following",
    meaning: "In agreement with or following a set rule or guideline."
  },
  {
    word: "has the capacity to",
    simple: "can",
    meaning: "Has the ability or power to do something."
  },

  // --- Verbs (with common inflections) ---
  {
    word: "utilize",
    simple: "use",
    meaning: "To use something for a specific practical purpose."
  },
  {
    word: "utilizes",
    simple: "uses",
    meaning: "To use something for a specific practical purpose."
  },
  {
    word: "utilized",
    simple: "used",
    meaning: "To use something for a specific practical purpose."
  },
  {
    word: "utilizing",
    simple: "using",
    meaning: "To use something for a specific practical purpose."
  },
  {
    word: "commence",
    simple: "start",
    meaning: "To begin an activity or event."
  },
  {
    word: "commences",
    simple: "starts",
    meaning: "To begin an activity or event."
  },
  {
    word: "commenced",
    simple: "started",
    meaning: "To begin an activity or event."
  },
  {
    word: "commencing",
    simple: "starting",
    meaning: "To begin an activity or event."
  },
  {
    word: "terminate",
    simple: "end",
    meaning: "To bring something to a finish or stop."
  },
  {
    word: "terminates",
    simple: "ends",
    meaning: "To bring something to a finish or stop."
  },
  {
    word: "terminated",
    simple: "ended",
    meaning: "To bring something to a finish or stop."
  },
  {
    word: "terminating",
    simple: "ending",
    meaning: "To bring something to a finish or stop."
  },
  {
    word: "facilitate",
    simple: "help",
    meaning: "To make a process or action easier."
  },
  {
    word: "facilitates",
    simple: "helps",
    meaning: "To make a process or action easier."
  },
  {
    word: "facilitated",
    simple: "helped",
    meaning: "To make a process or action easier."
  },
  {
    word: "facilitating",
    simple: "helping",
    meaning: "To make a process or action easier."
  },
  {
    word: "implement",
    simple: "carry out",
    meaning: "To put a plan, system, or decision into effect."
  },
  {
    word: "implements",
    simple: "carries out",
    meaning: "To put a plan, system, or decision into effect."
  },
  {
    word: "implemented",
    simple: "carried out",
    meaning: "To put a plan, system, or decision into effect."
  },
  {
    word: "implementing",
    simple: "carrying out",
    meaning: "To put a plan, system, or decision into effect."
  },
  {
    word: "demonstrate",
    simple: "show",
    meaning: "To clearly show or explain how something works or is true."
  },
  {
    word: "demonstrates",
    simple: "shows",
    meaning: "To clearly show or explain how something works or is true."
  },
  {
    word: "demonstrated",
    simple: "showed",
    meaning: "To clearly show or explain how something works or is true."
  },
  {
    word: "demonstrating",
    simple: "showing",
    meaning: "To clearly show or explain how something works or is true."
  },
  {
    word: "indicate",
    simple: "show",
    meaning: "To point out or make something known."
  },
  {
    word: "indicates",
    simple: "shows",
    meaning: "To point out or make something known."
  },
  {
    word: "indicated",
    simple: "showed",
    meaning: "To point out or make something known."
  },
  {
    word: "indicating",
    simple: "showing",
    meaning: "To point out or make something known."
  },
  {
    word: "initiate",
    simple: "start",
    meaning: "To cause a process or action to begin."
  },
  {
    word: "initiates",
    simple: "starts",
    meaning: "To cause a process or action to begin."
  },
  {
    word: "initiated",
    simple: "started",
    meaning: "To cause a process or action to begin."
  },
  {
    word: "initiating",
    simple: "starting",
    meaning: "To cause a process or action to begin."
  },
  {
    word: "endeavor",
    simple: "try",
    meaning: "To try hard to achieve or do something."
  },
  {
    word: "endeavors",
    simple: "tries",
    meaning: "To try hard to achieve or do something."
  },
  {
    word: "endeavored",
    simple: "tried",
    meaning: "To try hard to achieve or do something."
  },
  {
    word: "endeavoring",
    simple: "trying",
    meaning: "To try hard to achieve or do something."
  },
  {
    word: "comprehend",
    simple: "understand",
    meaning: "To understand something fully and clearly."
  },
  {
    word: "comprehends",
    simple: "understands",
    meaning: "To understand something fully and clearly."
  },
  {
    word: "comprehended",
    simple: "understood",
    meaning: "To understand something fully and clearly."
  },
  {
    word: "comprehending",
    simple: "understanding",
    meaning: "To understand something fully and clearly."
  },
  {
    word: "elucidate",
    simple: "explain",
    meaning: "To make something clear and simple to understand."
  },
  {
    word: "elucidates",
    simple: "explains",
    meaning: "To make something clear and simple to understand."
  },
  {
    word: "elucidated",
    simple: "explained",
    meaning: "To make something clear and simple to understand."
  },
  {
    word: "elucidating",
    simple: "explaining",
    meaning: "To make something clear and simple to understand."
  },
  {
    word: "substantiate",
    simple: "prove",
    meaning: "To provide facts or evidence to prove something is true."
  },
  {
    word: "substantiates",
    simple: "proves",
    meaning: "To provide facts or evidence to prove something is true."
  },
  {
    word: "substantiated",
    simple: "proved",
    meaning: "To provide facts or evidence to prove something is true."
  },
  {
    word: "substantiating",
    simple: "proving",
    meaning: "To provide facts or evidence to prove something is true."
  },
  {
    word: "expedite",
    simple: "speed up",
    meaning: "To cause something to happen more quickly."
  },
  {
    word: "expedites",
    simple: "speeds up",
    meaning: "To cause something to happen more quickly."
  },
  {
    word: "expedited",
    simple: "sped up",
    meaning: "To cause something to happen more quickly."
  },
  {
    word: "expediting",
    simple: "speeding up",
    meaning: "To cause something to happen more quickly."
  },
  {
    word: "ascertain",
    simple: "find out",
    meaning: "To learn or discover facts with certainty."
  },
  {
    word: "ascertains",
    simple: "finds out",
    meaning: "To learn or discover facts with certainty."
  },
  {
    word: "ascertained",
    simple: "found out",
    meaning: "To learn or discover facts with certainty."
  },
  {
    word: "ascertaining",
    simple: "finding out",
    meaning: "To learn or discover facts with certainty."
  },
  {
    word: "perceive",
    simple: "notice",
    meaning: "To notice, see, or recognize something."
  },
  {
    word: "perceives",
    simple: "notices",
    meaning: "To notice, see, or recognize something."
  },
  {
    word: "perceived",
    simple: "noticed",
    meaning: "To notice, see, or recognize something."
  },
  {
    word: "perceiving",
    simple: "noticing",
    meaning: "To notice, see, or recognize something."
  },
  {
    word: "procure",
    simple: "get",
    meaning: "To obtain or acquire something through effort."
  },
  {
    word: "procures",
    simple: "gets",
    meaning: "To obtain or acquire something through effort."
  },
  {
    word: "procured",
    simple: "got",
    meaning: "To obtain or acquire something through effort."
  },
  {
    word: "procuring",
    simple: "getting",
    meaning: "To obtain or acquire something through effort."
  },
  {
    word: "scrutinize",
    simple: "examine",
    meaning: "To look at or examine something very closely and carefully."
  },
  {
    word: "scrutinizes",
    simple: "examines",
    meaning: "To look at or examine something very closely and carefully."
  },
  {
    word: "scrutinized",
    simple: "examined",
    meaning: "To look at or examine something very closely and carefully."
  },
  {
    word: "scrutinizing",
    simple: "examining",
    meaning: "To look at or examine something very closely and carefully."
  },
  {
    word: "eradicate",
    simple: "wipe out",
    meaning: "To completely destroy or get rid of something."
  },
  {
    word: "eradicates",
    simple: "wipes out",
    meaning: "To completely destroy or get rid of something."
  },
  {
    word: "eradicated",
    simple: "wiped out",
    meaning: "To completely destroy or get rid of something."
  },
  {
    word: "eradicating",
    simple: "wiping out",
    meaning: "To completely destroy or get rid of something."
  },
  {
    word: "collaborate",
    simple: "work together",
    meaning: "To work together with others to complete a task."
  },
  {
    word: "collaborates",
    simple: "works together",
    meaning: "To work together with others to complete a task."
  },
  {
    word: "collaborated",
    simple: "worked together",
    meaning: "To work together with others to complete a task."
  },
  {
    word: "collaborating",
    simple: "working together",
    meaning: "To work together with others to complete a task."
  },
  {
    word: "compensate",
    simple: "pay",
    meaning: "To pay someone money for work done or for a loss."
  },
  {
    word: "compensates",
    simple: "pays",
    meaning: "To pay someone money for work done or for a loss."
  },
  {
    word: "compensated",
    simple: "paid",
    meaning: "To pay someone money for work done or for a loss."
  },
  {
    word: "compensating",
    simple: "paying",
    meaning: "To pay someone money for work done or for a loss."
  },
  {
    word: "consolidate",
    simple: "combine",
    meaning: "To bring multiple things together into a single whole."
  },
  {
    word: "consolidates",
    simple: "combines",
    meaning: "To bring multiple things together into a single whole."
  },
  {
    word: "consolidated",
    simple: "combined",
    meaning: "To bring multiple things together into a single whole."
  },
  {
    word: "consolidating",
    simple: "combining",
    meaning: "To bring multiple things together into a single whole."
  },
  {
    word: "discontinue",
    simple: "stop",
    meaning: "To stop doing, using, or providing something."
  },
  {
    word: "discontinues",
    simple: "stops",
    meaning: "To stop doing, using, or providing something."
  },
  {
    word: "discontinued",
    simple: "stopped",
    meaning: "To stop doing, using, or providing something."
  },
  {
    word: "discontinuing",
    simple: "stopping",
    meaning: "To stop doing, using, or providing something."
  },
  {
    word: "articulate",
    simple: "express clearly",
    meaning: "To say or express an idea in a clear, understandable way."
  },
  {
    word: "articulates",
    simple: "expresses clearly",
    meaning: "To say or express an idea in a clear, understandable way."
  },
  {
    word: "articulated",
    simple: "expressed clearly",
    meaning: "To say or express an idea in a clear, understandable way."
  },
  {
    word: "articulating",
    simple: "expressing clearly",
    meaning: "To say or express an idea in a clear, understandable way."
  },
  {
    word: "disseminate",
    simple: "spread",
    meaning: "To distribute or spread information widely."
  },
  {
    word: "disseminates",
    simple: "spreads",
    meaning: "To distribute or spread information widely."
  },
  {
    word: "disseminated",
    simple: "spread",
    meaning: "To distribute or spread information widely."
  },
  {
    word: "disseminating",
    simple: "spreading",
    meaning: "To distribute or spread information widely."
  },
  {
    word: "deteriorate",
    simple: "get worse",
    meaning: "To become progressively worse in condition or value."
  },
  {
    word: "deteriorates",
    simple: "gets worse",
    meaning: "To become progressively worse in condition or value."
  },
  {
    word: "deteriorated",
    simple: "got worse",
    meaning: "To become progressively worse in condition or value."
  },
  {
    word: "deteriorating",
    simple: "getting worse",
    meaning: "To become progressively worse in condition or value."
  },
  {
    word: "alleviate",
    simple: "relieve",
    meaning: "To make pain, suffering, or a problem less severe."
  },
  {
    word: "alleviates",
    simple: "relieves",
    meaning: "To make pain, suffering, or a problem less severe."
  },
  {
    word: "alleviated",
    simple: "relieved",
    meaning: "To make pain, suffering, or a problem less severe."
  },
  {
    word: "alleviating",
    simple: "relieving",
    meaning: "To make pain, suffering, or a problem less severe."
  },
  {
    word: "fabricate",
    simple: "make up",
    meaning: "To invent or create false information."
  },
  {
    word: "fabricates",
    simple: "makes up",
    meaning: "To invent or create false information."
  },
  {
    word: "fabricated",
    simple: "made up",
    meaning: "To invent or create false information."
  },
  {
    word: "fabricating",
    simple: "making up",
    meaning: "To invent or create false information."
  },
  {
    word: "necessitate",
    simple: "require",
    meaning: "To make something necessary or essential."
  },
  {
    word: "necessitates",
    simple: "requires",
    meaning: "To make something necessary or essential."
  },
  {
    word: "necessitated",
    simple: "required",
    meaning: "To make something necessary or essential."
  },
  {
    word: "necessitating",
    simple: "requiring",
    meaning: "To make something necessary or essential."
  },
  {
    word: "reiterate",
    simple: "repeat",
    meaning: "To say or state something again for clarity."
  },
  {
    word: "reiterates",
    simple: "repeats",
    meaning: "To say or state something again for clarity."
  },
  {
    word: "reiterated",
    simple: "repeated",
    meaning: "To say or state something again for clarity."
  },
  {
    word: "reiterating",
    simple: "repeating",
    meaning: "To say or state something again for clarity."
  },
  {
    word: "relinquish",
    simple: "give up",
    meaning: "To voluntarily surrender or give up control of something."
  },
  {
    word: "relinquishes",
    simple: "gives up",
    meaning: "To voluntarily surrender or give up control of something."
  },
  {
    word: "relinquished",
    simple: "gave up",
    meaning: "To voluntarily surrender or give up control of something."
  },
  {
    word: "relinquishing",
    simple: "giving up",
    meaning: "To voluntarily surrender or give up control of something."
  },
  {
    word: "eliminate",
    simple: "remove",
    meaning: "To completely remove or get rid of something."
  },
  {
    word: "eliminates",
    simple: "removes",
    meaning: "To completely remove or get rid of something."
  },
  {
    word: "eliminated",
    simple: "removed",
    meaning: "To completely remove or get rid of something."
  },
  {
    word: "eliminating",
    simple: "removing",
    meaning: "To completely remove or get rid of something."
  },
  {
    word: "assist",
    simple: "help",
    meaning: "To give support or help to someone."
  },
  {
    word: "assists",
    simple: "helps",
    meaning: "To give support or help to someone."
  },
  {
    word: "assisted",
    simple: "helped",
    meaning: "To give support or help to someone."
  },
  {
    word: "assisting",
    simple: "helping",
    meaning: "To give support or help to someone."
  },
  {
    word: "obtain",
    simple: "get",
    meaning: "To come into possession of something."
  },
  {
    word: "obtains",
    simple: "gets",
    meaning: "To come into possession of something."
  },
  {
    word: "obtained",
    simple: "got",
    meaning: "To come into possession of something."
  },
  {
    word: "obtaining",
    simple: "getting",
    meaning: "To come into possession of something."
  },
  {
    word: "participate",
    simple: "take part",
    meaning: "To join in or take part in an activity."
  },
  {
    word: "participates",
    simple: "takes part",
    meaning: "To join in or take part in an activity."
  },
  {
    word: "participated",
    simple: "took part",
    meaning: "To join in or take part in an activity."
  },
  {
    word: "participating",
    simple: "taking part",
    meaning: "To join in or take part in an activity."
  },
  {
    word: "prohibit",
    simple: "ban",
    meaning: "To officially forbid something by law or rule."
  },
  {
    word: "prohibits",
    simple: "bans",
    meaning: "To officially forbid something by law or rule."
  },
  {
    word: "prohibited",
    simple: "banned",
    meaning: "To officially forbid something by law or rule."
  },
  {
    word: "prohibiting",
    simple: "banning",
    meaning: "To officially forbid something by law or rule."
  },
  {
    word: "modify",
    simple: "change",
    meaning: "To make small changes or adjustments to something."
  },
  {
    word: "modifies",
    simple: "changes",
    meaning: "To make small changes or adjustments to something."
  },
  {
    word: "modified",
    simple: "changed",
    meaning: "To make small changes or adjustments to something."
  },
  {
    word: "modifying",
    simple: "changing",
    meaning: "To make small changes or adjustments to something."
  },
  {
    word: "evaluate",
    simple: "assess",
    meaning: "To judge or determine the importance or value of something."
  },
  {
    word: "evaluates",
    simple: "assesses",
    meaning: "To judge or determine the importance or value of something."
  },
  {
    word: "evaluated",
    simple: "assessed",
    meaning: "To judge or determine the importance or value of something."
  },
  {
    word: "evaluating",
    simple: "assessing",
    meaning: "To judge or determine the importance or value of something."
  },
  {
    word: "inquire",
    simple: "ask",
    meaning: "To ask someone for information."
  },
  {
    word: "inquires",
    simple: "asks",
    meaning: "To ask someone for information."
  },
  {
    word: "inquired",
    simple: "asked",
    meaning: "To ask someone for information."
  },
  {
    word: "inquiring",
    simple: "asking",
    meaning: "To ask someone for information."
  },
  {
    word: "retain",
    simple: "keep",
    meaning: "To continue to have or hold on to something."
  },
  {
    word: "retains",
    simple: "keeps",
    meaning: "To continue to have or hold on to something."
  },
  {
    word: "retained",
    simple: "kept",
    meaning: "To continue to have or hold on to something."
  },
  {
    word: "retaining",
    simple: "keeping",
    meaning: "To continue to have or hold on to something."
  },

  // --- Adjectives & Adverbs ---
  {
    word: "erroneous",
    simple: "wrong",
    meaning: "Containing an error; incorrect."
  },
  {
    word: "erroneously",
    simple: "wrongly",
    meaning: "In a mistaken or incorrect way."
  },
  {
    word: "substantial",
    simple: "large",
    meaning: "Of considerable importance, size, or value."
  },
  {
    word: "substantially",
    simple: "largely",
    meaning: "To a great or significant extent."
  },
  {
    word: "sufficient",
    simple: "enough",
    meaning: "As much as is needed for a specific requirement."
  },
  {
    word: "sufficiently",
    simple: "enough",
    meaning: "To an adequate degree."
  },
  {
    word: "adequate",
    simple: "enough",
    meaning: "Satisfactory or acceptable in quality or quantity."
  },
  {
    word: "adequately",
    simple: "enough",
    meaning: "In a way that is satisfactory or meets the need."
  },
  {
    word: "abundant",
    simple: "plentiful",
    meaning: "Existing or available in very large quantities."
  },
  {
    word: "diminutive",
    simple: "small",
    meaning: "Extremely or unusually small."
  },
  {
    word: "colossal",
    simple: "huge",
    meaning: "Extremely large or massive in size."
  },
  {
    word: "meticulous",
    simple: "very careful",
    meaning: "Showing extreme care and attention to every detail."
  },
  {
    word: "meticulously",
    simple: "carefully",
    meaning: "With great care, precision, and attention to detail."
  },
  {
    word: "ambiguous",
    simple: "unclear",
    meaning: "Having more than one possible meaning; not clearly understood."
  },
  {
    word: "lucid",
    simple: "clear",
    meaning: "Expressed clearly; easy to comprehend."
  },
  {
    word: "superfluous",
    simple: "extra",
    meaning: "Unnecessary, especially through being more than what is needed."
  },
  {
    word: "pertinent",
    simple: "relevant",
    meaning: "Directly relating to the matter or subject at hand."
  },
  {
    word: "feasible",
    simple: "possible",
    meaning: "Capable of being done easily or conveniently."
  },
  {
    word: "unprecedented",
    simple: "never seen before",
    meaning: "Never done or known before; completely new."
  },
  {
    word: "detrimental",
    simple: "harmful",
    meaning: "Tending to cause harm, damage, or loss."
  },
  {
    word: "imperative",
    simple: "vital",
    meaning: "Of vital importance; absolutely necessary."
  },
  {
    word: "paramount",
    simple: "most important",
    meaning: "More important than anything else; of highest importance."
  },
  {
    word: "formidable",
    simple: "challenging",
    meaning: "Inspiring respect or fear by being very large, powerful, or intense."
  },
  {
    word: "obsolete",
    simple: "outdated",
    meaning: "No longer produced or used; out of date."
  },
  {
    word: "conspicuous",
    simple: "noticeable",
    meaning: "Standing out so as to be clearly visible or attracting attention."
  },
  {
    word: "inadvertent",
    simple: "accidental",
    meaning: "Not resulting from or achieved through deliberate planning."
  },
  {
    word: "inadvertently",
    simple: "accidentally",
    meaning: "Without intending to; by mistake."
  },
  {
    word: "prompt",
    simple: "quick",
    meaning: "Done immediately or without delay."
  },
  {
    word: "promptly",
    simple: "quickly",
    meaning: "Without delay; immediately."
  },
  {
    word: "subsequent",
    simple: "later",
    meaning: "Coming or happening after something else."
  },
  {
    word: "subsequently",
    simple: "later",
    meaning: "After a particular event has happened."
  },
  {
    word: "predominant",
    simple: "main",
    meaning: "Present as the strongest or main element."
  },
  {
    word: "predominantly",
    simple: "mainly",
    meaning: "For the most part; mainly."
  },
  {
    word: "approximate",
    simple: "about",
    meaning: "Close to the actual, but not completely accurate or exact."
  },
  {
    word: "approximately",
    simple: "about",
    meaning: "Used to show that something is almost, but not completely, accurate."
  },
  {
    word: "rigorous",
    simple: "thorough",
    meaning: "Extremely thorough, exhaustive, or accurate."
  },
  {
    word: "rigorously",
    simple: "thoroughly",
    meaning: "In an extremely thorough or strict manner."
  },
  {
    word: "comprehensive",
    simple: "complete",
    meaning: "Including or dealing with all or nearly all elements or aspects."
  },
  {
    word: "cumbersome",
    simple: "awkward",
    meaning: "Large or heavy and therefore difficult to carry or use."
  },
  {
    word: "arduous",
    simple: "hard",
    meaning: "Involving or requiring strenuous effort; difficult and tiring."
  },
  {
    word: "pragmatic",
    simple: "practical",
    meaning: "Dealing with problems in a sensible and practical way."
  },
  {
    word: "redundant",
    simple: "unneeded",
    meaning: "No longer needed or useful; superfluous."
  },
  {
    word: "resilient",
    simple: "tough",
    meaning: "Able to recover quickly from difficulties or setbacks."
  },

  // --- Nouns ---
  {
    word: "remuneration",
    simple: "payment",
    meaning: "Money paid for work done or a service provided."
  },
  {
    word: "vicinity",
    simple: "nearby area",
    meaning: "The area near or surrounding a particular place."
  },
  {
    word: "residence",
    simple: "home",
    meaning: "A person's home; the place where someone lives."
  },
  {
    word: "beverage",
    simple: "drink",
    meaning: "A drink of any type (juice, tea, coffee, etc.)."
  },
  {
    word: "altercation",
    simple: "argument",
    meaning: "A noisy, heated argument or disagreement."
  },
  {
    word: "conundrum",
    simple: "puzzle",
    meaning: "A confusing and difficult problem or question."
  },
  {
    word: "discrepancy",
    simple: "difference",
    meaning: "A lack of compatibility or similarity between two facts or numbers."
  },
  {
    word: "magnitude",
    simple: "size",
    meaning: "The great size, extent, or importance of something."
  },
  {
    word: "impediment",
    simple: "obstacle",
    meaning: "A hindrance or obstruction in doing something."
  },
  {
    word: "propensity",
    simple: "tendency",
    meaning: "A natural inclination or tendency to behave in a certain way."
  },
  {
    word: "adversary",
    simple: "opponent",
    meaning: "One's competitor, enemy, or opponent."
  },
  {
    word: "catastrophe",
    simple: "disaster",
    meaning: "An event causing great and often sudden damage or suffering."
  },
  {
    word: "dilemma",
    simple: "hard choice",
    meaning: "A situation where a difficult choice must be made between options."
  },
  {
    word: "hypothesis",
    simple: "theory",
    meaning: "A proposed explanation made as a starting point for investigation."
  },
  {
    word: "methodology",
    simple: "method",
    meaning: "A system of methods and rules used in a particular area."
  },
  {
    word: "surplus",
    simple: "extra amount",
    meaning: "An amount of something left over when needs are satisfied."
  },
  {
    word: "prerequisite",
    simple: "requirement",
    meaning: "Something required beforehand as a condition for something else."
  },
  {
    word: "objective",
    simple: "goal",
    meaning: "A specific aim or goal to be achieved."
  },
  {
    word: "objectives",
    simple: "goals",
    meaning: "Specific aims or goals to be achieved."
  },
  {
    word: "comprehension",
    simple: "understanding",
    meaning: "The ability to understand something."
  },
  {
    word: "compensation",
    simple: "payment",
    meaning: "Money given or received in payment for work or loss."
  }
];

// Sort dictionary: longest words/phrases first to prevent partial phrase matches
DICTIONARY.sort((a, b) => b.word.length - a.word.length);

// ============================================================================
// 2. DOM ELEMENTS
// ============================================================================
const inputText = document.getElementById("inputText");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const errorMessage = document.getElementById("errorMessage");
const simplifyBtn = document.getElementById("simplifyBtn");
const clearBtn = document.getElementById("clearBtn");

const resultsSection = document.getElementById("resultsSection");
const originalTextDisplay = document.getElementById("originalTextDisplay");
const simplifiedTextDisplay = document.getElementById("simplifiedTextDisplay");
const copyBtn = document.getElementById("copyBtn");
const copyText = document.getElementById("copyText");
const copyIcon = document.getElementById("copyIcon");
const wordsList = document.getElementById("wordsList");
const difficultWordsCount = document.getElementById("difficultWordsCount");

// ============================================================================
// 3. HELPER FUNCTIONS
// ============================================================================

/**
 * Escapes special regex characters in a string
 * @param {string} string
 * @returns {string}
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Preserves the casing pattern (ALL UPPERCASE, Title Case, or lowercase)
 * from the matched original word onto the replacement word.
 * @param {string} original - The original text from the user
 * @param {string} replacement - The simple replacement word
 * @returns {string}
 */
function matchCase(original, replacement) {
  if (!replacement) return "";

  // If original was ALL UPPERCASE and more than 1 character
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase();
  }

  // If original started with an Uppercase letter (Title Case)
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }

  // Default to lowercase
  return replacement.toLowerCase();
}

/**
 * Updates the character and word counts for the input textarea
 */
function updateCounts() {
  const text = inputText.value;
  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} character${chars === 1 ? "" : "s"}`;
  wordCount.textContent = `${words} word${words === 1 ? "" : "s"}`;
}

/**
 * Displays an error message to the user
 * @param {string} message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("visible");
}

/**
 * Clears any visible error message
 */
function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("visible");
}

// ============================================================================
// 4. CORE SIMPLIFICATION LOGIC
// ============================================================================

/**
 * Simplifies difficult text and collects difficult words with meanings
 * @param {string} rawText
 * @returns {{ simplifiedText: string, identifiedWords: Array }}
 */
function simplifyText(rawText) {
  let simplified = rawText;
  const identifiedWordsMap = new Map();

  DICTIONARY.forEach((entry) => {
    // Word boundary regex with case-insensitive flag
    const regex = new RegExp(`\\b${escapeRegex(entry.word)}\\b`, "gi");

    // Check if entry exists in current text
    const matches = rawText.match(regex);
    if (matches && matches.length > 0) {
      // Store the detected word for the explanations section
      const key = entry.word.toLowerCase();
      if (!identifiedWordsMap.has(key)) {
        // Use the first matched casing for display
        const sampleMatch = matches[0];
        identifiedWordsMap.set(key, {
          difficult: sampleMatch,
          simple: entry.simple,
          meaning: entry.meaning
        });
      }

      // Replace in the simplified text with case matching
      simplified = simplified.replace(regex, (match) => {
        return matchCase(match, entry.simple);
      });
    }
  });

  // Clean up any double spaces that might result from phrase replacements
  simplified = simplified.replace(/[ \t]+/g, " ");

  const identifiedWords = Array.from(identifiedWordsMap.values());
  return { simplifiedText: simplified, identifiedWords };
}

/**
 * Renders the difficult words section in the UI
 * @param {Array} words
 */
function renderDifficultWords(words) {
  wordsList.innerHTML = "";

  if (words.length === 0) {
    difficultWordsCount.textContent = "0 words";
    wordsList.innerHTML = `
      <div class="no-words-message">
        No difficult words were identified in your text. The text is already easy to understand!
      </div>
    `;
    return;
  }

  difficultWordsCount.textContent = `${words.length} word${words.length === 1 ? "" : "s"}`;

  words.forEach((item) => {
    const wordCard = document.createElement("div");
    wordCard.className = "word-item";

    wordCard.innerHTML = `
      <div class="word-header">
        <span class="difficult-tag">${escapeHTML(item.difficult)}</span>
        <span class="arrow-symbol">&rarr;</span>
        <span class="simple-tag">${escapeHTML(item.simple)}</span>
      </div>
      <p class="word-meaning">${escapeHTML(item.meaning)}</p>
    `;

    wordsList.appendChild(wordCard);
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================================
// 5. EVENT HANDLERS
// ============================================================================

/**
 * Handles the "Simplify Text" button click
 */
function handleSimplify() {
  const text = inputText.value.trim();

  // Validate input
  if (!text) {
    showError("Please enter some text in the box above before simplifying.");
    inputText.focus();
    return;
  }

  clearError();

  // Run simplification
  const { simplifiedText, identifiedWords } = simplifyText(inputText.value);

  // Show original text and simplified text separately
  originalTextDisplay.textContent = inputText.value;
  simplifiedTextDisplay.textContent = simplifiedText;

  // Render difficult words
  renderDifficultWords(identifiedWords);

  // Reveal results section
  resultsSection.classList.remove("hidden");

  // Scroll smoothly to results
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Handles the "Clear" button click
 */
function handleClear() {
  inputText.value = "";
  updateCounts();
  clearError();

  // Hide and reset results
  resultsSection.classList.add("hidden");
  originalTextDisplay.textContent = "";
  simplifiedTextDisplay.textContent = "";
  wordsList.innerHTML = "";
  difficultWordsCount.textContent = "0 words";

  // Reset copy button state if active
  resetCopyButton();

  // Set focus back on input
  inputText.focus();
}

/**
 * Copies the simplified text to user's clipboard
 */
async function handleCopy() {
  const textToCopy = simplifiedTextDisplay.textContent;
  if (!textToCopy) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // Fallback for older browsers or non-secure contexts
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = textToCopy;
      tempTextArea.style.position = "fixed";
      tempTextArea.style.left = "-999999px";
      tempTextArea.style.top = "-999999px";
      document.body.appendChild(tempTextArea);
      tempTextArea.focus();
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);
    }

    // Visual feedback for successful copy
    copyBtn.classList.add("copied");
    copyText.textContent = "Copied!";
    copyIcon.innerHTML = "&#10003;"; // Checkmark symbol

    setTimeout(resetCopyButton, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    copyText.textContent = "Error copying";
    setTimeout(resetCopyButton, 2000);
  }
}

/**
 * Resets the Copy Result button to its initial state
 */
function resetCopyButton() {
  copyBtn.classList.remove("copied");
  copyText.textContent = "Copy Result";
  copyIcon.innerHTML = "&#128203;"; // Clipboard symbol
}

// ============================================================================
// 6. INITIALIZATION & LISTENERS
// ============================================================================

// Live counter update and clearing errors on input
inputText.addEventListener("input", () => {
  updateCounts();
  if (inputText.value.trim().length > 0) {
    clearError();
  }
});

// Shortcut: Ctrl+Enter or Cmd+Enter to simplify
inputText.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    handleSimplify();
  }
});

// Button click listeners
simplifyBtn.addEventListener("click", handleSimplify);
clearBtn.addEventListener("click", handleClear);
copyBtn.addEventListener("click", handleCopy);

// Initialize counts on page load
updateCounts();
