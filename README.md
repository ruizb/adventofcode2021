# Advent of code 2021

The purpose of this repository is to experiment with the [fp-ts](https://github.com/gcanti/fp-ts) and [vitest](https://github.com/vitest-dev/vitest) libraries.

I am not looking for achieving the best performance for each algorithm written in this repository. As long as I don't get hit by a `Maximum call stack size exceeded`, I'm good :)

I will try to write some comments and learnings for every part of the challenge, available at `src/dayX/partY/README.md` (e.g. [Day 1 part 1](src/day1/part1/README.md)).

### Requirements

This is a NOdeJS project. You can use [nvm](https://github.com/nvm-sh/nvm) to install the appropriate version, then use the following command at the root of the project:

```sh
nvm use
```

### Install

```sh
npm ci
```

### Build

```sh
npm run build
```

### Run

There are 2 ways to run a given part:

```sh
npm run build && node dist/dayX/partY
```

```sh
npx ts-node dist/dayX/partY
```

### Tests

```sh
npm test
```
