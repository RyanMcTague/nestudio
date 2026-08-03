import {
  HighlightStyle,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
  type StreamParser,
  type StringStream,
} from "@codemirror/language"
import { Prec } from "@codemirror/state"
import type {
  Completion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete"
import { tags as t } from "@lezer/highlight"

const MNEMONICS = new Set([
  "adc",
  "and",
  "asl",
  "bcc",
  "bcs",
  "beq",
  "bit",
  "bmi",
  "bne",
  "bpl",
  "brk",
  "bvc",
  "bvs",
  "clc",
  "cld",
  "cli",
  "clv",
  "cmp",
  "cpx",
  "cpy",
  "dec",
  "dex",
  "dey",
  "eor",
  "inc",
  "inx",
  "iny",
  "jmp",
  "jsr",
  "lda",
  "ldx",
  "ldy",
  "lsr",
  "nop",
  "ora",
  "pha",
  "php",
  "pla",
  "plp",
  "rol",
  "ror",
  "rti",
  "rts",
  "sbc",
  "sec",
  "sed",
  "sei",
  "sta",
  "stx",
  "sty",
  "tax",
  "tay",
  "tsx",
  "txa",
  "txs",
  "tya",
])

const DIRECTIVES = new Set([
  "org",
  "byte",
  "word",
  "db",
  "dw",
  "ds",
  "equ",
  "end",
  "include",
  "segment",
  "proc",
  "endproc",
  "macro",
  "endmacro",
  "if",
  "endif",
  "else",
  "res",
  "align",
  "asciiz",
  "ascii",
])

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Asm6502State {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function token(stream: StringStream, _state: Asm6502State): string | null {
  if (stream.eatSpace()) return null

  if (stream.match(/^;.*/)) return "comment"

  if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) return "string"

  if (stream.sol() && stream.match(/^[A-Za-z_.][\w.]*(?=:)/)) return "def"

  if (stream.sol() && stream.match(/^[A-Za-z_]\w*(?=\s*=(?!=))/))
    return "variableName.constant"

  if (stream.match(/^\.[A-Za-z]+/)) return "meta"

  if (stream.match(/^\$[0-9A-Fa-f]+/)) return "number"
  if (stream.match(/^%[01]+/)) return "number"
  if (stream.match(/^\d+/)) return "number"

  if (stream.match(/^[#,():]/)) return null

  const word = stream.match(/^[A-Za-z_]\w*/)
  if (word) {
    const text = (word as RegExpMatchArray)[0].toLowerCase()
    if (MNEMONICS.has(text)) return "keyword"
    if (DIRECTIVES.has(text)) return "meta"
    if (/^[axy]$/.test(text)) return "atom"
    return "variableName"
  }

  stream.next()
  return null
}

const asm6502Parser: StreamParser<Asm6502State> = {
  startState: () => ({}),
  token,
  languageData: {
    commentTokens: { line: ";" },
  },
}

export const asm6502Language = StreamLanguage.define(asm6502Parser)

export const asm6502HighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#ff79c6", fontWeight: "bold" },
  { tag: t.comment, color: "#6a9955", fontStyle: "italic" },
  { tag: t.number, color: "#ffb86c" },
  { tag: t.string, color: "#a6e22e" },
  { tag: t.meta, color: "#66d9ef" },
  { tag: t.definition(t.variableName), color: "#f1fa8c", fontWeight: "bold" },
  { tag: t.constant(t.variableName), color: "#50fa7b", fontWeight: "bold" },
  { tag: t.atom, color: "#bd93f9" },
  { tag: t.variableName, color: "#e6e6e6" },
])

const mnemonicOptions: Completion[] = [...MNEMONICS].sort().map((label) => ({
  label,
  type: "keyword",
  detail: "opcode",
  boost: 1,
}))

const directiveOptions: Completion[] = [...DIRECTIVES].sort().map((label) => ({
  label,
  type: "type",
  detail: "directive",
}))

const registerOptions: Completion[] = ["a", "x", "y"].map((label) => ({
  label,
  type: "variable",
  detail: "register",
}))

const staticOptions: Completion[] = [
  ...mnemonicOptions,
  ...directiveOptions,
  ...registerOptions,
]

const LABEL_RE = /^[A-Za-z_.][\w.]*(?=:)/
const CONSTANT_RE = /^([A-Za-z_]\w*)\s*=\s*([^;]+)/

function symbolOptions(doc: string): Completion[] {
  const symbols = new Map<string, Completion>()
  for (const rawLine of doc.split("\n")) {
    const line = rawLine.trimStart()

    const label = LABEL_RE.exec(line)
    if (label) {
      symbols.set(label[0], { label: label[0], type: "variable", detail: "label" })
      continue
    }

    const constant = CONSTANT_RE.exec(line)
    if (constant) {
      const [, name, value] = constant
      symbols.set(name, {
        label: name,
        type: "constant",
        detail: "constant",
        info: value.trim(),
      })
    }
  }
  return [...symbols.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export function asm6502Completions(
  context: CompletionContext,
): CompletionResult | null {
  const word = context.matchBefore(/[\w.]+/)
  if (!word) return null
  if (word.from == word.to && !context.explicit) return null
  return {
    from: word.from,
    options: [
      ...staticOptions,
      ...symbolOptions(context.state.doc.toString()),
    ],
    validFor: /^[\w.]*$/,
  }
}

export function asm6502(): LanguageSupport {
  return new LanguageSupport(asm6502Language, [
    Prec.highest(syntaxHighlighting(asm6502HighlightStyle)),
    asm6502Language.data.of({ autocomplete: asm6502Completions }),
  ])
}
