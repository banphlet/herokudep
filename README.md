@strellio/herokudep
====================

Simple Cli for managing heroku deployments

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@strellio/herokudep.svg)](https://npmjs.org/package/@strellio/herokudep)
[![Downloads/week](https://img.shields.io/npm/dw/@strellio/herokudep.svg)](https://npmjs.org/package/@strellio/herokudep)
[![License](https://img.shields.io/npm/l/@strellio/herokudep.svg)](https://github.com/banphlet/herokudep/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @strellio/herokudep
$ herokudep COMMAND
running command...
$ herokudep (-v|--version|version)
@strellio/herokudep/0.0.0 darwin-x64 node-v8.16.1
$ herokudep --help [COMMAND]
USAGE
  $ herokudep COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`herokudep deploy`](#herokudep-deploy)
* [`herokudep help [COMMAND]`](#herokudep-help-command)

## `herokudep deploy`

Deploy heroku applications using one command

```
USAGE
  $ herokudep deploy

OPTIONS
  -a, --app=app        (required) app to run command against
  -a, --token=token    (required) Heroku api token
  -h, --help           show CLI help
  -r, --remote=remote  git remote of app to use
  -v, --version        show CLI version
```

_See code: [src/commands/deploy.ts](https://github.com/banphlet/heroku-dep/blob/v0.0.0/src/commands/deploy.ts)_

## `herokudep help [COMMAND]`

display help for herokudep

```
USAGE
  $ herokudep help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
