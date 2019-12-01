---
layout: post
title:  "Perl vs. Python One-Liner"
date:   2007-05-20 01:00:00
excerpt: "A code puzzle"
categories: Puzzle
tags:  Coding Puzzles
image:
  feature: python.jpg
  topPosition: -300px
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: yes
---
A few years ago a friend of mine asked me the following Perl riddle. Unfortunately, in order to solve it you must know Perl. As I like Python much better, I translated the riddle to Python. Attached are both versions.

I admit the Perl version is a bit more cryptic and if you know both Perl and Python you should try to solve the Perl version (but use Python for everything else in life :-) ).

Oh, and try to solve the riddle without running it (run it only as a last resort).

#### Perl Version

```perl
perl -wle 'print "True" if (1 x shift) !~ /^1?$|^(11+?)\1+$/' [number]
```

#### Python Version

```python
python -c "import sys, re; print None == re.match('^1?$|^(11+?)\\1+$','1'*int(sys.argv[1]))" [number]
```

To alleviate all doubt – [number] denotes a numeric command line argument (e.g. 17).

## Spoiler Alert - Solution Ahead!

So let's dissect the Perl version (the python one is very similar). Let's start by considering the high level structure of this one liner:

```perl
perl -wle 'print "True" if (1 x shift) !~ /.../' [number]
```
We are taking the number argument, creating a string containing only "1"s of length that number and comparing it to a regular expression (RE). We will print "True" only if it doesn't match the regular expression.

What is the regular expression? Let's have a closer look:
```regex
/^1?$|^(11+?)\1+$/
```
We are ORing ('|') two REs. The first one matches the empty string or the string that is just "1". So we will **not** print "True" if our *number* is 0 or 1. The second RE, looks for a string, call it $$S_k$$ of length k ($$k \ge 2$$) consisting only of "1"s, and matches if we can cover the entirety of the original string, with copies of $$S_k$$. Did you get it? This is (an extremely inefficient) one-line prime number detector!
