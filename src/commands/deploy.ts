#!/usr/bin/env node

import { Command, flags } from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
// tslint:disable-next-line
import { trim } from 'lodash'
import * as git from 'simple-git/promise'

import { checkApplicationHealth, formHerokuGitUrl, rollbackDeployment } from '../utils'
const debug = require('debug')('@strellio/dep-heroku')

const simpleGit = git().outputHandler((_: any, stdout: any, stderr: any) => {
  stdout.pipe(process.stdout)
  stderr.pipe(process.stderr)
})

export default class Deploy extends Command {
  static description = 'Deploy heroku applications using one command.'
  static examples = [
    '$ herokudep deploy -t heroku-token -a heroku-app',
    '$ herokudep deploy -t heroku-token -a heroku-app -s // pass -s to skip checking application health'
  ]

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    app: flags.app({ char: 'a', required: true }),
    token: flags.app({ char: 't', required: true, description: 'Heroku api token' }),
    skipHealthCheck: flags.app({ char: "s", default: "false", description: "Skip checking /health endpoint for application health status" })
  }

  rollbackDeployment = async (error: any) => {
    const { flags } = this.parse(Deploy)
    const app = trim(flags.app)
    this.warn(`Deployment failed with statusCode ${error.statusCode}.Rolling back`)
    await rollbackDeployment(this.heroku, app)
    this.log('rollback completed')
  }

  async run() {
    const { flags } = this.parse(Deploy)
    const token = trim(flags.token)
    process.env.HEROKU_API_KEY = token
    const app = trim(flags.app)
    debug('Testing heroku api key')
    await this.heroku.get<Heroku.App>(`/apps/${app}`).catch((e: any) => {
      const error = e.body
      this.error(error.message)
    })

    debug('Deploying heroku application')
    const isGitRepo = await simpleGit.checkIsRepo()
    if (!isGitRepo) return this.error('Git not initialized.')

    debug('Push to heroku master')
    this.log('Deploying heroku application')
    await simpleGit.push(formHerokuGitUrl(token, app), 'master', { '--force': true }).catch((error: any) => this.error(`Error pushing to heroku ${error.message}`))
    if (flags.skipHealthCheck) return this.log('Deployment to heroku succeeded :)')

    return checkApplicationHealth(app).then(() => this.log('Deployment to heroku succeeded :)')).catch(this.rollbackDeployment)
  }
}
