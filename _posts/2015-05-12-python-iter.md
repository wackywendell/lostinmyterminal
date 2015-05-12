---
layout: post
title: Making an Iterable in Python
date:   2015-05-12 09:00:00
categories: python
---

# Making an Iterable in Python

How do you make a new class work in a for loop?

More specifically:

{% highlight python %}
class MyClass(object):
    [...]
    
myobj = MyClass()
for x in myobj:
    print(x)
{% endhighlight %}

What do I need to put in the `[...]` to make that work?

## `__iter__` and `__next__`

This is the most obvious answer: implement `__iter__(self)` and `__next__(self)` (or just
`next(self)` in Python 2), to fulfill the [iterator
protocol](https://docs.python.org/3/library/stdtypes.html#iterator-types).

For example:

{% highlight python %}
class TestClass(object):
    def __init__(self, N):
        self.N = N + 1
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.N <= 1:
            # StopIteration is an Exception, but with a specific meaning:
            # it means "nothing left in this iterator, end the for loop"
            raise StopIteration
        
        self.N -= 1
        return str(self.N) + '!'
{% endhighlight %}

Running this works like we wanted:

{% highlight python %}
>>> t = TestClass(3)
>>> for n in t:
...    print(n)
...
3!
2!
1!
{% endhighlight %}

This will also work anywhere an iterable is needed:

{% highlight python %}
>>> t = TestClass(3)
>>> list(t)
['3!', '2!', '1!']
{% endhighlight %}

Note also that we are *changing* the object on every iteration, so we need a new object every time:

{% highlight python %}
>>> t = TestClass(3)
>>> list(t)
['3!', '2!', '1!']
>>> list(t)
[]
{% endhighlight %}

In some cases, that will be expected; in others, that will be a surprising annoyance.

This is the most straight-forward method, in the sense that it most obviously fulfills the needs of
the iterator protocol, but it is also not the only method, or in most cases the simplest to write.

## `__iter__` as a generator

We can also implement `__iter__` in such a way that it returns a generator, just by using the
`yield` keyword. If you're not familiar with Python generators, go look them up! They're often
useful! If you are, then you will not be surprised by the code below:

{% highlight python %}
class TestClass(object):
    def __init__(self, N):
        self.N = N
    
    def __iter__(self):
        for i in range(self.N):
            yield str(self.N - i) + '!'
{% endhighlight %}

That's much simpler code, more "Pythonic", in my mind, and even has the added advantage that you can
reuse the same object; `self.N` doesn't change when you iterate. Of course, this may not be an 
advantage, depending on what you're using it for, but if you can do it that way, its pretty nice!

## `__len__` and `__getitem__`

I just learned this from a [Raymond Hettinger talk](https://www.youtube.com/watch?v=wf-BqAjZb8M), 
but apparently, if you implement `__len__` and `__getitem__`, you get iteration for free:

{% highlight python %}
class TestClass(object):
    def __init__(self, N):
        self.N = N
    
    def __len__(self):
        return self.N
    
    def __getitem__(self, index):
        if index >= len(self):
            raise IndexError
        return str(self.N - index) + '!'
{% endhighlight %}

This is longer than the ones above, but unlike them, you're also getting indexing (`obj[i]`) and a
`len` method (`len(obj)`). If you're wrapping a protocol from some other language like C or Java,
where you access things with some `getSize()` method and a `get(float index)` method, this is
clearly the way to go.

## `__iter__` and `__next__` with another class

This is the "long way", which everything else here is in some way a shortcut to:

{% highlight python %}
class TestClass(object):
    def __init__(self, N):
        self.N = N

    def __iter__(self):
        return TestIter(self.N)


class TestIter(object):
    def __init__(self, N):
        self.N = N + 1
    
    def __iter__(self):
        return self

    def __next__(self):
        if self.N <= 1:
            raise StopIteration

        self.N -= 1
        return str(self.N) + '!'
{% endhighlight %}

This works exactly the same as the ones above, and its reusable. Our first two methods are
"shortened" forms of this: the first method uses the same class for `TestClass` and `TestIter`, the
second uses a generator to produce its `TestIter` iterator, and the third... well, the third is more
magic than I understand. [PEP 234](https://www.python.org/dev/peps/pep-0234/) clearly states that
you can do this, but I don't understand how it works internally.