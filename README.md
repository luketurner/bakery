# bakery

A suite of opinionated utilities for building single-file executables with Bun and publishing them as releases on Github.

## Usage

Quickstart:

```bash
bakery init          # Adds Github action and other scaffolding
bakery version minor # create a new minor version and publish to Github
```

Extended usage:

```
Usage: bakery [options] [command]

Options:
  -o, --outdir <dir>       Output directory for binaries, etc. (default: "dist")
  --changelog <changelog>  Location of changelog file (default: "CHANGELOG.md")
  -h, --help               display help for command

Commands:
  init [options]           Set up project
  version <version>        Publish a new version
  build [options]          Build single-file executable(s)
  release                  Create release in Github
  help [command]           display help for command
```

## Installation

Dependencies:

- `git`
- `bun`

Release-specific:

- `gh` (Github CLI)
