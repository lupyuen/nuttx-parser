-- Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
-- Based on https://github.com/purescript-contrib/purescript-string-parsers/blob/main/test/Examples.purs

module Main where

import Prelude hiding (between)

import Data.Either (Either(..))
import Data.Int (fromStringAs, hexadecimal)
import Data.Maybe (Maybe(..), fromMaybe)
import Effect (Effect)
import Effect.Console (log, logShow)
import StringParser (Parser, regex, runParser, skipSpaces, string)

-- Main Function that will run our Test Code.
-- `Effect` says that it will do Side Effects (printing to console)
-- `Unit` means that no value will be returned
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
main :: Effect Unit
main = printResults

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

identifyAddress ∷ String → Maybe { mod ∷ String , type ∷ String }
identifyAddress _ = Just
  {
    mod: "aaaa"
  , type: "bbbb"
  }

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
    "stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"

  -- Parse the line of NuttX Stack Dump with Timestamp
  -- doRunParser "parseStackDump" parseStackDump
  --   "[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"

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
-- Given this line of NuttX Stack Dump: `stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
-- Result: { addr: "c02027e0", timestamp: "6.242000", v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000", v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
-- The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
parseStackDump ∷ Parser { addr ∷ String , v1 ∷ String , v2 ∷ String , v3 ∷ String , v4 ∷ String , v5 ∷ String , v6 ∷ String , v7 ∷ String , v8 ∷ String }
parseStackDump = do

  -- To parse the line: `stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`

  -- If the line begins with a Timestamp: `[    6.242000] `
  -- Skip `[    `
  -- `void` means ignore the Text Captured
  -- `$ something something` is shortcut for `( something something )`
  -- `<*` is the Delimiter between Patterns
  -- void $
  --   string "["    -- Match the string `[`
  --   <* skipSpaces -- Skip the following spaces
  --   <* regex "[.0-9]+" -- Skip the number
  --   <* string "]" -- Match the string `]`
  --   <* skipSpaces -- Skip the following spaces

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
    { addr
    , v1
    , v2
    , v3
    , v4
    , v5
    , v6
    , v7
    , v8
    }

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
