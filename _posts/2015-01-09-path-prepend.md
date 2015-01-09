---
layout: post
title:  "Appending and Prepending to the PATH Variable"
date:   2015-01-09 12:00:00
categories: shell bashrc PATH
---

I often want to add paths to my `$PATH` variable.

It's nice to do this with functions (in your `.zshrc` or `.bashrc` file):

{% highlight bash %}
pathappend () {
    if [ -d "$1" ] && [[ ":$PATH:" != *":$1:"* ]]; then
        PATH="${PATH:+"$PATH:"}$1"
    fi
}

pathprepend () {
    if [ -d "$1" ] && [[ ":$PATH:" != *":$1:"* ]]; then
        PATH="$1${PATH:+":$PATH"}"
    fi
}

{% endhighlight %}

These will check if *a)* the directory exists and *b)* it isn't already in your `$PATH`, and then either append or prepend the path into your `$PATH` variable.

Then you can put things like this in:

{% highlight bash %}
pathprepend $HOME/.local/bin
pathappend $HOME/code/bin
{% endhighlight %}

And if you execute your `.bashrc` or `.zshrc` multiple times, your `$PATH` won't grow.

*Note:* The functions above come almost directly from a [superuser](http://superuser.com/questions/39751/add-directory-to-path-if-its-not-already-there) post.