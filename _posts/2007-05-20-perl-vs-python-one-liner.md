---
layout: post
title:  "Perl vs. Python One-Liner"
date:   2007-05-20 01:00:00
excerpt: "A code puzzle"
categories: Puzzles
tags:  Coding Puzzles
image:
  feature: python.jpg
  topPosition: -100px
bgContrast: light
bgGradientOpacity: lighter
syntaxHighlighter: yes
---
A few years ago a friend of mine asked me the following Perl riddle. Unfortunately, in order to solve it you must know Perl. As I like Python much better, I translated the riddle to Python. Attached are both versions.

I admit the Perl version is a bit more cryptic and if you know both Perl and Python you should try to solve the Perl version (but use Python for everything else in life :-) ).

Oh, and try to solve the riddle without running it (run it only as a last resort).

#### Perl Version

![Perl Logo](/assets/images/posts/perl.png)

```shell
perl -wle 'print "True" if (1 x shift) !~ /^1?$|^(11+?)\1+$/' [number]
```

#### Python Version

![Python Logo](/assets/images/posts/python.png)

```shell
python -c "import sys, re; print None == re.match('^1?$|^(11+?)\\1+$','1'*int(sys.argv[1]))" [number]
```

To alleviate all doubt – [number] denotes a numeric command line argument (e.g. 17).