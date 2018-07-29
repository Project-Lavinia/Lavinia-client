# Contributing

It is important that there are conventions and simple guidelines in place to avoid confusion about what is and is not the right way of doing things. This guide is subject to change, but will generally be updated rarely and only after proper discussion.

## Table of contents

-   [Who can contribute?](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#who-can-contribute)
-   [General guidelines](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#general-guidelines)
    -   [Issues](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#issues)
    -   [Commits](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#commits)
    -   [Merge requests](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#merge-requests)
    -   [Code reviews](https://github.com/Project-Lavinia/Lavinia-client/new/add-contributing#code-reviews)

## Who can contribute?

Anyone can contribute! This is an open source repository that happily accepts feedback, suggestions, fixes and code. It is however important to organize things sensibly, so you are expected to follow the guidelines in this document.

## General guidelines

### Issues

Look for an appropriate issue template, follow it, and assign a relevant team or person(s).

### Commits

Try to keep commits as brief as possible. The convention for the project is very much like a simple version of [Karma's](http://karma-runner.github.io/2.0/dev/git-commit-msg.html) system. This allows us to create automated change logs in the future, and we have easily readable git logs.

Use imperative form on the subject line of the commit message. The last line can describe which issues (from the Issues board) the pull request intend on closing, giving further context to whoever is reviewing the commit.

In general you want to avoid explaining something that your code explains well enough as it is! Keep them at a length that does not end up being truncated in GitHub, and if further explanation is required, write on the next line.

```
fix: Replace wonky CSS

There was some wonky CSS that made the site less responsive than intended.
```

### Pull requests

These should always follow the convention of including references to which issues they are dealing with. As a main rule of thumb, every pull request requires at least one passing code review.

It is recommended to use similar style for pull requests as commits (fix/feat/docs) to more easily identify the primary goal of the pull request.

Reference fixing/closing issues at the final line of the pull request message or in the description. In GitHub there is autocompletion for looking up relevant issues in the repository you are working in.

### Code reviews

Code reviews are great, not only because they help reduce bugs and allow input from fellow contributors, but because the people doing the code reviews get up to date on what's going on, even if they have no comments for the code itself.

For the coders having their code reviewed, it is important to remember that criticism is not personal. Everyone's code needs improvement. It's easy to forget things, and a fresh pair of eyes always have a different and useful perspective for the problem(s) you are trying to solve.

For the reviewers, it is important to keep code reviews _constructive_. With GitHub it is easy to use markdown, code blocks and references to give great feedback.

If in doubt about how to submit or give a code review, look at earlier examples from merge requests!

## Repository-specific

This repository is equipped with fairly useful tooling that reduces the time spent on fixing style and various other annoyances. Before every commit is made, Prettier runs on any staged files, as well as TSLint. If TSLint fails, your commit will not be permitted, and you will have to fix any complaint TSLint has.

There is a configuration file in the repository that deals with what rules are automatically enforced. Formatting is left entirely to Prettier.

## Clean code

The entire project aspires to having clean code. That is to say clear, useful abstractions, and self-documenting code to the degree that is possible. Many functions with logical abstractions are preferred to one enormous function. No part of code should take more than a few seconds to read, and it should be clear where to go for further details.

As it can be difficult to keep track of these things over time, code cleanups are scheduled regularly and are prioritized to maintain productivity. Messy code is slow to read, slow to fix, impossible to test and prone to bugs!
