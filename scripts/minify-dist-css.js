#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const cssDir = path.join(distDir, "css");
const jsDir = path.join(distDir, "js");

const minifyCss = (css) => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
};

const minifyJs = (source) => {
  let output = "";
  let state = "code";
  let escapeNext = false;
  let pendingSpace = false;
  let previousCodeChar = "";

  const isWordChar = (char) => /[A-Za-z0-9_$]/.test(char);
  const flushSpace = (nextChar) => {
    if (!pendingSpace) {
      return;
    }

    if (isWordChar(previousCodeChar) && isWordChar(nextChar)) {
      output += " ";
    }

    pendingSpace = false;
  };

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (state === "line-comment") {
      if (char === "\n") {
        state = "code";
        pendingSpace = true;
      }
      continue;
    }

    if (state === "block-comment") {
      if (char === "*" && nextChar === "/") {
        state = "code";
        index += 1;
      }
      continue;
    }

    if (state === "single-quote" || state === "double-quote" || state === "template") {
      output += char;

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (
        (state === "single-quote" && char === "'") ||
        (state === "double-quote" && char === "\"") ||
        (state === "template" && char === "`")
      ) {
        state = "code";
        previousCodeChar = char;
      }
      continue;
    }

    if (char === "/" && nextChar === "/") {
      state = "line-comment";
      index += 1;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      state = "block-comment";
      index += 1;
      continue;
    }

    if (/\s/.test(char)) {
      pendingSpace = true;
      continue;
    }

    if (char === "'") {
      flushSpace(char);
      output += char;
      state = "single-quote";
      previousCodeChar = char;
      continue;
    }

    if (char === "\"") {
      flushSpace(char);
      output += char;
      state = "double-quote";
      previousCodeChar = char;
      continue;
    }

    if (char === "`") {
      flushSpace(char);
      output += char;
      state = "template";
      previousCodeChar = char;
      continue;
    }

    flushSpace(char);
    output += char;
    previousCodeChar = char;
  }

  return output.trim();
};

if (fs.existsSync(cssDir)) {
  for (const entry of fs.readdirSync(cssDir, { withFileTypes: true })) {
    if (!entry.isFile() || path.extname(entry.name) !== ".css") {
      continue;
    }

    const filePath = path.join(cssDir, entry.name);
    const source = fs.readFileSync(filePath, "utf8");
    fs.writeFileSync(filePath, `${minifyCss(source)}\n`);
  }
}

if (fs.existsSync(jsDir)) {
  for (const entry of fs.readdirSync(jsDir, { withFileTypes: true })) {
    if (!entry.isFile() || path.extname(entry.name) !== ".js") {
      continue;
    }

    const filePath = path.join(jsDir, entry.name);
    const source = fs.readFileSync(filePath, "utf8");
    fs.writeFileSync(filePath, `${minifyJs(source)}\n`);
  }
}
