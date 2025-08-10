# bun-release-utils

A suite of utilities for building and publishing single-file executables with Bun.

## Usage

```
Usage: bun-release-utils [options] [command]

Options:
  -o, --outdir <dir>       Output directory for binaries, etc. (default: "dist")
  --changelog <changelog>  Location of changelog file (default: "CHANGELOG.md")
  -h, --help               display help for command

Commands:
  version <version>        Publish a new version
  build [options]          Build single-file executable(s)
  release                  Create release in Github
  help [command]           display help for command
```
