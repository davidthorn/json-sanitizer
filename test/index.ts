/// <reference path="../node_modules/mocha-typescript/globals.d.ts"/>
import {  Sanitizer } from '../src'
import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'

@suite('Sanitizer Test')
class SanitizerUnitTest extends Sanitizer {

    @test "that the run method removed all comments using // and ending with \r\n"() {
      
        let data = fs.readFileSync(path.join(process.cwd() , 'test' , 'test.json'), {
            encoding: 'utf8'
        })
        let json = this.run(data)
        expect(() => { JSON.parse(json) }).to.not.throws("The parse method should not throw")
    }

    @test "removeLinesWithOnlyWhitespace should remove all lines with only white space" () {
        let data = `{"name" : "david",\n           \n"surname" : "here"\n                          \n}`
        let shouldBe = `{"name" : "david",\n"surname" : "here"\n}`
        let sanitizedData = this.removeLinesWithOnlyWhitespace(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove all comments using /* */"() {
        let data = `{"name" /* hi there */ : "da/* hi there */vid", /* hi there */"surname" : "here"}`
        let shouldBe = `{"name"  : "david", "surname" : "here"}`
        let sanitizedData = this.removeInlineComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove all comments using /* */ containing a line break "() {
        let data = `{\n\t"name"/* hi there\nwith a newline\n*/:"da/* hi there */vid",\n\t/* hi there */"surname":"here"\n}`
        let shouldBe = `{\n\t"name":"david",\n\t"surname":"here"\n}`
        let sanitizedData = this.removeInlineComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove all multi line comments using /* */"() {
        let shouldBe = `{"name" : "david","surname" : "here","age" : 31}`
        let data = `{"name" /* hi there\nanother line of test\nand another*/ : "da/* hi there */vid",/* hi there */\n"surname" : "here","age" : 31}`
        
        let sanitizedData = this.removeMultilineComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove multiline comments from a php file" () {
        let data = fs.readFileSync(path.join(process.cwd() , 'test' , 'multiline-comments.php'), {
            encoding: 'utf8'
        })

        let shouldBe = fs.readFileSync(path.join(process.cwd() , 'test' , 'comments.php'), {
            encoding: 'utf8'
        })

        let sanitizedData = this.removeMultilineComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove all lines which start with //"() {
        let shouldBe = `{"surname" : "here","age" : 31}`
        let data = `{// "name" /* hi there */ : "da/* hi there */vid",/* hi there */\n"surname" : "here","age" : 31}`
        
        let sanitizedData = this.removeDoubleSlashComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "removes all hash comments" () {
        let data = `### This is my title\nnpm install\n# this is a comment\ncp ./* ./other-folder`
        let shouldBe = `npm install\ncp ./* ./other-folder`
        let sanitizedData = this.removeHashComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "should remove all html comments" () {
        let data = `<body><h1>Hello, world</h1><!--
        This should not be included - in the file! <h1>
        --></body>`
        let shouldBe = "<body><h1>Hello, world</h1></body>"
        let sanitizedData = this.removeHtmlComments(data)
        expect(sanitizedData).to.be.equal(shouldBe)
    }

    @test "santizing json file with comments" () {
        let data = fs.readFileSync(path.join(process.cwd() , 'test' , 'test.json'), {
            encoding: 'utf8'
        })

        let shouldBe = fs.readFileSync(path.join(process.cwd() , 'test' , 'sanitized-test.json'), {
            encoding: 'utf8'
        })
        let sanitizedData = this.jsonFile(data)
        expect(sanitizedData).to.be.equal(this.removeLinesWithOnlyWhitespace(shouldBe))
    }
}