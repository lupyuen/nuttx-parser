# Parsing Apache NuttX RTOS Logs with PureScript

TODO

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
