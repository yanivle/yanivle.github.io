---
layout: post
title:  "Set it Straight!"
date:   2007-10-31 01:00:00
excerpt: "A post on the necessity or uselessness of the axiom of choice"
categories: Math
tags:  Math Logic Axiom-of-Choice
image:
  feature: choice.jpg
  topPosition: -100
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---
In this post I will give a basic example of the necessity (or uselessness - its up to you to choose - pun intended) of the *Axiom of Choice*. I will also present a less known proof of the *Cantor-Bernstein-Schroeder theorem*.

### The Cantor-Bernstein-Schroeder Theorem
Let A and B be sets. Let $$f:A \rightarrow B$$ and $$g:B \rightarrow A$$ be injective functions. Then there exists a bijection $$h:A \rightarrow B$$.

In order to proof the theorem, lets consider the following definition:

A function $$f:P(A) \rightarrow P(A)$$ is called *monotonic* if $$\forall X, Y \subset P(A), X \subset Y \implies f(X) \subset f(Y)$$.

#### Lemma 1
Every monotonic function $$f:P(A) \rightarrow P(A)$$ has a fixed point, i.e. a set $$X \subset P(A)$$ such that $$f(X) = X$$. (The proof of this lemma is very simple, if you have the time, try to prove it yourself before reading on).

#### Proof of Lemma 1
Let T be the set $$\{ X | F(X) \subset X \}$$. Then T is not empty (as A is in T). Let S be the intersection of all the elements of T (it exists as T is not empty). Then since S is contained in all X in T, F(S) is contained in F(X) for all X in T (by the monotonicity of F). But, by the very definition of T, F(X) is contained in X for all X in T, so F(S) is contained in X for all X in T, so F(S) is contained in the intersection of all the elements of T, so F(S) is contained in S, giving that S is an element of T. Now, by the monotonicity of F, F(F(S)) is contained in F(S) so F(S) is also an element of T. This gives that S in contained in F(S) (as S is the intersection of all the elements of T) and so S = F(S) and S is a fixed point of F. $$\blacksquare$$

Now we are ready to proof the Cantor–Bernstein–Schroeder theorem.

#### Proof of the Cantor-Bernstein-Schroeder Theorem
First, note that it is enough to prove that if $$A_1$$ is contained in B, and B is contained in A, and f is a bijection from A to $$A_1$$, then there exists a bijection g from A to B (make sure you understand why this claim and the C-B-S theorem are indeed equivalent).

Define
$$h:P(A) \rightarrow P(A)$$ as
$$h(X) = \{f(x) | x \in X\} \bigcup (A \setminus B)$$. It is trivial that h is monotonic. By lemma 1, there is a fixed point C of h. Define a function $$g:A \rightarrow B$$ as


$$g(x)= 
\begin{cases}
    f(x),& \text{if } x\in C\\
    x,              & \text{otherwise}
\end{cases}$$

Then g is a bijection between A and B. Indeed note that g stabilizes both C and $$A \setminus C$$ (i.e. g(x) is in C i.f.f. x is in C). Indeed, if x is in C, then g(x) = f(x) which is in f(C), which is contained in $$f(C) \bigcup (A \setminus B) = h(C) = C$$. So $$x \in C \implies g(x) \in C$$. Otherwise x is not in C, and so g(x) = x, and obviously g(x) is not in C.

Now, if g(x) = g(y), by what was said above, either both x and y are in C, or both are in $$A \setminus C$$. Either way, this gives x = y. So g is injective.

To show sujectivity of g, we note that if x is in B and in C, then by the structure of C ($$= f(C) \bigcup (A \setminus B)$$), x is in f(C). Now g(C) = f(C), so x is in the image of g. Otherwise, if x is in B and not in C, then g(x) = x and again x is in the image of g. We showed that g is surjective. Surjectivity and injectivity imply that g is a bijection, and the C-B-S theorem is proved.

Let N denote the set $$\{0, 1, 2, ...\}$$ of natural numbers. Lets begin by showing that the sets N and $$N \times N$$ (i.e. the set of pairs of natural numbers) are of the same cardinality (i.e. that there exists a bijection $$f:N\times N \rightarrow N$$). We call sets of the same cardinality as N *countable* (note that sets whose cardinality is the same or less than that of N are called *at most countable*). I will give two proofs of the following theorem (which can be rephrased to: “$$N \times N$$ is a countable set”).

#### Theorem 1
The sets N and $$N \times N$$ are of the same cardinality.

##### Proof 1 - Using the C-B-S Theorem
Consider the functions, $$f:N \rightarrow N \times N$$ and $$g:N \times N \rightarrow N$$ given by: $$f(n) = (n,0)$$ and $$g(n,m) = (2^{n})\times(3^{m})$$. It is obvious that f and g are injective. By the C-B-S theorem N and $$N \ times N$$ are of the same cardinality.

##### Proof 2 – Actual Construction
Lets build such a function f.

Let $$f(m,n) = (2\times n + 1) \times 2^{m} - 1$$.

Now

$$
\begin{align}
& f(m,n) = f(u,v)\\
&\implies (2 \times n+1) \times 2^{m} - 1 = (2 \times v+1) \times 2^u - 1\\
&\implies (2 \times n+1) \times 2^{m} = (2 \times v+1) \times 2^u\\
&\implies (2 \times n+1) \times 2^{m} = (2 \times v+1) \times 2^u (mod(2^{m}))\\
&\implies 0 = (2 \times v+1) \times 2^u (mod(2^{m}))\\
&\implies 0 = 2^u (mod(2^{m}))\\
&\implies m \leq u
\end{align}
$$

Symmetrically, u <= m, so u = m. Then,

$$
\begin{align}
&\implies (2\times n + 1) = (2 \times v + 1)\\
&\implies n = v
\end{align}
$$

So f is injective. If n is in $$N \setminus \{0\}$$, then $$n = s\times 2^k$$, where s is odd. Then there exists t, such that $$s = 2 \times t + 1$$. Then $$f(k,t) = n$$. If n = 0, then $$f(0,0) = 1-1 = 0 = n$$. So f is surjective.

We have shown f to be a bijection between $$N \times N$$ and N and so these sets are of the same cardinality.

### The Axiom of Choice
The reason I have gone through all of the above, although I know that to many of you it may seem trivial, is to emphasize the need for the axiom of choice. Lets consider the following theorem:

#### Theorem 2
A union of countably many disjoint countable sets is countable.

Now, a little reflection may suggest that this is a trivial consequence of what was proved before. We have a countable family of sets $$A = \{A_1, A_2, ...\}$$ where each set $$A_i$$ is countable. So for each i, there is a bijection $$F_i : N \rightarrow A_i$$. So there is a bijection $$g:N \times N \rightarrow \bigcup(A_i)$$ given by $$g(i,j) = F_i(j)$$. g is indeed a bijection as the $$A_i$$’s are disjoint.

Well, surprisingly the above does not constitute a proof of theorem 2!

Not only that, I claim that theorem 2 cannot be proved without employing the axiom of choice. Before going on any further, lets write down this axiom of choice we keep talking about:

#### Statement of the Axiom of Choice
Let S be a family of non-empty sets. Then there exists a function $$f:S \rightarrow \bigcup (S)$$ such that $$f(S) \in S$$.

Note that $$\bigcup(S)$$ denotes the union of all the elements of S.

This may seem trivial. After all, since all the elements of S are non-empty, they each contain at least one member. So there must be a function that maps to each set one of its elements!

Indeed, for the case that S is finite, we can prove the constructability of the function f in the axiom of choice (thus the axiom of choice for the case that S is finite, no longer needs to be an axiom). Say $$S = \{A_1, A_2, ..., A_n\}$$, where each $$A_i$$  is non-empty (1 <= i <= n). Then there exist elements $$\{a_1, a_2, ..., a_n\}$$ such that $$a_i \in A_i$$. Now define $$f(A_i) = a_i$$.

As it turns out, for infinite S, that this construction is possible is no longer a consequence of the other axioms of set theory. Say $$S = \{A_1, A_2, ...\}$$ and $$A_1, A_2, ...$$ are non-empty so that $$a_i \in A_i$$. We can define a function $$f:S \rightarrow \bigcup(S)$$ such that $$f(A_i) = a_1$$ for all i. We can also define a function f, such that $$f(A_1) = a_1$$, and $$f(A_i) = a_2$$ for all i not in {1}. We can continue with this process for any finite number of steps, creating a function $$f:S \rightarrow \bigcup (S)$$ such that $$f(A_i) = a_i$$ for all i < n, and $$f(A_i) = a_1$$ for i >= n. The point here is that we cannot perform this process for an infinite number of steps.

#### Some Examples
To put the axiom of choice in very popular terms: we can perform any finite number of arbitrary choices of elements from sets, but we cannot perform an infinite number of arbitrary such choices.

For example, say that $$S = \{A_1, A_2, ...\}$$ and each set $$A_i=\{1, i\}$$. Then the following functions $$f,g:S \rightarrow \bigcup(S)$$ exist without assuming the axiom of choice

$$f(A_i) = 1, g(A_i) = i$$

If it is known that each set $$A_i$$ is of size 2 containing the element 1, then the following functions can also be shown to exist w/o assuming the axiom of choice:

$$f(A_i) = 1, g(A_i) = \text{the unique element of } A_i \setminus \{1\}$$

Now, if it is known that the sets $$A_i$$ are disjoint and of each contains exactly two natural numbers, then, again, the functions

$$f(A_i) = max(A_i), g(A_i) = min(A_i)$$

can  be shown to exist without assuming the axiom of choice. This principal can be extended to the case where the sets $$A_i$$ are contained in a set A having an order relation with the property that each non-empty subset of A has a least element (we say that the order relation is a well ordering of A). Then we can define:

$$f(A_i) = least element of A_i$$

If on the other hand all that is known on the sets $$A_i$$ is that they contain exactly two members, the existence of a function f as in the axiom of choice *is not a consequence of any of the other axioms*.

The previous two examples suggest an alternative formulation for the axiom of choice, namely that we can define a well ordering on any set. If this were true, we could define a well ordering on the set $$\bigcup(A_i)$$ and define f as above. Indeed it turns out that the axiom of choice is equivalent to the principal that we can define a well ordering on any set (in the sense that using the other axioms of set theory and any one of the above we can prove the other).

### On the Existance of Sets
To avoid paradoxes (such as [Russell's paradox](https://en.wikipedia.org/wiki/Russell%27s_paradox)), we must constrain ourselves to assuming the existence of only those objects which can be shown to exist from the axioms. For example, let S be the set of all sets (i.e. every set is a member of S). Then by Cantor's theorem (that P(X) is always of a larger cardinality than X) S cannot exist!

The point to note here is that the mere description of a set does not guaranty its existence.

Now, the same applies to functions (for the purists of you – this is simply a special case of the preceding sentence as all functions are actually sets). The mere description of a function does not guaranty its existence.

As it turns out, the existence of the function f which appears in the axiom of choice, in the case that S is infinite, does not follow from the other axioms of set theory (it can in fact be shown that instead of accepting the axiom of choice, accepting an axiom declaring the in-existence of the function f does not lead to any contradictions with the other axioms of set theory!).

Now, lets consider a valid proof of theorem 2 using the axiom of choice.

#### Proof of Theorem 2
$$S = \{ A_1, A_2, ... \}$$ is a countable set of disjoint countable sets. That $$A_i$$ is countable is equivalent to the statement: $$F_i = \{ f | f \text{ is a bijection between} N \text{and} A_i \}$$ is a non-empty set. Consider the set $$T = \{F_1, F_2, ...\}$$. T is a set of non-empty sets, so by the axiom of choice there is a function $$g:T \rightarrow \bigcup (T)$$ such that $$g(F_i)$$ is in $$F_i$$.

Define $$h:N \times N \rightarrow S$$ as follows:

$$h(i,j) = g(F_i)(j)$$

Then obviously h is a bijection.

The reason h does exist, is subtle. It relies on the fact that for each input a clear procedure for calculating the output of the function can be given. I know this is vague, and should you be interested, I will give a full construction of h, demonstrating its existence, in a future post.

### Some Thoughts
So, does the above example demonstrate that the axiom of choice really is necessary?

Not really. Consider the following theorem:

#### Theorem 2b
Let S be a countable family of pairs $$\{(A_i,F_i)\}$$ such that the $$A_i$$'s are countable and disjoint and $$F_i$$ is a bijection from N to $$A_i$$. Then $$\bigcup (A_i)$$ is countable.

#### Proof w/o the Axiom of Choice
Define $$f:N \times N \rightarrow \bigcup (A_i)$$ as follows:

$$f(i,j) = F_i(j)$$

Obviously f is injective and surjective. Thus we have constructed a bijection from $$N \times N$$ to $$\bigcup(A_i)$$, and by theorem 1, $$\bigcup(A_i)$$ is countable.

Now, in all practical cases (that I can think of - please lmk if you have a good counter example) we never use the fact that the set is countable without explicitly having a bijection between the set and N. So, in all practical cases, the weaker version of theorem 2 (namely theorem 2b) can be used.

### Final Note
The acceptance of the axiom of choice seems very logical. Nevertheless, it should be mentioned that it results in some very undesirable consequences, such as unmeasurable sets and the Banach-Tarski paradox (which is very interesting and on which I shall write in a future post).