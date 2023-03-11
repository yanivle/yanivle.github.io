# yanivle.github.io

This is my personal blog. It is based on the [Mickey theme](https://github.com/vincentchan/mickey) for [Jekyll](http://jekyllrb.com).


## Building and Serving

Recompile sass (if needed):

    sass _scss/main.scss:assets/css/main.css --no-source-map --style expanded
    sass _scss/main.scss:assets/css/main.min.css --no-source-map --style compressed

Put hero images for new posts go in `assets/images/hero` and then run:

    python resize_images.py

To serve locally (remove `--drafts` for prod view):

    bundle exec jekyll serve --config=_config.yml --drafts

To build:

    bundle exec jekyll build --config=_config.yml --drafts