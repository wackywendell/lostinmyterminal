$("script[type='math/tex']").replaceWith(
  function(){
    var tex = $(this).text();
    tex = tex.replace(/^%\s*<!\[CDATA\[\s*(.*?)\s*%\]\]>\s*/m,"$1");
    return "<span class=\"inline-equation\">" + 
           katex.renderToString(tex) +
           "</span>";
});

$("script[type='math/tex; mode=display']").replaceWith(
  function(){
    var tex = $(this).text();
    tex = tex.replace(/^%\s*<!\[CDATA\[\s*(.*?)\s*%\]\]>\s*/m,"$1");
    return "<div class=\"equation\">" + 
           katex.renderToString("\\displaystyle "+tex) +
           "</div>";
});

// Taken from
// https://gist.github.com/xu-cheng/cb91d3284971250cb14e#file-katex_render-js

// See post at
// https://xuc.me/blog/KaTeX-and-Jekyll/

// Added in regex replacement to handle kramdown, which adds this CDATA thing
// to deal with XHTML / HTML as a Latex comment, but katex doesn't handle
// latex comments.
// See https://groups.google.com/forum/#!topic/mathjax-users/AS6swTZzyWY
