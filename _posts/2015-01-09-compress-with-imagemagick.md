---
layout: post
title:  "Compressing EPS files with ImageMagick"
date:   2015-01-09 11:00:00
categories: image compression imagemagick convert shell
---

Sometimes I find I have a `.eps` file that is taking up 20 Mb of space despite being only 200x200 or something. Here's a command to enable compression:

{% highlight console %}
$ convert $inFILE -compress lzw eps2:$OUTFILE
{% endhighlight %}

I believe that's lossless compression. In a recent case, that took an image from 1.6 Mb to about 200 kb, which is usually more than enough. To compress even more, you can use `-resize`:

{% highlight console %}
$ convert $inFILE -compress lzw -resize 50% eps2:$OUTFILE
{% endhighlight %}