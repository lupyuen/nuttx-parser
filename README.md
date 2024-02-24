# Parsing Apache NuttX RTOS Logs with PureScript

In the Web Browser, we can get Real-Time Logs from NuttX Devices (Web Serial API) NuttX Emulator (Term.js)...

What if we could Analyse the NuttX Logs in Real-Time? And show the results in the Web Browser?

Like for [Stack Dumps](https://gist.github.com/lupyuen/a715e4e77c011d610d0b418e97f8bf5d#file-nuttx-tcc-app-log-L168-L224), [ELF Loader Log](https://gist.github.com/lupyuen/a715e4e77c011d610d0b418e97f8bf5d#file-nuttx-tcc-app-log-L1-L167), [Memory Manager Log](https://docs.google.com/spreadsheets/d/1g0-O2qdgjwNfSIxfayNzpUN8mmMyWFmRf2dMyQ9a8JI/edit#gid=0) (malloc / free)?

Let's do it with PureScript, since Functional Languages are better for Parsing Text.

And we'll support Online Scripting of our PureScript for Log Parsing, similar to [try.purescript.org](https://try.purescript.org/)

# Run parseCSV in Node.js

Let's run parseCSV in [src/Main.purs](src/Main.purs). Normally we run PureScript like this...

```bash
spago run
```

This is how we run it in Node.js...

```bash
$ spago build
$ node .spago/run.js

### Example Content 1 ###
(runParser) Parsing content with 'fail'
{ error: "example failure message", pos: 0 }
-----
(unParser) Parsing content with 'fail'
Position: 0
Error: "example failure message"
-----
(runParser) Parsing content with 'numberOfAs'
Result was: 6
-----
(unParser) Parsing content with 'numberOfAs'
Result was: 6
Suffix was: { position: 59, substring: "" }
-----
(runParser) Parsing content with 'removePunctuation'
Result was: "How many as are in this sentence you ask Not that many"
-----
(unParser) Parsing content with 'removePunctuation'
Result was: "How many as are in this sentence you ask Not that many"
Suffix was: { position: 59, substring: "" }
-----
(runParser) Parsing content with 'replaceVowelsWithUnderscore'
Result was: "H_w m_ny '_'s _r_ _n th_s s_nt_nc_, y__ _sk? N_t th_t m_ny."
-----
(unParser) Parsing content with 'replaceVowelsWithUnderscore'
Result was: "H_w m_ny '_'s _r_ _n th_s s_nt_nc_, y__ _sk? N_t th_t m_ny."
Suffix was: { position: 59, substring: "" }
-----
(runParser) Parsing content with 'tokenizeContentBySpaceChars'
Result was: (NonEmptyList (NonEmpty "How" ("many" : "'a's" : "are" : "in" : "this" : "sentence," : "you" : "ask?" : "Not" : "that" : "many." : Nil)))
-----
(unParser) Parsing content with 'tokenizeContentBySpaceChars'
Result was: (NonEmptyList (NonEmpty "How" ("many" : "'a's" : "are" : "in" : "this" : "sentence," : "you" : "ask?" : "Not" : "that" : "many." : Nil)))
Suffix was: { position: 59, substring: "" }
-----
(runParser) Parsing content with 'extractWords'
Result was: (NonEmptyList (NonEmpty "How" ("many" : "a" : "s" : "are" : "in" : "this" : "sentence" : "you" : "ask" : "Not" : "that" : "many" : Nil)))
-----
(unParser) Parsing content with 'extractWords'
Result was: (NonEmptyList (NonEmpty "How" ("many" : "a" : "s" : "are" : "in" : "this" : "sentence" : "you" : "ask" : "Not" : "that" : "many" : Nil)))
Suffix was: { position: 59, substring: "" }
-----
(runParser) Parsing content with 'badExtractWords'
{ error: "Could not find a character that separated the content...", pos: 43 }
-----
(unParser) Parsing content with 'badExtractWords'
Position: 43
Error: "Could not find a character that separated the content..."
-----
(runParser) Parsing content with 'quotedLetterExists'
Result was: true
-----
(unParser) Parsing content with 'quotedLetterExists'
Result was: true
Suffix was: { position: 59, substring: "" }
-----

### Example Content 2 ###
(runParser) Parsing content with 'parseCSV'
Result was: { age: "24", firstName: "Mark", idNumber: "523", lastName: "Kenderson", modifiedEmail: "mynameismark@mark.mark.com", originalEmail: "my.name.is.mark@mark.mark.com" }
-----
(unParser) Parsing content with 'parseCSV'
Result was: { age: "24", firstName: "Mark", idNumber: "523", lastName: "Kenderson", modifiedEmail: "mynameismark@mark.mark.com", originalEmail: "my.name.is.mark@mark.mark.com" }
Suffix was: { position: 110, substring: "" }
-----
```

# Run parseCSV in Web Browser

Here's how we run [parseCSV](src/Main.purs) in the Web Browser: [test.html](test.html)

```javascript
  // Import Main Module
  import { main, doBoth, doRunParser, parseCSV, exampleContent2 } from './output/Main/index.js';
  import * as StringParser_Parser from "./output/StringParser.Parser/index.js";

  // Run parseCSV
  const result = StringParser_Parser
    .runParser
    (parseCSV)
    (exampleContent2)
    ;
  console.log({result});
```

Output:

```json
{
    "result": {
        "value0": {
            "idNumber": "523",
            "firstName": "Mark",
            "lastName": "Kenderson",
            "age": "24",
            "originalEmail": "my.name.is.mark@mark.mark.com",
            "modifiedEmail": "mynameismark@mark.mark.com"
        }
    }
}
```

TODO: Change `exampleContent2` to parse our [NuttX Log](https://gist.github.com/lupyuen/a715e4e77c011d610d0b418e97f8bf5d)

We expose the PureScript Functions in the Web Browser: [test.html](test.html)

```javascript
// Import Main Module
import { main, doBoth, doRunParser, parseCSV, exampleContent2 } from './output/Main/index.js';
import * as StringParser_Parser from "./output/StringParser.Parser/index.js";

// For Testing: Export the PureScript Functions
window.main = main;
window.doBoth = doBoth;
window.doRunParser = doRunParser;
window.parseCSV = parseCSV;
window.exampleContent2 = exampleContent2;
window.StringParser_Parser = StringParser_Parser;
```

So we can run experiments in the JavaScript Console...

```javascript
// Run parseCSV in JavaScript Console
window.StringParser_Parser
  .runParser
  (window.parseCSV)
  (window.exampleContent2)
```

# Run parseCSV in try.purescript.org

To run parseCSV at [try.purescript.org](https://try.purescript.org/), change...

```purescript
main :: Effect Unit
main = printResults
```

To this...

```purescript
import TryPureScript (render, withConsole)

main :: Effect Unit
main = render =<< withConsole do
  printResults
```

# Parse NuttX Stack Dump with PureScript

Let's parse the [NuttX Stack Dump](https://gist.github.com/lupyuen/a715e4e77c011d610d0b418e97f8bf5d#file-nuttx-tcc-app-log-L168-L224)...

```text
[    6.242000] riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a
[    6.242000] riscv_exception: PANIC!!! Exception = 000000000000000c
[    6.242000] _assert: Current Version: NuttX  12.4.0 f8b0b06b978 Jan 29 2024 01:16:20 risc-v
[    6.242000] _assert: Assertion failed panic: at file: common/riscv_exception.c:85 task: /system/bin/init process: /system/bin/init 0xc000001a
[    6.242000] up_dump_register: EPC: 000000008000ad8a
[    6.242000] up_dump_register: A0: 0000000000000000 A1: 00000000c0202010 A2: 0000000000000001 A3: 00000000c0202010
[    6.242000] up_dump_register: A4: 00000000c0000000 A5: 0000000000000000 A6: 0000000000000000 A7: 0000000000000000
[    6.242000] up_dump_register: T0: 0000000000000000 T1: 0000000000000000 T2: 0000000000000000 T3: 0000000000000000
[    6.242000] up_dump_register: T4: 0000000000000000 T5: 0000000000000000 T6: 0000000000000000
[    6.242000] up_dump_register: S0: 0000000000000000 S1: 0000000000000000 S2: 0000000000000000 S3: 0000000000000000
[    6.242000] up_dump_register: S4: 0000000000000000 S5: 0000000000000000 S6: 0000000000000000 S7: 0000000000000000
[    6.242000] up_dump_register: S8: 0000000000000000 S9: 0000000000000000 S10: 0000000000000000 S11: 0000000000000000
[    6.242000] up_dump_register: SP: 00000000c0202800 FP: 0000000000000000 TP: 0000000000000000 RA: 000000008000ad8a
[    6.242000] dump_stack: User Stack:
[    6.242000] dump_stack:   base: 0xc0202040
[    6.242000] dump_stack:   size: 00003008
[    6.242000] dump_stack:     sp: 0xc0202800
[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000
[    6.242000] stack_dump: 0xc0202800: 00000000 00000000 0007e7f0 00000000 c0200208 00000000 c02001e8 00000000
```

Let's try this single line...

```text
[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000
```

Here's our parser in PureScript: [src/Main.purs](src/Main.purs)

```purescript
-- Parse the NuttX Stack Dump
printResults :: Effect Unit
printResults = do
  doRunParser "parseStackDump" parseStackDump
    "[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"

-- Parse a line of NuttX Stack Dump
-- Result: { addr: "c02027e0", timestamp: "6.242000", v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000", v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
-- The next line declares the Type. We can actually erase it, VS Code PureScript Extension will helpfully suggest it for us.
parseStackDump ∷ Parser { addr ∷ String , timestamp ∷ String , v1 ∷ String , v2 ∷ String , v3 ∷ String , v4 ∷ String , v5 ∷ String , v6 ∷ String , v7 ∷ String , v8 ∷ String }
parseStackDump = do

  -- To parse the line: `[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
  -- Skip `[    `
  -- `void` means ignore the Text Captured
  -- `$ something something` is shortcut for `( something something )`
  -- `<*` is the Delimiter between Patterns
  void $
    string "["    -- Match the string `[`
    <* skipSpaces -- Skip the following spaces

  -- `timestamp` becomes `6.242000`
  -- `<*` says when we should stop the Text Capture
  timestamp <-
    regex "[.0-9]+" 
    <* string "]" 
    <* skipSpaces

  -- Skip `stack_dump: `
  -- `void` means ignore the Text Captured
  -- `$ something something` is shortcut for `( something something )`
  -- `<*` is the Delimiter between Patterns
  void $ string "stack_dump:" <* skipSpaces

  -- `addr` becomes `c02027e0`
  void $ string "0x"
  addr <- regex "[0-9a-f]+" <* string ":" <* skipSpaces

  -- `v1` becomes `c0202010`
  -- `v2` becomes `00000000` and so on
  v1 <- regex "[0-9a-f]+" <* skipSpaces
  v2 <- regex "[0-9a-f]+" <* skipSpaces
  v3 <- regex "[0-9a-f]+" <* skipSpaces
  v4 <- regex "[0-9a-f]+" <* skipSpaces
  v5 <- regex "[0-9a-f]+" <* skipSpaces
  v6 <- regex "[0-9a-f]+" <* skipSpaces
  v7 <- regex "[0-9a-f]+" <* skipSpaces
  v8 <- regex "[0-9a-f]+" <* skipSpaces

  -- Return the parsed content
  -- `pure` because we're in a `do` block that allows Effects
  pure
    { timestamp
    , addr
    , v1
    , v2
    , v3
    , v4
    , v5
    , v6
    , v7
    , v8
    }
```

Result of parsing...

```bash
## We're parsing: [    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000
$ spago run
[info] Build succeeded.
(runParser) Parsing content with 'parseStackDump'
Result: {
  addr: "c02027e0", timestamp: "6.242000",
  v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000",
  v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
```

Not that hard! We could have refactored the code to make it shorter. But we'll keep it long because it's easier to read.

Works OK in JavaScript too: [test.html](test.html)

```javascript
// Run parseStackDump
const stackDump = `[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`;
const result = StringParser_Parser
  .runParser
  (parseStackDump)
  (stackDump)
  ;
console.log({result});
```

Shows...

```json
{
    "result": {
        "value0": {
            "timestamp": "6.242000",
            "addr": "c02027e0",
            "v1": "c0202010",
            "v2": "00000000",
            "v3": "00000001",
            "v4": "00000000",
            "v5": "00000000",
            "v6": "00000000",
            "v7": "8000ad8a",
            "v8": "00000000"
        }
    }
}
```

_What if the parsing fails?_

We'll see `result.error`...

```json
{
    "result": {
        "value0": {
            "pos": 0,
            "error": "Expected '['."
        }
    }
}
```

So we can run `parseStackDump` on every line of NuttX Log. And skip the lines with `result.error`

TODO: Spot interesting addresses like 8000ad8a, c0202010

# Compile PureScript to JavaScript in Web Browser

Here's how we compile PureScript to JavaScript inside our Web Browser...

https://github.com/lupyuen/nuttx-tinyemu/blob/fc22c9fba2d6fbc4faf8c1fb02f4761952cb66cd/docs/blockly/jslinux.js#L755-L804

```javascript
// Compile PureScript to JavaScript
// Maybe we'll run a PureScript to analyse the Real-Time Logs from a NuttX Device?
// https://lupyuen.github.io/nuttx-tinyemu/blockly/
async function compile_purescript() {

    // Public Server API that compiles PureScript to JavaScript
    // https://github.com/purescript/trypurescript#server-api
    const url = "https://compile.purescript.org/compile";
    const contentType = "text/plain;charset=UTF-8";

    // PureScript to be compiled to JavaScript
    const body =
`
module Main where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import Data.Array ((..))
import Data.Foldable (for_)
import TryPureScript (render, withConsole)

main :: Effect Unit
main = render =<< withConsole do
  for_ (10 .. 1) \\n -> log (show n <> "...")
  log "Lift off!"
`;

    // Call Public Server API to compile our PureScript to JavaScript
    // Default options are marked with *
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: { "Content-Type": contentType },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: body,
    });

    // Print the response
    // { "js": "import * as Control_Bind from \"../Control.Bind/index.js\";\nimport * as Data_Array from \"../Data.Array/index.js\";\nimport * as Data_Foldable from \"../Data.Foldable/index.js\";\nimport * as Data_Show from \"../Data.Show/index.js\";\nimport * as Effect from \"../Effect/index.js\";\nimport * as Effect_Console from \"../Effect.Console/index.js\";\nimport * as TryPureScript from \"../TryPureScript/index.js\";\nvar show = /* #__PURE__ */ Data_Show.show(Data_Show.showInt);\nvar main = /* #__PURE__ */ Control_Bind.bindFlipped(Effect.bindEffect)(TryPureScript.render)(/* #__PURE__ */ TryPureScript.withConsole(function __do() {\n    Data_Foldable.for_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Array.range(10)(1))(function (n) {\n        return Effect_Console.log(show(n) + \"...\");\n    })();\n    return Effect_Console.log(\"Lift off!\")();\n}));\nexport {\n    main\n};",
    //   "warnings": [] }
    console.log(await response.json());
}
```

The JSON Response looks like this...

```text
{
  "js": "
    import * as Control_Bind from "../Control.Bind/index.js";
    import * as Data_Array from "../Data.Array/index.js";
    import * as Data_Foldable from "../Data.Foldable/index.js";
    import * as Data_Show from "../Data.Show/index.js";
    import * as Effect from "../Effect/index.js";
    import * as Effect_Console from "../Effect.Console/index.js";
    import * as TryPureScript from "../TryPureScript/index.js";
    var show = /* #__PURE__ */ Data_Show.show(Data_Show.showInt);
    var main = /* #__PURE__ */ Control_Bind.bindFlipped(Effect.bindEffect)(TryPureScript.render)(/* #__PURE__ */ TryPureScript.withConsole(function __do() {
          Data_Foldable.for_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Array.range(10)(1))(function (n) {
              return Effect_Console.log(show(n) + "...");
        })();
        return Effect_Console.log("Lift off!")();
    }));
    export {
          main
    };
  ",
  "warnings": []
}
```

# Parse NuttX Exception with PureScript

Let's parse the [NuttX Exception](https://gist.github.com/lupyuen/a715e4e77c011d610d0b418e97f8bf5d#file-nuttx-tcc-app-log-L168-L224)...

```text
[    6.242000] riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a
[    6.242000] riscv_exception: PANIC!!! Exception = 000000000000000c
[    6.242000] _assert: Current Version: NuttX  12.4.0 f8b0b06b978 Jan 29 2024 01:16:20 risc-v
[    6.242000] _assert: Assertion failed panic: at file: common/riscv_exception.c:85 task: /system/bin/init process: /system/bin/init 0xc000001a
```

And explain in friendly words what this means: "NuttX crashed because it tried to read or write an Invalid Address. The Invalid Address is 8000ad8a. The code that caused this is at 8000ad8a. Check the NuttX Disassembly for the Source Code of the crashing line."

TODO
