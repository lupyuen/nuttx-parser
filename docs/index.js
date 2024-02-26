// Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
// Based on https://github.com/purescript-contrib/purescript-string-parsers/blob/main/test/Examples.purs
import * as Control_Alt from "https://compile.purescript.org/output/Control.Alt/index.js";
import * as Control_Applicative from "https://compile.purescript.org/output/Control.Applicative/index.js";
import * as Control_Apply from "https://compile.purescript.org/output/Control.Apply/index.js";
import * as Control_Bind from "https://compile.purescript.org/output/Control.Bind/index.js";
import * as Data_Either from "https://compile.purescript.org/output/Data.Either/index.js";
import * as Data_Foldable from "https://compile.purescript.org/output/Data.Foldable/index.js";
import * as Data_Functor from "https://compile.purescript.org/output/Data.Functor/index.js";
import * as Data_HeytingAlgebra from "https://compile.purescript.org/output/Data.HeytingAlgebra/index.js";
import * as Data_Int from "https://compile.purescript.org/output/Data.Int/index.js";
import * as Data_List_Types from "https://compile.purescript.org/output/Data.List.Types/index.js";
import * as Data_Maybe from "https://compile.purescript.org/output/Data.Maybe/index.js";
import * as Data_Monoid from "https://compile.purescript.org/output/Data.Monoid/index.js";
import * as Data_Semigroup from "https://compile.purescript.org/output/Data.Semigroup/index.js";
import * as Data_Semiring from "https://compile.purescript.org/output/Data.Semiring/index.js";
import * as Data_Show from "https://compile.purescript.org/output/Data.Show/index.js";
import * as Effect_Console from "https://compile.purescript.org/output/Effect.Console/index.js";
import * as StringParser_CodePoints from "https://compile.purescript.org/output/StringParser.CodePoints/index.js";
import * as StringParser_Combinators from "https://compile.purescript.org/output/StringParser.Combinators/index.js";
import * as StringParser_Parser from "https://compile.purescript.org/output/StringParser.Parser/index.js";
var bind = /* #__PURE__ */ Control_Bind.bind(StringParser_Parser.bindParser);
var alt = /* #__PURE__ */ Control_Alt.alt(StringParser_Parser.altParser);
var voidRight = /* #__PURE__ */ Data_Functor.voidRight(StringParser_Parser.functorParser);
var pure = /* #__PURE__ */ Control_Applicative.pure(StringParser_Parser.applicativeParser);
var foldl = /* #__PURE__ */ Data_Foldable.foldl(Data_List_Types.foldableNonEmptyList);
var append = /* #__PURE__ */ Data_Semigroup.append(Data_Semigroup.semigroupString);
var foldl1 = /* #__PURE__ */ Data_Foldable.foldl(Data_List_Types.foldableList);
var disj = /* #__PURE__ */ Data_HeytingAlgebra.disj(Data_HeytingAlgebra.heytingAlgebraBoolean);
var discard = /* #__PURE__ */ Control_Bind.discard(Control_Bind.discardUnit);
var discard1 = /* #__PURE__ */ discard(StringParser_Parser.bindParser);

// To parse the line: `[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
// Skip `[    `
// `void` means ignore the Text Captured
// `$ something something` is shortcut for `( something something )`
// `<*` is the Delimiter between Patterns
var $$void = /* #__PURE__ */ Data_Functor["void"](StringParser_Parser.functorParser);
var applyFirst = /* #__PURE__ */ Control_Apply.applyFirst(StringParser_Parser.applyParser);
var applySecond = /* #__PURE__ */ Control_Apply.applySecond(StringParser_Parser.applyParser);
var map = /* #__PURE__ */ Data_Functor.map(StringParser_Parser.functorParser);
var fold = /* #__PURE__ */ Data_Foldable.fold(Data_List_Types.foldableNonEmptyList)(Data_Monoid.monoidString);
var sum = /* #__PURE__ */ Data_Foldable.sum(Data_List_Types.foldableNonEmptyList)(Data_Semiring.semiringInt);
var show = /* #__PURE__ */ Data_Show.show(Data_Show.showInt);
var show1 = /* #__PURE__ */ Data_Show.show(Data_Show.showString);
var showRecord = /* #__PURE__ */ Data_Show.showRecord()();
var show2 = /* #__PURE__ */ Data_Show.show(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "position";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "substring";
    }
})(Data_Show.showString))(Data_Show.showInt)));
var logShow = /* #__PURE__ */ Effect_Console.logShow(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "error";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "pos";
    }
})(Data_Show.showInt))(Data_Show.showString)));
var tokenizeContentBySpaceChars = /* #__PURE__ */ StringParser_Combinators.sepBy1(/* #__PURE__ */ StringParser_CodePoints.regex("[^ ]+"))(/* #__PURE__ */ StringParser_CodePoints.string(" "));
var replaceVowelsWithUnderscore = /* #__PURE__ */ bind(/* #__PURE__ */ StringParser_Combinators.many1(/* #__PURE__ */ alt(/* #__PURE__ */ voidRight("_")(/* #__PURE__ */ StringParser_CodePoints.regex("[aeiou]")))(/* #__PURE__ */ StringParser_CodePoints.regex("[^aeiou]+"))))(function (list) {
    return pure(foldl(append)("")(list));
});
var removePunctuation = /* #__PURE__ */ bind(/* #__PURE__ */ StringParser_Combinators.many1(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_CodePoints.regex("[a-zA-Z ]+"))(/* #__PURE__ */ voidRight("")(/* #__PURE__ */ StringParser_CodePoints.regex("[^a-zA-Z ]+")))))(function (list) {
    return pure(foldl(append)("")(list));
});

// there are better ways of doing this using `whileM`, but this explains
// the basic idea:
var quotedLetterExists = /* #__PURE__ */ (function () {
    var singleQuoteChar = StringParser_CodePoints.string("'");
    var betweenSingleQuotes = function (parser) {
        return StringParser_Combinators.between(singleQuoteChar)(singleQuoteChar)(parser);
    };
    return bind(StringParser_Combinators.many(alt(voidRight(true)(StringParser_Combinators.withError(betweenSingleQuotes(StringParser_CodePoints["char"]("a")))("No 'a' found.")))(voidRight(false)(StringParser_CodePoints.anyChar))))(function (list) {
        return pure(foldl1(disj)(false)(list));
    });
})();

// Parse a line of NuttX Stack Dump.
// Given this line of NuttX Stack Dump: `[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
// Result: { addr: "c02027e0", timestamp: "6.242000", v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000", v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var parseStackDump = /* #__PURE__ */ discard1(/* #__PURE__ */ $$void(/* #__PURE__ */ applyFirst(/* #__PURE__ */ StringParser_CodePoints.string("["))(StringParser_CodePoints.skipSpaces)))(function () {
    return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[.0-9]+"))(StringParser_CodePoints.string("]")))(StringParser_CodePoints.skipSpaces))(function (timestamp) {
        return discard1($$void(applyFirst(StringParser_CodePoints.string("stack_dump:"))(StringParser_CodePoints.skipSpaces)))(function () {
            return discard1($$void(StringParser_CodePoints.string("0x")))(function () {
                return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.string(":")))(StringParser_CodePoints.skipSpaces))(function (addr) {
                    return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v1) {
                        return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v2) {
                            return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v3) {
                                return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v4) {
                                    return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v5) {
                                        return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v6) {
                                            return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v7) {
                                                return bind(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.skipSpaces))(function (v8) {
                                                    return pure({
                                                        timestamp: timestamp,
                                                        addr: addr,
                                                        v1: v1,
                                                        v2: v2,
                                                        v3: v3,
                                                        v4: v4,
                                                        v5: v5,
                                                        v6: v6,
                                                        v7: v7,
                                                        v8: v8
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Parse the NuttX Exception.
// Given this NuttX Exception: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
// Result: { epc: "000000008000ad8a", exception: "Instruction page fault", mcause: 12, mtval: "000000008000ad8a" }
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var parseException = /* #__PURE__ */ discard1(/* #__PURE__ */ $$void(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ StringParser_CodePoints.string("riscv_exception:"))(StringParser_CodePoints.skipSpaces))(/* #__PURE__ */ StringParser_CodePoints.string("EXCEPTION:")))(StringParser_CodePoints.skipSpaces)))(function () {
    return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[^.]+"))(StringParser_CodePoints.string(".")))(StringParser_CodePoints.skipSpaces))(function (exception) {
        return discard1($$void(applyFirst(StringParser_CodePoints.string("MCAUSE:"))(StringParser_CodePoints.skipSpaces)))(function () {
            return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.string(",")))(StringParser_CodePoints.skipSpaces))(function (mcauseStr) {
                return discard1($$void(applyFirst(StringParser_CodePoints.string("EPC:"))(StringParser_CodePoints.skipSpaces)))(function () {
                    return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.string(",")))(StringParser_CodePoints.skipSpaces))(function (epc) {
                        return discard1($$void(applyFirst(StringParser_CodePoints.string("MTVAL:"))(StringParser_CodePoints.skipSpaces)))(function () {
                            return bind(StringParser_CodePoints.regex("[0-9a-f]+"))(function (mtval) {
                                return pure({
                                    exception: exception,
                                    mcause: Data_Maybe.fromMaybe(-1 | 0)(Data_Int.fromStringAs(Data_Int.hexadecimal)(mcauseStr)),
                                    epc: epc,
                                    mtval: mtval
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
var parseCSV = /* #__PURE__ */ (function () {
    var newline = StringParser_CodePoints.string("\x0a");
    var lastName_ = StringParser_CodePoints.string("LastName");
    var idNumber_ = StringParser_CodePoints.string("ID");
    var firstName_ = StringParser_CodePoints.string("FirstName");
    var email_ = StringParser_CodePoints.string("Email");
    var csvColumn = StringParser_CodePoints.regex("[^,]+");
    var commaThenSpaces = applySecond(StringParser_CodePoints.string(","))(StringParser_CodePoints.skipSpaces);
    var age_ = StringParser_CodePoints.string("Age");
    return discard1($$void(applySecond(applySecond(applySecond(applySecond(applySecond(applySecond(applySecond(applySecond(idNumber_)(commaThenSpaces))(firstName_))(commaThenSpaces))(lastName_))(commaThenSpaces))(age_))(commaThenSpaces))(email_)))(function () {
        return discard1($$void(newline))(function () {
            return bind(applyFirst(csvColumn)(commaThenSpaces))(function (idNumber) {
                return bind(applyFirst(csvColumn)(commaThenSpaces))(function (firstName) {
                    return bind(applyFirst(csvColumn)(commaThenSpaces))(function (lastName) {
                        return bind(applyFirst(csvColumn)(commaThenSpaces))(function (age) {
                            return bind(StringParser_Combinators.lookAhead(StringParser_CodePoints.regex("[^\x0a]+")))(function (originalEmail) {
                                var parsePeriodsAndPlusesAsEmptyStrings = voidRight("")(alt(StringParser_CodePoints.string("."))(StringParser_CodePoints.string("+")));
                                var parseAlphanumericChars = StringParser_CodePoints.regex("[a-zA-Z0-9]+");
                                var parseListOfParts = StringParser_Combinators.many1(alt(parseAlphanumericChars)(parsePeriodsAndPlusesAsEmptyStrings));
                                return bind(map(fold)(parseListOfParts))(function (usernameWithoutPeriodsOrPluses) {
                                    return discard1($$void(StringParser_CodePoints.string("@")))(function () {
                                        return bind(map(fold)(StringParser_Combinators.many1(alt(StringParser_CodePoints.regex("[a-zA-Z0-9]+"))(StringParser_CodePoints.string(".")))))(function (domainName) {
                                            return discard1($$void(StringParser_CodePoints.string("\x0a")))(function () {
                                                return discard1($$void(StringParser_CodePoints.eof))(function () {
                                                    return pure({
                                                        idNumber: idNumber,
                                                        firstName: firstName,
                                                        lastName: lastName,
                                                        age: age,
                                                        originalEmail: originalEmail,
                                                        modifiedEmail: usernameWithoutPeriodsOrPluses + ("@" + domainName)
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
})();
var numberOfAs = /* #__PURE__ */ bind(/* #__PURE__ */ StringParser_Combinators.many1(/* #__PURE__ */ alt(/* #__PURE__ */ voidRight(1)(/* #__PURE__ */ StringParser_CodePoints.string("a")))(/* #__PURE__ */ voidRight(0)(/* #__PURE__ */ StringParser_CodePoints.regex("[^a]")))))(function (list) {
    return pure(sum(list));
});
var extractWords = /* #__PURE__ */ StringParser_Combinators.endBy1(/* #__PURE__ */ StringParser_CodePoints.regex("[a-zA-Z]+"))(/* #__PURE__ */ StringParser_Combinators.many1(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string(" "))("Failed to match space as a separator"))(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string("'"))("Failed to match single-quote char as a separator"))(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string(","))("Failed to match comma as a separator"))(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string("?"))("Failed to match question mark as a separator"))(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string("."))("Failed to match period as a separator"))("Could not find a character that separated the content...")))))));

// Given this NuttX Exception: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
// Explain in friendly words: "NuttX stopped because it tried to read or write an Invalid Address. The Invalid Address is 8000ad8a. The code that caused this is at 8000ad8a. Check the NuttX Disassembly for the Source Code of the crashing line."
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var explainException = function (v) {
    return function (v1) {
        return function (v2) {
            if (v === 12) {
                return "Instruction Page Fault at " + (v1 + (", " + v2));
            };
            if (v === 13) {
                return "Load Page Fault at " + (v1 + (", " + v2));
            };
            return "Unknown Exception: mcause=" + (show(v) + (", epc=" + (v1 + (", mtval=" + v2))));
        };
    };
};

// Example Content 2
// CSV sample with some inconsistent spacing
var exampleContent2 = "ID, FirstName, LastName,             Age, Email\x0a523,     Mark,   Kenderson, 24, my.name.is.mark@mark.mark.com\x0a";

// Previously:
// printResults :: Effect Unit
// printResults = do
//   log "" -- empty blank line to separate output from function call
//   -- Parse the NuttX Stack Dump
//   doRunParser "parseStackDump" parseStackDump "[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000"
// log "### Example Content 1 ###"
// doBoth "fail" ((fail "example failure message") :: Parser Unit) exampleContent1
// doBoth "numberOfAs" numberOfAs exampleContent1
// doBoth "removePunctuation" removePunctuation exampleContent1
// doBoth "replaceVowelsWithUnderscore" replaceVowelsWithUnderscore exampleContent1
// doBoth "tokenizeContentBySpaceChars" tokenizeContentBySpaceChars exampleContent1
// doBoth "extractWords" extractWords exampleContent1
// doBoth "badExtractWords" badExtractWords exampleContent1
// doBoth "quotedLetterExists" quotedLetterExists exampleContent1
// log
//   "\n\
//   \### Example Content 2 ###"
// doBoth "parseCSV" parseCSV exampleContent2
// Example Content 1
var exampleContent1 = "How many 'a's are in this sentence, you ask? Not that many.";

// | Shows the results of calling `unParser`. You typically want to use
// | this function when writing a parser because it includes other info
// | to help you debug your code.
var doUnParser = function (dictShow) {
    var show3 = Data_Show.show(dictShow);
    return function (parserName) {
        return function (parser) {
            return function (content) {
                return function __do() {
                    Effect_Console.log("(unParser) Parsing content with '" + (parserName + "'"))();
                    (function () {
                        var v = StringParser_Parser.unParser(parser)({
                            substring: content,
                            position: 0
                        });
                        if (v instanceof Data_Either.Left) {
                            return Effect_Console.log("Position: " + (show(v.value0.pos) + ("\x0aError: " + show1(v.value0.error))))();
                        };
                        if (v instanceof Data_Either.Right) {
                            return Effect_Console.log("Result: " + (show3(v.value0.result) + ("\x0aSuffix was: " + show2(v.value0.suffix))))();
                        };
                        throw new Error("Failed pattern match at Main (line 399, column 3 - line 409, column 25): " + [ v.constructor.name ]);
                    })();
                    return Effect_Console.log("-----")();
                };
            };
        };
    };
};

// | Shows the results of calling `runParser`. You typically don't want to use
// | this function when writing a parser because it doesn't help you debug
// | your code when you write it incorrectly.
var doRunParser = function (dictShow) {
    var show3 = Data_Show.show(dictShow);
    return function (parserName) {
        return function (parser) {
            return function (content) {
                return function __do() {
                    Effect_Console.log("(runParser) Parsing content with '" + (parserName + "'"))();
                    (function () {
                        var v = StringParser_Parser.runParser(parser)(content);
                        if (v instanceof Data_Either.Left) {
                            return logShow(v.value0)();
                        };
                        if (v instanceof Data_Either.Right) {
                            return Effect_Console.log("Result: " + show3(v.value0))();
                        };
                        throw new Error("Failed pattern match at Main (line 418, column 3 - line 420, column 52): " + [ v.constructor.name ]);
                    })();
                    return Effect_Console.log("-----")();
                };
            };
        };
    };
};
var doRunParser1 = /* #__PURE__ */ doRunParser(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "epc";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "exception";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "mcause";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "mtval";
    }
})(Data_Show.showString))(Data_Show.showInt))(Data_Show.showString))(Data_Show.showString)));
var doRunParser2 = /* #__PURE__ */ doRunParser(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "addr";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "timestamp";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v1";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v2";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v3";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v4";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v5";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v6";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "v7";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "v8";
    }
})(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString)));

// Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
// `Effect` says that it will do Side Effects (printing to console)
// `Unit` means that no value will be returned
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var printResults = function __do() {
    Effect_Console.log(explainException(12)("epc")("mtval"))();
    Effect_Console.log(explainException(13)("epc")("mtval"))();
    Effect_Console.log(explainException(0)("epc")("mtval"))();
    doRunParser1("parseException")(parseException)("riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a")();
    return doRunParser2("parseStackDump")(parseStackDump)("[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000")();
};

// Main Function that will run our Test Code.
// `Effect` says that it will do Side Effects (printing to console)
// `Unit` means that no value will be returned
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var main = printResults;

// Helper functions
var doBoth = function (dictShow) {
    var doRunParser3 = doRunParser(dictShow);
    var doUnParser1 = doUnParser(dictShow);
    return function (parserName) {
        return function (parser) {
            return function (content) {
                return function __do() {
                    doRunParser3(parserName)(parser)(content)();
                    return doUnParser1(parserName)(parser)(content)();
                };
            };
        };
    };
};
var badExtractWords = /* #__PURE__ */ bind(/* #__PURE__ */ StringParser_Combinators.endBy1(/* #__PURE__ */ StringParser_CodePoints.regex("[a-zA-Z]+"))(/* #__PURE__ */ StringParser_Combinators.many1(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string(" "))("Failed to match space as a separator"))(/* #__PURE__ */ alt(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string("'"))("Failed to match single-quote char as a separator"))(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_Combinators.withError(/* #__PURE__ */ StringParser_CodePoints.string(","))("Failed to match comma as a separator"))("Could not find a character that separated the content..."))))))(function (list) {
    return discard1(StringParser_Combinators.withError(StringParser_CodePoints.eof)("Entire content should have been parsed but wasn't."))(function () {
        return pure(list);
    });
});
export {
    main,
    printResults,
    explainException,
    parseException,
    parseStackDump,
    exampleContent1,
    numberOfAs,
    removePunctuation,
    replaceVowelsWithUnderscore,
    tokenizeContentBySpaceChars,
    extractWords,
    badExtractWords,
    quotedLetterExists,
    exampleContent2,
    parseCSV,
    doBoth,
    doUnParser,
    doRunParser
};
