"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sanitizer {
    /**
     * Provide a string if you intend to use the parse high order function
     * @param {(string | undefined)} sanitiseString
     * @memberof Sanitizer
     */
    constructor(sanitiseString) {
        this.sanitiseString = sanitiseString;
    }
    /**
     * strips all unwanted information from the json contents
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    jsonFile(content) {
        this.sanitiseString = content;
        this.parse(this.removeInlineComments)
            .parse(this.removeDoubleSlashComments)
            .parse(this.removeLinesWithOnlyWhitespace);
        return this.sanitiseString.trim();
    }
    run(content) {
        this.sanitiseString = content;
        this.parse(this.removeInlineComments)
            .parse(this.removeDoubleSlashComments)
            .parse(this.removeLinesWithOnlyWhitespace);
        return this.sanitiseString;
    }
    /**
     * Should be called to make multiple changes to the sanitiseString
     * property which was provided in the constructor
     * The callback method should make any changes which are required
     * to the string and then return the parsed version
     *
     * @param {(content: string) => string} callback
     * @returns {Sanitizer}
     * @memberof Sanitizer
     */
    parse(callback) {
        if (this.sanitiseString === undefined)
            throw new Error('sanitiseString needs to be set in the constructor to use this method');
        this.sanitiseString = callback(this.sanitiseString);
        return this;
    }
    /**
     * Removes all comments which start with /* and end with *\/
     *
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeInlineComments(content) {
        return content.replace(/\/\*[^\*\/]*?\*\//g, "");
    }
    /**
     * Removes all comments which start with /* and end with *\/
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeMultilineComments(content) {
        return content.replace(/\/\*[^\*\/]*\*\/\s?/g, "");
    }
    /**
     * Removes all comments which starts with //
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeDoubleSlashComments(content) {
        return content.replace(/\/\/[^\r\n]*\r?\n/g, "");
    }
    /**
     * Removes all lines which are empty and only contain whitespace characters
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeLinesWithOnlyWhitespace(content) {
        return content.split('\n').map(line => { return line.trim(); }).filter(i => i.length > 0).join('\n');
        // let newContent: string[] = []
        // parts.forEach(line => {
        //     if(line.trim().length > 0) {
        //         newContent.push(line.trim())
        //     } 
        // })
        // return newContent.join('\n')
    }
    /**
     * Removes all comments which start with a hash sign
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeHashComments(content) {
        return content.replace(/#+[^\r\n]*\r?\n/g, "");
    }
    /**
     * Removes all html style comments
     *
     * @param {string} content
     * @returns {string}
     * @memberof Sanitizer
     */
    removeHtmlComments(content) {
        return content.replace(/<!--[\s\S]*?-->/g, "");
    }
}
exports.Sanitizer = Sanitizer;
//# sourceMappingURL=index.js.map