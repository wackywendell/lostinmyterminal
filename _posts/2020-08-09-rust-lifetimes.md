---
layout: post
title: Lifetimes in Rust
date:   2020-08-09 14:00:00
categories: rust
---

## Understanding Lifetimes

The concept of _lifetimes_ is central to Rust; they are what enable Rust to be

### My Definition

The _lifetime_ of an object is the set of all code paths that are guaranteed to be run between the creation of the object and its destruction.

### But... what are "code paths"?

For the purposes of this discussion, let's define three concepts[^1]:

- The _Expression Graph_: This is a graph where each expression in the code gets a node, and each function call gets an edge to the function it calls. Every function is shown only once regardless of how many times it is called.
- The _Expression Tree_: The Expression Tree has a node for every expression, and every function call in each expression gets a _separate_ node. This is similar to the expression graph, except that instead of each call to a given function linking to the same node, that function is "duplicated" and given a new node, giving a tree structure.
- The _Execution Tree_: The execution tree is a tree where every expression and function call gets a node for every time it is executed. This is similar to the expression tree, except that expressions inside e.g. `for` loops get duplicated.

#### Example Time

Let's look at [this example](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=774d7d23a7c31c5a3a90d3fa242aa246):

```rust
fn add(i: &usize) -> usize {
    1 + *i
}

fn main() {
    let x = 2;
    let y = add(&x);
    let z = add(&y);
    println!("y: {}", y);
    println!("z: {}", z);
}
```

[Expression Graph](https://excalidraw.com/#json=6245960862662656,mfYp-Q9jdBseRba8H3wCbw)

![Code Path]({{ site.baseurl }}/assets/2020-08-09-rust-code-path.png)


[Link](https://excalidraw.com/#json=5173121703215104,vw-jdcA6bq8-1XfOfKIoxw)


![Code Path]({{ site.baseurl }}/assets/2020-08-09-rust-code-path-annotated.png)

[Link with graphics](https://excalidraw.com/#json=5109671966801920,6wEa8a51rAoOaxM4n9rUXw)


[^1]: I have taken these terms from elsewhere, but have used stricter, non-overlapping definitions. There are probably more common definitions of these terms out there, but I have not seen them; I do not have a background in formal language theory. If you have better definitions or more common terms for these, please let me know!
