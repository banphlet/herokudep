#!/usr/bin/env node

import { Command, flags } from "@heroku-cli/command"
const debug = require("debug")("@strellio/dep-heroku")
import * as git from 'simple-git/promise';

const simpleGit = git().outputHandler((_: any, stdout: any, stderr: any) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
})
import { readServicesJson, parseString, writeFile } from "../utils";



class Start extends Command {
    static description = 'Deploy services to different apps on heroku'

    static flags = {
        // add --version flag to shocw CLI version
        version: flags.version({ char: 'v' }),
        help: flags.help({ char: 'h' }),
        token: flags.app({ char: "t", required: true, description: "Heroku api token" })
    }


    async run() {
        const { flags } = this.parse(Start)
        debug("Reading services.json file")
        const servicesJson = await readServicesJson(this.error)
        if (!servicesJson) return this.error("services.json cannot be empty")
        const json = parseString(servicesJson)

        if (!json.apps || !json.apps.length) return this.error("apps in service.json cannot be empty")
        const apps = json.apps
        for (const app of apps) {
            let profileCommands = ''
            if (app.web) profileCommands += `web: ${app.web} \n`
            if (app.release) profileCommands += `release: ${app.release}`
            writeFile(profileCommands)

            await simpleGit.raw(["commit", "--amend", "--no-edit"])

            console.log(profileCommands)
        }

    }
}

export = Start