// Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
// Based on https://github.com/purescript-contrib/purescript-string-parsers/blob/main/test/Examples.purs
// Main Module will be started by `spago run`
import * as Control_Applicative from "https://compile.purescript.org/output/Control.Applicative/index.js";
import * as Control_Apply from "https://compile.purescript.org/output/Control.Apply/index.js";
import * as Control_Bind from "https://compile.purescript.org/output/Control.Bind/index.js";
import * as Data_Boolean from "https://compile.purescript.org/output/Data.Boolean/index.js";
import * as Data_Either from "https://compile.purescript.org/output/Data.Either/index.js";
import * as Data_Functor from "https://compile.purescript.org/output/Data.Functor/index.js";
import * as Data_Int from "https://compile.purescript.org/output/Data.Int/index.js";
import * as Data_Maybe from "https://compile.purescript.org/output/Data.Maybe/index.js";
import * as Data_Show from "https://compile.purescript.org/output/Data.Show/index.js";
import * as Data_String_CodeUnits from "https://compile.purescript.org/output/Data.String.CodeUnits/index.js";
import * as Data_String_Regex from "https://compile.purescript.org/output/Data.String.Regex/index.js";
import * as Data_String_Regex_Flags from "https://compile.purescript.org/output/Data.String.Regex.Flags/index.js";
import * as Data_String_Regex_Unsafe from "https://compile.purescript.org/output/Data.String.Regex.Unsafe/index.js";
import * as Effect_Console from "https://compile.purescript.org/output/Effect.Console/index.js";
import * as StringParser_CodePoints from "https://compile.purescript.org/output/StringParser.CodePoints/index.js";
import * as StringParser_Combinators from "https://compile.purescript.org/output/StringParser.Combinators/index.js";
import * as StringParser_Parser from "https://compile.purescript.org/output/StringParser.Parser/index.js";
var discard = /* #__PURE__ */ Control_Bind.discard(Control_Bind.discardUnit);
var discard1 = /* #__PURE__ */ discard(StringParser_Parser.bindParser);
var applyFirst = /* #__PURE__ */ Control_Apply.applyFirst(StringParser_Parser.applyParser);

// Skip `stack_dump: `
// `void` means ignore the Text Captured
// `$ something something` is shortcut for `( something something )`
// `<*` is the Delimiter between Patterns
var $$void = /* #__PURE__ */ Data_Functor["void"](StringParser_Parser.functorParser);
var bind = /* #__PURE__ */ Control_Bind.bind(StringParser_Parser.bindParser);
var pure = /* #__PURE__ */ Control_Applicative.pure(StringParser_Parser.applicativeParser);
var show = /* #__PURE__ */ Data_Show.show(Data_Show.showInt);
var showRecord = /* #__PURE__ */ Data_Show.showRecord()();
var logShow = /* #__PURE__ */ Effect_Console.logShow(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "error";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "pos";
    }
})(Data_Show.showInt))(Data_Show.showString)));

// Address can point to Code, Data, BSS or Heap
var Code = /* #__PURE__ */ (function () {
    function Code() {

    };
    Code.value = new Code();
    return Code;
})();

// Address can point to Code, Data, BSS or Heap
var Data = /* #__PURE__ */ (function () {
    function Data() {

    };
    Data.value = new Data();
    return Data;
})();

// Address can point to Code, Data, BSS or Heap
var BSS = /* #__PURE__ */ (function () {
    function BSS() {

    };
    BSS.value = new BSS();
    return BSS;
})();

// Address can point to Code, Data, BSS or Heap
var Heap = /* #__PURE__ */ (function () {
    function Heap() {

    };
    Heap.value = new Heap();
    return Heap;
})();

// How to display an Address Type
var showAddressType = {
    show: function (v) {
        if (v instanceof Code) {
            return "Code";
        };
        if (v instanceof Data) {
            return "Data";
        };
        if (v instanceof BSS) {
            return "BSS";
        };
        if (v instanceof Heap) {
            return "Heap";
        };
        throw new Error("Failed pattern match at Main (line 79, column 1 - line 83, column 21): " + [ v.constructor.name ]);
    }
};

// NuttX Kernel: 0x5020_0000 to 0x5021_98ac
// NuttX App (qjs): 0x8000_0000 to 0x8006_4a28
var logShow1 = /* #__PURE__ */ Effect_Console.logShow(/* #__PURE__ */ Data_Maybe.showMaybe(/* #__PURE__ */ showRecord(/* #__PURE__ */ Data_Show.showRecordFieldsCons({
    reflectSymbol: function () {
        return "origin";
    }
})(/* #__PURE__ */ Data_Show.showRecordFieldsConsNil({
    reflectSymbol: function () {
        return "type";
    }
})(showAddressType))(Data_Show.showString))));

// Parse a line of NuttX Stack Dump.
// Given this line of NuttX Stack Dump: `stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000`
// Result: { addr: "c02027e0", timestamp: "6.242000", v1: "c0202010", v2: "00000000", v3: "00000001", v4: "00000000", v5: "00000000", v6: "00000000", v7: "8000ad8a", v8: "00000000" }
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var parseStackDump = /* #__PURE__ */ discard1(/* #__PURE__ */ StringParser_Combinators.optional(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ StringParser_CodePoints.string("["))(StringParser_CodePoints.skipSpaces))(/* #__PURE__ */ StringParser_CodePoints.regex("[.0-9]+")))(/* #__PURE__ */ StringParser_CodePoints.string("]")))(StringParser_CodePoints.skipSpaces)))(function () {
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

// Parse the NuttX Exception.
// Given this NuttX Exception: `riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a`
// Result: { epc: "8000ad8a", exception: "Instruction page fault", mcause: 12, mtval: "8000ad8a" }
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var parseException = /* #__PURE__ */ discard1(/* #__PURE__ */ $$void(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ applyFirst(/* #__PURE__ */ StringParser_CodePoints.string("riscv_exception:"))(StringParser_CodePoints.skipSpaces))(/* #__PURE__ */ StringParser_CodePoints.string("EXCEPTION:")))(StringParser_CodePoints.skipSpaces)))(function () {
    return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[^.]+"))(StringParser_CodePoints.string(".")))(StringParser_CodePoints.skipSpaces))(function (exception) {
        return discard1($$void(applyFirst(StringParser_CodePoints.string("MCAUSE:"))(StringParser_CodePoints.skipSpaces)))(function () {
            return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.string(",")))(StringParser_CodePoints.skipSpaces))(function (mcauseStr) {
                return discard1($$void(applyFirst(StringParser_CodePoints.string("EPC:"))(StringParser_CodePoints.skipSpaces)))(function () {
                    return bind(applyFirst(applyFirst(StringParser_CodePoints.regex("[0-9a-f]+"))(StringParser_CodePoints.string(",")))(StringParser_CodePoints.skipSpaces))(function (epcWithPrefix) {
                        return discard1($$void(applyFirst(StringParser_CodePoints.string("MTVAL:"))(StringParser_CodePoints.skipSpaces)))(function () {
                            return bind(StringParser_CodePoints.regex("[0-9a-f]+"))(function (mtvalWithPrefix) {
                                return pure({
                                    exception: exception,
                                    mcause: Data_Maybe.fromMaybe(-1 | 0)(Data_Int.fromStringAs(Data_Int.hexadecimal)(mcauseStr)),
                                    epc: Data_Maybe.fromMaybe(epcWithPrefix)(Data_String_CodeUnits.stripPrefix("00000000")(epcWithPrefix)),
                                    mtval: Data_Maybe.fromMaybe(mtvalWithPrefix)(Data_String_CodeUnits.stripPrefix("00000000")(mtvalWithPrefix))
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Return True if the Address matches the Regex Pattern.
// Pattern is assumed to match the Entire Address.
var matches = function (pattern) {
    return function (addr) {
        var patternWrap = "^" + (pattern + "$");
        return Data_Maybe.isJust(Data_String_Regex.match(Data_String_Regex_Unsafe.unsafeRegex(patternWrap)(Data_String_Regex_Flags.noFlags))(addr));
    };
};

// Given an Address, identify the Origin (NuttX Kernel or App) and Type (Code / Data / BSS / Heap)
var identifyAddress = function (addr) {
    if (matches("502.....")(addr)) {
        return new Data_Maybe.Just({
            origin: "nuttx",
            type: Code.value
        });
    };
    if (matches("800.....")(addr)) {
        return new Data_Maybe.Just({
            origin: "qjs",
            type: Code.value
        });
    };
    if (Data_Boolean.otherwise) {
        return Data_Maybe.Nothing.value;
    };
    throw new Error("Failed pattern match at Main (line 57, column 1 - line 63, column 6): " + [ addr.constructor.name ]);
};

// Given this NuttX Exception: `riscv_exception: EXCEPTION: Load page fault. MCAUSE: 000000000000000d, EPC: 000000008000a0e4, MTVAL: 0000000880203b88`
// Explain in friendly words: "We hit a Load Page Fault. Our code at Code Address 8000a0e4 tried to access the Data Address 0000000880203b88, which is Invalid."
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var explainException = function (v) {
    return function (v1) {
        return function (v2) {
            if (v === 13) {
                return "We hit a Load Page Fault." + (" Our code at Code Address " + (v1 + (" tried to access the Data Address " + (v2 + ", which is Invalid."))));
            };
            if (v === 12) {
                return "Instruction Page Fault at " + (v1 + (", " + v2));
            };
            return "Unknown Exception: mcause=" + (show(v) + (", epc=" + (v1 + (", mtval=" + v2))));
        };
    };
};

// Shows the results of calling `runParser`. We typically don't want to use
// this function when writing a parser because it doesn't help us debug
// our code when we write it incorrectly.
var doRunParser = function (dictShow) {
    var show1 = Data_Show.show(dictShow);
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
                            return Effect_Console.log("Result: " + show1(v.value0))();
                        };
                        throw new Error("Failed pattern match at Main (line 282, column 3 - line 284, column 52): " + [ v.constructor.name ]);
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
})(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString))(Data_Show.showString)));

// Test our code. Parse the NuttX Exception and NuttX Stack Dump. Explain the NuttX Exception.
// `Effect` says that it will do Side Effects (printing to console)
// `Unit` means that no value will be returned
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var printResults = function __do() {
    Effect_Console.log(explainException(13)("8000a0e4")("0000000880203b88"))();
    Effect_Console.log(explainException(12)("epc")("mtval"))();
    Effect_Console.log(explainException(0)("epc")("mtval"))();
    logShow1(identifyAddress("502198ac"))();
    logShow1(identifyAddress("8000a0e4"))();
    logShow1(identifyAddress("0000000800203b88"))();
    doRunParser1("parseException")(parseException)("riscv_exception: EXCEPTION: Instruction page fault. MCAUSE: 000000000000000c, EPC: 000000008000ad8a, MTVAL: 000000008000ad8a")();
    doRunParser2("parseStackDump")(parseStackDump)("stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000")();
    return doRunParser2("parseStackDump")(parseStackDump)("[    6.242000] stack_dump: 0xc02027e0: c0202010 00000000 00000001 00000000 00000000 00000000 8000ad8a 00000000")();
};

// Main Function that will run our Test Code.
// `Effect` says that it will do Side Effects (printing to console)
// `Unit` means that no value will be returned
// The next line declares the Function Type. We can actually erase it, VSCode PureScript Extension will helpfully suggest it for us.
var main = printResults;
export {
    main,
    explainException,
    identifyAddress,
    Code,
    Data,
    BSS,
    Heap,
    matches,
    printResults,
    parseException,
    parseStackDump,
    doRunParser,
    showAddressType
};
