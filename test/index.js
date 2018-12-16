"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../node_modules/mocha-typescript/globals.d.ts"/>
const src_1 = require("../src");
const chai_1 = require("chai");
const fs = require("fs");
const path = require("path");
let SanitizerUnitTest = class SanitizerUnitTest extends src_1.Sanitizer {
    "that the run method removed all comments using // and ending with \r\n"() {
        let data = fs.readFileSync(path.join(process.cwd(), 'test', 'resources', 'test.json'), {
            encoding: 'utf8'
        });
        let json = this.run(data);
        chai_1.expect(() => { JSON.parse(json); }).to.not.throws("The parse method should not throw");
    }
    "removeLinesWithOnlyWhitespace should remove all lines with only white space"() {
        let data = `{"name" : "david",\n           \n"surname" : "here"\n                          \n}`;
        let shouldBe = `{"name" : "david",\n"surname" : "here"\n}`;
        let sanitizedData = this.removeLinesWithOnlyWhitespace(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove all comments using /* */"() {
        let data = `{"name" /* hi there */ : "da/* hi there */vid", /* hi there */"surname" : "here"}`;
        let shouldBe = `{"name"  : "david", "surname" : "here"}`;
        let sanitizedData = this.removeInlineComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove all comments using /* */ containing a line break "() {
        let data = `{\n\t"name"/* hi there\nwith a newline\n*/:"da/* hi there */vid",\n\t/* hi there */"surname":"here"\n}`;
        let shouldBe = `{\n\t"name":"david",\n\t"surname":"here"\n}`;
        let sanitizedData = this.removeInlineComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove all multi line comments using /* */"() {
        let shouldBe = `{"name" : "david","surname" : "here","age" : 31}`;
        let data = `{"name" /* hi there\nanother line of test\nand another*/ : "da/* hi there */vid",/* hi there */\n"surname" : "here","age" : 31}`;
        let sanitizedData = this.removeMultilineComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove multiline comments from a php file"() {
        let data = fs.readFileSync(path.join(process.cwd(), 'test', 'resources', 'multiline-comments.php'), {
            encoding: 'utf8'
        });
        let shouldBe = fs.readFileSync(path.join(process.cwd(), 'test', 'resources', 'comments.php'), {
            encoding: 'utf8'
        });
        let sanitizedData = this.removeMultilineComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove all lines which start with //"() {
        let shouldBe = `{"surname" : "here","age" : 31}`;
        let data = `{// "name" /* hi there */ : "da/* hi there */vid",/* hi there */\n"surname" : "here","age" : 31}`;
        let sanitizedData = this.removeDoubleSlashComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "removes all hash comments"() {
        let data = `### This is my title\nnpm install\n# this is a comment\ncp ./* ./other-folder`;
        let shouldBe = `npm install\ncp ./* ./other-folder`;
        let sanitizedData = this.removeHashComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "should remove all html comments"() {
        let data = `<body><h1>Hello, world</h1><!--
        This should not be included - in the file! <h1>
        --></body>`;
        let shouldBe = "<body><h1>Hello, world</h1></body>";
        let sanitizedData = this.removeHtmlComments(data);
        chai_1.expect(sanitizedData).to.be.equal(shouldBe);
    }
    "santizing json file with comments"() {
        let data = fs.readFileSync(path.join(process.cwd(), 'test', 'resources', 'test.json'), {
            encoding: 'utf8'
        });
        let shouldBe = fs.readFileSync(path.join(process.cwd(), 'test', 'resources', 'sanitized-test.json'), {
            encoding: 'utf8'
        });
        let sanitizedData = this.jsonFile(data);
        chai_1.expect(sanitizedData).to.be.equal(this.removeLinesWithOnlyWhitespace(shouldBe));
    }
    "Test that an error is thrown when sanitizer string is undefined"() {
        this.sanitiseString = undefined;
        chai_1.expect(() => { this.parse((i) => { return i; }); }, 'Parse should throw because sanitise string is undefined').to.throw();
    }
    "Test that an error is not thrown when sanitizer string is defined"() {
        this.sanitiseString = "a string";
        chai_1.expect(() => { this.parse((i) => { return i; }); }, 'Parse should throw because sanitise string is undefined').to.not.throw();
    }
};
__decorate([
    test
], SanitizerUnitTest.prototype, "that the run method removed all comments using // and ending with \r\n", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "removeLinesWithOnlyWhitespace should remove all lines with only white space", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove all comments using /* */", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove all comments using /* */ containing a line break ", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove all multi line comments using /* */", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove multiline comments from a php file", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove all lines which start with //", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "removes all hash comments", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "should remove all html comments", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "santizing json file with comments", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "Test that an error is thrown when sanitizer string is undefined", null);
__decorate([
    test
], SanitizerUnitTest.prototype, "Test that an error is not thrown when sanitizer string is defined", null);
SanitizerUnitTest = __decorate([
    suite('Sanitizer Test')
], SanitizerUnitTest);
//# sourceMappingURL=index.js.map