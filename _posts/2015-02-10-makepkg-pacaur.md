---
layout: post
title:  "Customizing AUR Packages"
date:   2015-02-10 11:00:00
categories: linux
---

Sometimes, you want to customize an AUR package (for Arch Linux), but its hard to figure out how to get it working. Here's how I do it, using VMD as an example.

## Download the package locally

{% highlight console %}
$ mkdir -p ~/pkg
$ cd ~/pkg
$ pacaur -d vmd
{% endhighlight %}

## Make necessary changes

What happens here is up to you. Here is the VMD example:

{% highlight console %}
$ cd vmd
$ mv ~/Downloads/vmd-1.9.2.bin.LINUXAMD64.opengl.tar.gz .
{% endhighlight %}

## Make and install the package

This will compile and install the package, calling `sudo` as necessary:

{% highlight console %}
$ makepkg -i
{% endhighlight %}
