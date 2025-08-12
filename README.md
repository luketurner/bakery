# bakery

A suite of opinionated utilities for building single-file executables with Bun and publishing them as releases on Github.

## Quick start

Dependencies:

- `git`
- `bun`

Release-specific:

- `gh` (Github CLI)

```bash
# Install bakery
bun add --dev git+https://github.com/luketurner/bakery.git

# Create Github actions, changelog, etc.
bun run bakery init

# Optional -- test build
bun run bakery build

# Create and publish first version
bun run bakery version 0.0.1 --push
```

## Usage

```
Usage: bakery [options] [command]

Options:
  -o, --outdir <dir>           Output directory for binaries, etc. (default: "dist")
  --changelog <changelog>      Location of changelog file (default: "CHANGELOG.md")
  -h, --help                   display help for command

Commands:
  init [options]               Set up project
  version [options] <version>  Publish a new version
  build [options]              Build single-file executable(s)
  release                      Create release in Github
  help [command]               display help for command
```

## Release builds

Release builds are compiled with the following environment changes:

- `--define RELEASE=true`
- `NODE_ENV=production`
