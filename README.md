# bakery

A suite of opinionated utilities for building single-file executables with Bun and publishing them as releases on Github:

- `bakery init` -- Scaffold a Github action pipeline and CHANGELOG.md into an existing project.
- `bakery version` -- automates the process of publishing a new version -- editing changelog, bumping package.json, creating tags, etc.
- `bakery build` -- Builds one or more single-file executables and compresses them into archives ready for release.
- `bakery release` -- Creates a Github release with assets created by `bakery build`.
- `bakery publish` -- Publishes the package to the NPM registry.

Note that `bakery build`, `bakery release`, and `bakery publish` can be run locally, but in the standard workflow these run in a Github action (automatically created by `bakery init`).

## Quick start

Dependencies:

- `git`
- `bun`

Release-specific:

- `gh` (Github CLI)

```bash
# Install bakery and init
bun add --dev @luketurner/bakery
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
  publish [options]            Publish package to NPM
  help [command]               display help for command
```

## Release builds

Release builds are compiled with the following environment changes:

- `--define RELEASE=true`
- `NODE_ENV=production`
