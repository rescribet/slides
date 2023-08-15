// https://github.com/webpro/reveal-md/issues/228#issuecomment-464028190

const { readFileSync } = require('fs');
const path = require('path');

const LINE_SEPARATOR = '\n';
const FILE_REF_REGEX = /^FILE: (.+)\n?$/;

const isFileReference = (line) => FILE_REF_REGEX.test(line);
const loadFileContent = (line, basePath) => {
    const filePath = line.match(FILE_REF_REGEX)[1];

    return readFileSync(path.join(basePath, filePath));
};

const preprocess = async (markdown, options) =>
    markdown
        .split(LINE_SEPARATOR)
        .map(line => isFileReference(line) ? loadFileContent(line, options.includeDir ?? __dirname) : line)
        .join(LINE_SEPARATOR);

module.exports = preprocess;
