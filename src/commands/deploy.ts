#!/usr/bin/env node

import { Command, flags } from "@heroku-cli/command"
import * as Heroku from '@heroku-cli/schema'
const debug = require("debug")("@strellio/dep-heroku")
const simpleGit = require("simple-git/promise")().outputHandler((_: any, stdout: any, stderr: any) => {
  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
})
import { formHerokuGitUrl } from "../../utils";
import { checkApplicationHealth, rollbackDeployment } from "../../utils";



class StrellioDepHeroku extends Command {
  static description = 'Deploy heroku applications using one command'

  static flags = {
    // add --version flag to shocw CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    remote: flags.remote(),
    app: flags.app({ required: true }),
    token: flags.app({ required: true, description: "Heroku api token" })
  }

  rollbackDeployment = async (error: any) => {
    const { flags } = this.parse(StrellioDepHeroku)
    this.warn(`Deployment failed with statusCode ${error.statusCode}.Rolling back`)
    await rollbackDeployment(this.heroku, flags.app)
    this.log("rollback completed")
  }

  async run() {
    const { flags } = this.parse(StrellioDepHeroku)
    process.env.HEROKU_API_KEY = flags.token
    debug("Testing heroku api key")
    await this.heroku.get<Heroku.App>(`/apps/${flags.app}`).catch(() => this.error("Invalid HEROKU_API_KEY"))

    debug("Deploying heroku application")
    const isGitRepo = await simpleGit.checkIsRepo()
    if (!isGitRepo) return this.error("Git not initialized.")

    debug("Push to heroku master")
    this.log("Deploying to application")
    await simpleGit.push(formHerokuGitUrl(flags.token, flags.app), "master").catch((error: any) => this.error(`Error pushing to heroku ${error.message}`))
    return checkApplicationHealth(flags.app).then(() => this.log("Deployment to heroku succeeded :)")).catch(this.rollbackDeployment)
  }
}

export = StrellioDepHeroku
