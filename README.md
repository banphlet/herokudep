@banphlet/herokudep
====================

Simple Cli for managing heroku deployments

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@banphlet/herokudep.svg)](https://npmjs.org/package/@banphlet/herokudep)
[![Downloads/week](https://img.shields.io/npm/dw/@banphlet/herokudep.svg)](https://npmjs.org/package/@banphlet/herokudep)
[![License](https://img.shields.io/npm/l/@banphlet/herokudep.svg)](https://github.com/banphlet/herokudep/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @banphlet/herokudep
$ herokudep COMMAND
running command...
$ herokudep (-v|--version|version)
@banphlet/herokudep/0.0.3 darwin-x64 node-v8.16.1
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
* [`herokudep start`](#herokudep-start)

## `herokudep deploy`

Deploy heroku applications using one command

```
USAGE
  $ herokudep deploy

OPTIONS
  -a, --app=app        (required) app to run command against
  -h, --help           show CLI help
  -r, --remote=remote  git remote of app to use
  -t, --token=token    (required) Heroku api token
  -v, --version        show CLI version
```

_See code: [src/commands/deploy.ts](https://github.com/banphlet/strellio-herokudep/blob/v0.0.3/src/commands/deploy.ts)_

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

## `herokudep start`

Deploy services to different apps on heroku

```
USAGE
  $ herokudep start

OPTIONS
  -h, --help         show CLI help
  -t, --token=token  (required) Heroku api token
  -v, --version      show CLI version
```

_See code: [src/commands/start.ts](https://github.com/banphlet/strellio-herokudep/blob/v0.0.3/src/commands/start.ts)_
<!-- commandsstop -->
