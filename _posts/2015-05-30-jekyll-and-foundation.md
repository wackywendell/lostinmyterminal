---
layout: post
title: Jekyll and Foundation
date:   2015-05-30 20:00:00
categories: []
---

When I decided to give this site a new look, I decided that I wanted to use a real web frontend
framework. There are certainly plenty to choose from: Bootstrap, Semantic UI, Foundation, etc. I
chose Foundation, for no particular reason. The question, though: How do you integrate Foundation
with Jekyll?

Let's back up a bit, and talk about the two components involved.

## How Jekyll Works

1. Jekyll looks in your `css` folder, and compiles all the `.sass` and `.scss` files into regular
old `.css` files.
2. Jekyll goes through any pages named `*.html` or `*.md` in your main folder, and anything named
`_posts/*.md` or `_posts/*.html`, fills in the template, and spits out regular `.html` files.
3. These `html` files have some sort of tag like `<link rel="stylesheet" href="/css/main.css">` that
references the CSS files created above, so when you load `index.html` it will use that CSS.

This is a gross simplification (and I don't pretend to know all the details), but its the basic
idea.

## How Foundation Works (Sass installation)

If you installed Foundation the [Sass way](http://foundation.zurb.com/docs/sass.html), it works like
so:

1. You put the right Foundation `*.scss`, `*.sass`, and `*.js` files in the right directories. If
you start by running `foundation new MyProjectName` like [the
docs](http://foundation.zurb.com/docs/sass.html) tell you to, they will already be in the right
place.
2. You use  Compass or the combination of Grunt and Libsass to compile *your* settings along with
the Foundation Sass files into CSS files.
3. You link to the Foundation CSS files in your HTML files.

## Combining Jekyll and Foundation

The problem here is that we now have *two* Sass compilation steps, which, of course, is unnecessary.
Wouldn't it be nice if we could just have Jekyll compile the Foundation Sass files? Well, of course,
we can. Its really easy, once you know how to put things together.

This all assumes that you can manage to install the basic tools on your own: Jekyll, Gem, Bower,
etc. Some you will need, others you won't, depending on how you do things.

#### Start with a Jekyll site

If necessary, create one with `jekyll new`.

#### Install the Foundation files

There are two ways to install the Foundation files into your Jekyll site

1. Use `bower install foundation` to just copy in the CSS and Javascript files

2. Use `foundation new NewFolderName` to make an entirely folder, and then copy `bower_components`
to your Jekyll folder. This gives you more stuff, which is partly annoying, because you'll need to
delete most of it, and partly nice, because now you can see a nice list of how to include links to
the stylesheet and things like that.

I went with the second way, although I hope that with this guide, the first might be perfectly
manageable.

#### Link to the Foundation Sass files

Now we need the Jekyll Sass files to link to the Foundation ones, so that Jekyll will compile the
Foundation Sass files into its own CSS.

1. Copy `{FoundationProject}/scss/_settings.css` into `{JekyllProject}/_sass/_settings.scss`

2. Change `{JekyllProject}/_sass/_settings.scss` and `{JekyllProject}/css/main.scss` to correctly
import Foundation.

I did that in [this
commit](https://github.com/wackywendell/wackywendell.github.io/commit/6222047960d1b07480f3d29d68e3158b0bc87fec).

The relevant lines:

{% highlight sass %}
// _sass/_settings.scss
@import '../bower_components/foundation/scss/foundation/functions';

// css/main.css
@import "../bower_components/foundation/scss/foundation";
{% endhighlight %}

#### Javascript

If you want the Foundation Javascript, you will need to link to it from your pages:

{% highlight html %}
<head>
  [...]
  <script src="bower_components/modernizr/modernizr.js"></script>
</head>
<body>
  [...]
  <script src="bower_components/jquery/dist/jquery.min.js"></script>
  <script src="bower_components/foundation/js/foundation.min.js"></script>
  <script src="js/app.js"></script>
</body>
{% endhighlight %}

All of that I took directly from the `foundation new` `index.html` file.

#### No Javascript

If you're not using the Javascript (I'm not!), then you might want to add `exclude:
['bower_components']` to your `_config.yml`, to tell Jekyll to *not* include the entire
`bower_components` file on your server. Its not necessary; you don't need the javascript, and all
the Sass will be compiled into CSS that will be on your site.

#### Fix your Sass Mess

At this point, it should be "working": if you run `jekyll build` (or `jekyll serve`), it should
compile Foundation into CSS files that your main files will link to.

Unfortunately, a vanilla Jekyll site (or whatever CSS you had before this) probably included a lot
of CSS that doesn't play well with the Foundation CSS. That's OK, it just needs some cleaning up. I
ended up throwing out all of `_sass/_layout.scss`, and most of `_base.scss`; what I kept had to do
with `<pre>`, `<code>`, and syntax-highlighting CSS that Foundation wasn't handling correctly. I
also had to fix it a bit.

You are, of course, welcome to use my setup - it even works well with compilation by Github pages.
All the code for this site is available
[here](https://github.com/wackywendell/wackywendell.github.io/tree/main), with [this
commit](https://github.com/wackywendell/wackywendell.github.io/commit/da0f21ca98897bb4d6c827f69dc572145c1daf8a)
current at the time of this post.
