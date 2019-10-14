#!/usr/bin/env node
const debug = require('debug')('@strellio/dep-heroku')
import { Command, flags } from '@heroku-cli/command'
import * as git from 'simple-git/promise'

import { parseString, readServicesJson, writeFile } from '../utils'

import Deploy from './deploy'

const simpleGit = git().outputHandler((_: any, stdout: any, stderr: any) => {
  stdout.pipe(process.stdout)
  stderr.pipe(process.stderr)
})

interface AppsInterface {
  name: string,
  web?: string,
  release?: string,
  worker?: string
}

export default class Start extends Command {
  static description = 'Deploy multiple services to different heroku apps.  Requires you have services.json in the root of your application '
  static examples = [
    '$ herokudep -t heroku token'
  ]
  static flags = {
    // add --version flag to shocw CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    token: flags.app({ char: 't', required: true, description: 'Heroku api token' })
  }

  async run() {
    const { flags } = this.parse(Start)
    debug('Reading services.json file')
    const servicesJson = await readServicesJson(this.error)
    if (!servicesJson) return this.error('services.json cannot be empty')
    const json = parseString(servicesJson)

    if (!json.apps || !json.apps.length) return this.error('apps in service.json cannot be empty')
    const apps: Array<AppsInterface> = json.apps
    for (const app of apps) {
      this.log(`Processing service with name ${app.name}`)
      let profileCommands = ''
      if (app.web) profileCommands += `web: ${app.web} \n`
      if (app.release) profileCommands += `release: ${app.release}`
      if (app.worker) profileCommands += `worker: ${app.worker}`
      writeFile(profileCommands)
      await simpleGit.raw(['config', 'user.email', 'herokudep@herokuap.com'])
      await simpleGit.raw(['config', 'user.name', 'herokudep'])
      await simpleGit.add('Procfile')
      await simpleGit.raw(['commit', '--amend', '--no-edit'])
      await Deploy.run([`-a ${app.name}`, `-t ${flags.token} `])
    }

  }
}
