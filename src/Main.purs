-- Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
-- Based on https://github.com/purescript-contrib/purescript-string-parsers/blob/main/test/Examples.purs

module Main where

import Prelude hiding (between)

import Control.Alt ((<|>))
import Data.Either (Either(..))
import Data.Foldable (fold, foldl, sum)
import Data.Int (fromStringAs, hexadecimal)
import Data.List.Types (NonEmptyList)
import Data.Maybe (fromMaybe)
import Effect (Effect)
import Effect.Console (log, logShow)
import StringParser (Parser, anyChar, between, char, endBy1, eof, fail, lookAhead, many, many1, regex, runParser, sepBy1, skipSpaces, string, unParser, (<?>))

-- Main Function that will run our Test Code.
-- `Effect` says that it will do Side Effects (printing to console)
-- `Unit` means that no value will be returned
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
main :: Effect Unit
main = printResults

-- Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
-- `Effect` says that it will do Side Effects (printing to console)
-- `Unit` means that no value will be returned
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
printResults :: Effect Unit
printResults = do

  -- Explain the NuttX Exception.
  -- `$ something something` is shortcut for `( something something )`
  log $ explainException 12 "epc" "mtval"
  log $ explainException 13 "epc" "mtval"
  log $ explainException 0 "epc" "mtval"

  -- Parse the NuttX Exception
  doRunParser "parseException" parseException
    "riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a"

  -- Parse the line of NuttX Stack Dump
  doRunParser "parseStackDump" parseStackDump
    "[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"

-- Given this NuttX Exception: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
-- Explain in friendly words: "NuttX stopped because it tried to read or write an Invalid Address. The Invalid Address is 8000ad8a. The code that caused this is at 8000ad8a. Check the NuttX Disassembly for the Source Code of the crashing line."
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
explainException ∷ Int → String → String → String

-- Explain the NuttX Exception with mcause 12
explainException 12 epc mtval =
  "Instruction Page Fault at " <> epc <> ", " <> mtval

-- Explain the NuttX Exception with mcause 13
explainException 13 epc mtval =
  "Load Page Fault at " <> epc <> ", " <> mtval

-- Explain the Other NuttX Exceptions, that are not matched with the above
explainException mcause epc mtval =
  "Unknown Exception: mcause=" <> show mcause <> ", epc=" <> epc <> ", mtval=" <> mtval

-- Parse the NuttX Exception.
-- Given this NuttX Exception: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
-- Result: { epc: "000000008000ad8a", exception: "Instruction page fault", mcause: 12, mtval: "000000008000ad8a" }
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
parseException ∷ Parser { exception ∷ String, mcause :: Int, epc :: String, mtval :: String }
parseException = do

  -- To parse the line: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
  -- Skip `riscv_exception: EXCEPTION: `
  -- `void` means ignore the Text Captured
  -- `$ something something` is shortcut for `( something something )`
  -- `<*` is the Delimiter between Patterns
  void $
    string "riscv_exception:" -- Match the string `riscv_exception:`
    <* skipSpaces             -- Skip the following spaces
    <* string "EXCEPTION:"    -- Match the string `EXCEPTION:`
    <* skipSpaces             -- Skip the following spaces

  -- `exception` becomes `Instruction page fault`
  -- `<*` says when we should stop the Text Capture
  exception <- regex "[^.]+" 
    <* string "." 
    <* skipSpaces 

  -- Skip `MCAUSE: `
  -- `void` means ignore the Text Captured
  -- `$ something something` is shortcut for `( something something )`
  -- `<*` is the Delimiter between Patterns
  void $ string "MCAUSE:" <* skipSpaces

  -- `mcauseStr` becomes `000000000000000c`
  -- We'll convert to integer later
  mcauseStr <- regex "[0-9a-f]+" <* string "," <* skipSpaces

  -- Skip `EPC: `
  -- `epc` becomes `000000008000ad8a`
  void $ string "EPC:" <* skipSpaces
  epc <- regex "[0-9a-f]+" <* string "," <* skipSpaces

  -- Skip `MTVAL: `
  -- `mtval` becomes `000000008000ad8a`
  void $ string "MTVAL:" <* skipSpaces
  mtval <- regex "[0-9a-f]+"

  -- Return the parsed content
  -- `pure` because we're in a `do` block that allows (Side) Effects
  pure 
    {
      exception
    , mcause: -1 `fromMaybe`               -- If `mcauseStr` is not a valid hex, return -1
        fromStringAs hexadecimal mcauseStr -- Else return the hex value of `mcauseStr`
    , epc
    , mtval
    }

-- Parse a line of NuttX Stack Dump.
-- Given this line of NuttX Stack Dump: `[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
-- Result: { addr: "c02027e0", timestamp: "6.242000", v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000", v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
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
  -- `pure` because we're in a `do` block that allows (Side) Effects
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

-- Previously:
-- printResults :: Effect Unit
-- printResults = do
--   log "" -- empty blank line to separate output from function call

--   -- Parse the NuttX Stack Dump
--   doRunParser "parseStackDump" parseStackDump "[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"

  -- log "### Example Content 1 ###"
  -- doBoth "fail" ((fail "example failure message") :: Parser Unit) exampleContent1
  -- doBoth "numberOfAs" numberOfAs exampleContent1
  -- doBoth "removePunctuation" removePunctuation exampleContent1
  -- doBoth "replaceVowelsWithUnderscore" replaceVowelsWithUnderscore exampleContent1
  -- doBoth "tokenizeContentBySpaceChars" tokenizeContentBySpaceChars exampleContent1
  -- doBoth "extractWords" extractWords exampleContent1
  -- doBoth "badExtractWords" badExtractWords exampleContent1
  -- doBoth "quotedLetterExists" quotedLetterExists exampleContent1

  -- log
  --   "\n\
  --   \### Example Content 2 ###"
  -- doBoth "parseCSV" parseCSV exampleContent2

-- Example Content 1

exampleContent1 :: String
exampleContent1 =
  "How many 'a's are in this sentence, you ask? Not that many."

numberOfAs :: Parser Int
numberOfAs = do
  {-
  let
    oneIfA = 1 <$ string "a" <?> "Letter was 'a'"
    zeroIfNotA = 0 <$ regex "[^a]" <?> "Letter was not 'a'"
    letterIsOneOrZero = oneIfA <|> zeroIfNotA <?>
                            "The impossible happened: \
                            \a letter was not 'a', and was not not-'a'."
    convertLettersToList = many1 letterIsOneOrZero
  list <- convertLettersToList                                          -}
  list <- many1
    ( (1 <$ string "a")
        <|> (0 <$ regex "[^a]")
    )
  -- calculate total number by adding Ints in list together
  pure $ sum list

removePunctuation :: Parser String
removePunctuation =
  do {-
  let
    charsAndSpaces = regex "[a-zA-Z ]+"
    everythingElse = regex "[^a-zA-Z ]+"
    ignoreEverythingElse = "" <$ everythingElse
    zeroOrMoreFragments = many1 $ charsAndSpaces <|> ignoreEverythingElse   -}
    list <- many1
      ( regex "[a-zA-Z ]+"
          <|> ("" <$ regex "[^a-zA-Z ]+")
      )

    -- combine the list's contents together via '<>'
    pure $ foldl (<>) "" list

replaceVowelsWithUnderscore :: Parser String
replaceVowelsWithUnderscore = do
  list <- many1 $
    ( ("_" <$ regex "[aeiou]")
        <|> regex "[^aeiou]+"
    )

  pure $ foldl (<>) "" list

tokenizeContentBySpaceChars :: Parser (NonEmptyList String)
tokenizeContentBySpaceChars = do
  (regex "[^ ]+") `sepBy1` (string " ")

extractWords :: Parser (NonEmptyList String)
extractWords = do
  endBy1 (regex "[a-zA-Z]+")
    -- try commenting out one of the "<|> string ..." lines and see what happens
    ( many1
        ( string " " <?> "Failed to match space as a separator"
            <|> string "'"
              <?> "Failed to match single-quote char as a separator"
            <|> string ","
              <?> "Failed to match comma as a separator"
            <|> string "?"
              <?> "Failed to match question mark as a separator"
            <|> string "."
              <?> "Failed to match period as a separator"
              <?> "Could not find a character that separated the content..."
        )
    )

badExtractWords :: Parser (NonEmptyList String)
badExtractWords = do
  list <- endBy1 (regex "[a-zA-Z]+")
    -- try commenting out the below "<|> string ..." lines
    ( many1
        ( string " " <?> "Failed to match space as a separator"
            <|> string "'"
              <?> "Failed to match single-quote char as a separator"
            <|> string ","
              <?> "Failed to match comma as a separator"
              -- <|> string "?" <?> "Failed to match question mark as a separator"
              -- <|> string "." <?> "Failed to match period as a separator"
              <?> "Could not find a character that separated the content..."
        )
    )
  -- short for 'end of file' or 'end of content'
  eof <?> "Entire content should have been parsed but wasn't."
  pure list

-- there are better ways of doing this using `whileM`, but this explains
-- the basic idea:
quotedLetterExists :: Parser Boolean
quotedLetterExists = do
  let
    singleQuoteChar = string "'"
    betweenSingleQuotes parser =
      between singleQuoteChar singleQuoteChar parser

  list <- many
    ( true <$ (betweenSingleQuotes (char 'a') <?> "No 'a' found.")
        <|> false <$ anyChar
    )
  pure $ foldl (||) false list

-- Example Content 2

-- CSV sample with some inconsistent spacing
exampleContent2 :: String
exampleContent2 =
  "ID, FirstName, LastName,             Age, Email\n\
  \523,     Mark,   Kenderson, 24, my.name.is.mark@mark.mark.com\n"

type CsvContent =
  { idNumber :: String
  , firstName :: String
  , lastName :: String
  , age :: String
  , originalEmail :: String
  , modifiedEmail :: String
  }

parseCSV :: Parser CsvContent
parseCSV = do
  let
    commaThenSpaces = string "," *> skipSpaces
    idNumber_ = string "ID"
    firstName_ = string "FirstName"
    lastName_ = string "LastName"
    age_ = string "Age"
    email_ = string "Email"
    newline = string "\n"
    csvColumn = regex "[^,]+"

  -- parse headers but don't produce output
  void $ idNumber_ *> commaThenSpaces
    *> firstName_
    *> commaThenSpaces
    *> lastName_
    *> commaThenSpaces
    *> age_
    *> commaThenSpaces
    *>
      email_

  void newline

  -- now we're on line 2
  idNumber <- csvColumn <* commaThenSpaces
  firstName <- csvColumn <* commaThenSpaces
  lastName <- csvColumn <* commaThenSpaces
  age <- csvColumn <* commaThenSpaces

  -- lookAhead will parse the content ahead of us,
  -- then reset the position of the string
  -- to what it was before it.
  originalEmail <- lookAhead $ regex "[^\n]+"

  let
    parseAlphanumericChars = regex "[a-zA-Z0-9]+"
    parsePeriodsAndPlusesAsEmptyStrings =
      "" <$ ((string ".") <|> (string "+"))
    parseListOfParts =
      many1
        ( parseAlphanumericChars
            <|> parsePeriodsAndPlusesAsEmptyStrings
        )

  usernameWithoutPeriodsOrPluses <- fold <$> parseListOfParts
  void $ string "@"
  domainName <- fold <$> (many1 ((regex "[a-zA-Z0-9]+") <|> (string ".")))
  void $ string "\n"

  -- Ensure we hit the end of the string content via 'end-of-file'
  void eof

  -- now return the parsed content
  pure
    { idNumber
    , firstName
    , lastName
    , age
    , originalEmail
    , modifiedEmail: usernameWithoutPeriodsOrPluses <> "@" <> domainName
    }

-- Helper functions

doBoth :: forall a. Show a => String -> Parser a -> String -> Effect Unit
doBoth parserName parser content = do
  doRunParser parserName parser content
  doUnParser parserName parser content

-- | Shows the results of calling `unParser`. You typically want to use
-- | this function when writing a parser because it includes other info
-- | to help you debug your code.
doUnParser :: forall a. Show a => String -> Parser a -> String -> Effect Unit
doUnParser parserName parser content = do
  log $ "(unParser) Parsing content with '" <> parserName <> "'"
  case unParser parser { substring: content, position: 0 } of
    Left rec -> log $ "Position: " <> show rec.pos
      <>
        "\n\
        \Error: "
      <> show rec.error
    Right rec -> log $ "Result: " <> show rec.result
      <>
        "\n\
        \Suffix was: "
      <> show rec.suffix
  log "-----"

-- | Shows the results of calling `runParser`. You typically don't want to use
-- | this function when writing a parser because it doesn't help you debug
-- | your code when you write it incorrectly.
doRunParser :: forall a. Show a => String -> Parser a -> String -> Effect Unit
doRunParser parserName parser content = do
  log $ "(runParser) Parsing content with '" <> parserName <> "'"
  case runParser parser content of
    Left error -> logShow error
    Right result -> log $ "Result: " <> show result
  log "-----"
