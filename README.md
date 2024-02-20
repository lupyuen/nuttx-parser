# Parsing Apache NuttX RTOS Logs with PureScript

TODO

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

# TODO

Test in HTML: [test.html](test.html)

```bash
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
