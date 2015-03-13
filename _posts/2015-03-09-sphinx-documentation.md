---
layout: post
title: Sphinx Documentation
date:   2015-03-09 13:30:00
categories: docs
---

### Why?

Sphinx is a great tool for documenting Python, but its remarkably difficult to get started with, and (oddly enough) hard to find a good beginner's tutorial for.

## Getting Started

Run `sphinx-quickstart`, which will start you through the process, and interactively ask you questions, and make a `docs/conf.py` and a `docs/Makefile` for you. I don't remember how I answered the questions.

## Organization

I like to put docs in a `docs` folder, which is then where `sphinx-quickstart` will create a configuration file named `conf.py` and a `Makefile`. Then I like to have something like the following:

    {package-folder}
    |- README.rst
    |- docs
       |- conf.py
       |- index.rst

### Readme file: `README.rst`

This is a standard README, that will appear on the Github page **and** in the documentation index file.

It should have a few sections:

 - Description
 - Installation
 - Example usage

### Index file: `docs/index.rst`

This is the "welcome page". It has two parts: the introduction (sourced from `README.rst`), and the
Table of Contents. Here is source for it:

{% highlight reStructuredText %}
.. include:: ../README.rst

Full Contents
*************

.. toctree::
    :maxdepth: 3

    self

    example-usage

    api


Indices and tables
******************

* :ref:`genindex`
{% endhighlight %}

This will include the `README` from above, and add links to `docs/example-usage.rst` (make that yourself) and `docs/api.rst` (see below).

### API file: `docs/api.rst`

{% highlight reStructuredText %}
Reference
*********

.. automodule:: spack
    :members:
    :undoc-members:

# Include class `spack.Packing`, which is imported into the main package
.. autoclass:: spack.Packing
    :members:
    :undoc-members:
{% endhighlight %}

This will tell Sphinx to auto-generate documentation from the module.

## Generating documentation

{% highlight bash %}
cd ${PACKAGE_DIR}/docs
make html
{% endhighlight %}

Or for more options, `make help`.

### Read The Docs

You can also then use [Read the Docs](https://readthedocs.org) to host documentation; it will even pull from Github and build the documentation for you.

## Example

This was based on [spack](https://github.com/wackywendell/spack).
