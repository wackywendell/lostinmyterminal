# My website

## Setup

This is built with [Jekyll](https://jekyllrb.com/), and served from Github Pages. Technically, you do not need jekyll installed to commit and build - Github will build it on their side. However, it is useful to have locally for viewing unfinished pieces.

```sh
$ brew install rbenv   # Or whichever package manager you use
$ eval $(rbenv init -)  # You may want this in your .bashrc
$ rbenv install 2.7.1
$ gem install bundler jekyll
```

## Local Serving

```sh
$ eval $(rbenv init -)  # If this isn't already in your .bashrc
$ jekyll serve
```

## Publishing

To publish, simply push to the `published` branch:

```sh
$ git push origin master:master  # Just to make sure remote master is up to date too
$ git push origin master:published  # To publish
```
