---
layout: post
title:  "Math Support in Jekyll"
date:   2015-01-09 13:00:00
categories: webpages
---

Getting equations in Jekyll is not hard, but it was annoying to figure out how to do it. Many things come up when you search, but most are outdated. Here's what worked for me.

## Enabling MathJax

I added the following to my `_includes/head.html`:

{% highlight html %}

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$', '$'], ["\\(", "\\)"] ],
      displayMath: [ ['$$', '$$'], ["\\[", "\\]"] ],
      processEscapes: true,
      skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    }
    //,
    //displayAlign: "left",
    //displayIndent: "2em"
  });
</script>
<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML" type="text/javascript"></script>

{% endhighlight %}

That's it.

## Using Latex

Then you need **TWO** dollar signs for most Latex, to keep `kramdown` from messing with it. Inline works like normal (i.e., normal except for the two-dollar-sign thing), and display equations are automatic if they are on their own line.

## Example Markdown

    Some inline Latex: $$a^2 + b^2 = c^2$$

Some inline Latex: $$a^2 + b^2 = c^2$$

    Display equation:

    $$\int e^{-kx} \, dx = -\frac{1}{k} e^{-kx}$$

Display equation:

$$\int e^{-kx} \, dx = -\frac{1}{k} e^{-kx}$$