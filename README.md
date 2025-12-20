# yanivle.github.io

This is my personal blog and a collection of some of my favorite puzzles.

## Building and Serving

Put images for new posts in `assets/images/hero` and then run:

    python build/resize_images.py

To serve locally (remove `--drafts` for prod view):

    bundle exec jekyll serve --config=_config.yml --drafts

To build:

    bundle exec jekyll build --config=_config.yml --drafts

## Acknowledgements

Some posts use images from the awesome royalty-free images sites [Pexels](https://www.pexels.com), [Unsplash](https://unsplash.com/), and [publicdomainvectors.org](https://publicdomainvectors.org/), or from the awesome [Ideogram](https://ideogram.ai) image generation site.
