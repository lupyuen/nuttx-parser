#!/usr/bin/env bash

set -e  #  Exit when any command fails
set -x  #  Echo commands

## Run our PureScript
spago run

## Change:
##   import { main, doBoth, doRunParser, parseCSV, exampleContent2, parseException, parseStackDump, explainException } from './output/Main/index.js';
## To:
##   import { main, doBoth, doRunParser, parseCSV, exampleContent2, parseException, parseStackDump, explainException } from './index.js';
## Change:
##   import * as StringParser_Parser from "./output/StringParser.Parser/index.js";
## To:
##   import * as StringParser_Parser from "https://compile.purescript.org/output/StringParser.Parser/index.js";
cat index.html \
  | sed 's/output\/Main\///' \
  | sed 's/.\/output\//https:\/\/compile.purescript.org\/output\//' \
  >docs/index.html

## Change:
##   import * as Control_Alt from "../Control.Alt/index.js";
## To:
##   import * as Control_Alt from "https://compile.purescript.org/output/Control.Alt/index.js";
cat output/Main/index.js \
  | sed 's/from \"../from \"https:\/\/compile.purescript.org\/output/' \
  >docs/index.js
