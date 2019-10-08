#!/usr/bin/env node

import { Command, flags } from "@heroku-cli/command"
import * as Heroku from '@heroku-cli/schema'
const debug = require("debug")("@strellio/dep-heroku")
import * as git from 'simple-git/promise';
import { trim } from 'lodash'


const simpleGit = git().outputHandler((_: any, stdout: any, stderr: any) => {
  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
})


import { formHerokuGitUrl } from "../utils";
import { checkApplicationHealth, rollbackDeployment } from "../utils";



export default class Deploy extends Command {
  static description = 'Deploy heroku applications using one command'

  static flags = {
    // add --version flag to shocw CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    remote: flags.remote(),
    app: flags.app({ char: "a", required: true }),
    token: flags.app({ char: "t", required: true, description: "Heroku api token" })
  }

  rollbackDeployment = async (error: any) => {
    const { flags } = this.parse(Deploy)
    const app = trim(flags.app)
    this.warn(`Deployment failed with statusCode ${error.statusCode}.Rolling back`)
    await rollbackDeployment(this.heroku, app)
    this.log("rollback completed")
  }

  async run() {
    const { flags } = this.parse(Deploy)
    const token = trim(flags.token)
    process.env.HEROKU_API_KEY = token
    const app = trim(flags.app)
    debug("Testing heroku api key")
    await this.heroku.get<Heroku.App>(`/apps/${app}`).catch((e: any) => {
      const error = e.body
      this.error(error.message)
    })

    debug("Deploying heroku application")
    const isGitRepo = await simpleGit.checkIsRepo()
    if (!isGitRepo) return this.error("Git not initialized.")

    debug("Push to heroku master")
    this.log("Deploying to application")
    await simpleGit.push(formHerokuGitUrl(token, app), "master").catch((error: any) => this.error(`Error pushing to heroku ${error.message}`))
    return checkApplicationHealth(app).then(() => this.log("Deployment to heroku succeeded :)")).catch(this.rollbackDeployment)
  }
}