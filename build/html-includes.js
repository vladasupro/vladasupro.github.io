'use strict';

// Builds the site's HTML pages from shared parts (head, header, footer).
//
// Page sources live in  assets/src/pages/      (edit these)
// Shared parts live in  assets/src/partials/   (edit these)
// Finished pages are written to the project root (don't edit those: they're
// overwritten on every build).
//
// In a page, include a part with:
//     <!-- @include header.html -->
// and pass values to it with attributes:
//     <!-- @include head.html title="Ford Bronco | Vlada Suprotkina" -->
// Inside the part, use the value as {{title}}. Parts can include other parts.

const fs = require('fs');
const path = require('path');

const INCLUDE_RE = /^([ \t]*)<!--\s*@include\s+([\w./-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->[ \t]*$/gm;
const ATTR_RE = /([\w-]+)="([^"]*)"/g;
const VAR_RE = /{{\s*([\w-]+)\s*}}/g;

function readText(file) {
    // Work with \n internally; line endings are restored when writing.
    return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function parseAttrs(text) {
    const values = {};
    let match;
    ATTR_RE.lastIndex = 0;
    while ((match = ATTR_RE.exec(text))) {
        values[match[1]] = match[2];
    }
    return values;
}

function render(file, partialsDir, values, chain, deps) {
    let text = readText(file);
    deps.add(file);

    // Fill in {{values}} passed to this part.
    if (chain.length > 1) {
        text = text.replace(VAR_RE, (whole, name) => {
            if (!(name in values)) {
                throw new Error(`${path.basename(file)} uses {{${name}}}, but "${path.basename(chain[chain.length - 2])}" doesn't pass ${name}="..." when including it`);
            }
            return values[name];
        });
    }

    // Replace each include line with the part, indented to match.
    return text.replace(INCLUDE_RE, (whole, indent, name, attrs) => {
        const partFile = path.join(partialsDir, name);
        if (!fs.existsSync(partFile)) {
            throw new Error(`${path.basename(file)} includes "${name}", but ${path.relative(process.cwd(), partFile)} doesn't exist`);
        }
        if (chain.includes(partFile)) {
            throw new Error(`"${name}" ends up including itself (${chain.concat(partFile).map((f) => path.basename(f)).join(' → ')})`);
        }
        const part = render(partFile, partialsDir, parseAttrs(attrs), chain.concat(partFile), deps)
            .replace(/\n+$/, '');
        return part
            .split('\n')
            .map((line) => (line ? indent + line : line))
            .join('\n');
    });
}

// Builds every page. Returns the files it read (for watch mode) and the pages it wrote.
function buildPages({ pagesDir, partialsDir, outputDir }) {
    const deps = new Set();
    const written = [];
    const pages = fs.readdirSync(pagesDir).filter((name) => name.endsWith('.html'));

    for (const name of pages) {
        const source = path.join(pagesDir, name);
        const usesCrlf = fs.readFileSync(source, 'utf8').includes('\r\n');
        let html = render(source, partialsDir, {}, [source], deps);

        const note = `<!-- Built from ${path.relative(outputDir, source).replace(/\\/g, '/')}. Edit that file, not this one: this file is overwritten on every build. -->`;
        html = /^<!DOCTYPE[^>]*>\n/i.test(html)
            ? html.replace(/^(<!DOCTYPE[^>]*>\n)/i, `$1${note}\n`)
            : `${note}\n${html}`;

        if (usesCrlf) html = html.replace(/\n/g, '\r\n');

        const target = path.join(outputDir, name);
        // Only write when something changed, so file dates stay meaningful.
        if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== html) {
            fs.writeFileSync(target, html);
            written.push(name);
        }
    }

    return { deps, written };
}

// Webpack plugin: builds the pages after each build, and in watch mode
// rebuilds them whenever a page or a part changes.
class HtmlIncludesPlugin {
    constructor(options) {
        this.options = options;
        this.deps = new Set();
    }

    apply(compiler) {
        const { pagesDir, partialsDir } = this.options;

        compiler.hooks.afterCompile.tap('HtmlIncludesPlugin', (compilation) => {
            compilation.contextDependencies.add(pagesDir);
            compilation.contextDependencies.add(partialsDir);
            this.deps.forEach((file) => compilation.fileDependencies.add(file));
        });

        compiler.hooks.afterEmit.tap('HtmlIncludesPlugin', (compilation) => {
            try {
                const { deps, written } = buildPages(this.options);
                this.deps = deps;
                if (written.length) {
                    console.log(`HTML pages built: ${written.join(', ')}`);
                }
            } catch (error) {
                compilation.errors.push(new Error(`HTML pages not built: ${error.message}`));
            }
        });
    }
}

module.exports = { buildPages, HtmlIncludesPlugin };
