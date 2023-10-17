---
layout: post
title:  "Speculative Decoding @ ICML"
date:   2023-07-25 23:00:00
excerpt: "Speculative Decoding Talk"
categories: AI
tags:  AI Programming Google Computing
image:
  feature: icml_combined.jpg
  topPosition: 0
bgContrast: dark
bgGradientOpacity: darker
syntaxHighlighter: no
---

#### Decode faster from existing off-the-shelf auto-regressive models, without retraining, while guaranteeing the exact same output distribution.

Last year my collaborators, Matan Kalman and Yossi Matias, and I published a cool **[paper](https://arxiv.org/abs/2211.17192)** where we introduced a generalization of _speculative execution_ to the stochastic setting, which we call [__speculative sampling__](https://arxiv.org/abs/2211.17192). Speculative sampling is applicable in general, but we also introduced a simple technique that applies it to decoding from auto-regressive models, like Transformers, which we call [__speculative decoding__](https://arxiv.org/abs/2211.17192). Speculative decoding enables inferring from LLMs faster, *without a trade-off* - i.e. we decode faster while guaranteeing exactly the same output distribution, so we don't need to make quality sacrifices. This is possible by using existing spare compute capacity. We put [the paper](https://arxiv.org/abs/2211.17192) on Arxiv last year, but I only just now gave a short talk explaining the main ideas in ICML, which you can find **[here](https://slideslive.com/39006668/fast-inference-from-transformers-via-speculative-decoding?ref=search-presentations-yaniv+leviathan)**.

