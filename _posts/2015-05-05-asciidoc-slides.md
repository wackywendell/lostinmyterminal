---
layout: post
title: Making Slides with asciidoc
date:   2015-05-05 12:00:00
categories: []
---

## Step 1: Installation

### Asciidoctor

Install [`asciidoctor`](http://asciidoctor.org/). Its available in many package managers, and also
as a Ruby gem.

### Backend

You will also need the `reveal.js` [backend](https://github.com/asciidoctor/asciidoctor-reveal.js)
for `asciidoctor`. That link includes a `README.adoc` with installation instructions.

Actually, I prefer [my version](https://github.com/wackywendell/asciidoctor-reveal.js) of the
backend, but that's me; it has a couple small tweaks to the title slide.

## Step 2: Make an `asciidoc` presentation

Here is [my
example](https://raw.githubusercontent.com/wackywendell/asciidoctor-reveal.js/gh-pages/slides.adoc).
Note that I am also using a modified [reveal.js](https://github.com/wackywendell/reveal.js), which
deals with some of the code block issues and allows tables to not have lines in them.

## Step 3: Compile your slides

{% highlight console %}
$ asciidoctor -T /path/to/asciidoctor-revealjs/templates/slim slides.doc
{% endhighlight %}

That should create a `slides.html` file with everything you need!

### Step 4 (optional): Upload to your website

I like using Github and the `gh-pages` branch system for this.