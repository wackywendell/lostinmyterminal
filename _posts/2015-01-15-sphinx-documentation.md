---
layout: post
title: Sphinx Documentation
published: false
date:   2015-01-15 13:08:23
categories: []
---

# Using Sphinx

### Why?

Sphinx is a great tool for documenting Python, but its remarkably difficult to get started with, and (hypocritically?) badly documented.

## Getting Started

Run `sphinx-quickstart`, which will start you through the process, and interactively ask you questions, and make a `docs/conf.py` and a `docs/Makefile` for you. I don't remember how I answered the questions.

## Organization

I like to put docs in a `docs` folder, which is then where `sphinx-quickstart` will create a configuration file named `conf.py` and a `Makefile`. Then I like to have something like the following:

```
{package-folder}
|- README.rst
|- docs
   |- conf.py
   |- index.rst
```

### Readme file: `README.rst`

This is a standard README, that will appear on the Github page **and** in the documentation index file.

It should have a few sections:

 - Description
 - Installation
 - Example usage

### Index file: `docs/index.rst`

```reStructuredText
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

```

This will include the `README` from above, and add links to `docs/example-usage.rst` (make that yourself) and `docs/api.rst` (see below).

### API file: `docs/api.rst`

```reStructuredText
Reference
*********

.. automodule:: spack
    :members:
    :undoc-members:

.. autoclass:: spack.Packing
    :members:
    :undoc-members:
```

This will tell Sphinx to auto-generate documentation from the module.

## Generating documentation

```bash
cd ${PACKAGE_DIR}/docs
make html
```

Or for more options, `make help`.

### Read The Docs

You can also then use [Read the Docs](https://readthedocs.org) to host documentation; it will even pull from Github and build the documentation for you.

## Example

This was based on `https://github.com/wackywendell/spack`.
