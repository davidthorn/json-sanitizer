/// <reference path="../node_modules/mocha-typescript/globals.d.ts"/>
import {  Main } from '../src/main'
import { expect } from 'chai'

@suite('Main Test')
class MainUnitTest extends Main {

    @test "that mains message is Hello, world"() {
        expect(this.message).to.be.equal('Hello, world')
    }

}