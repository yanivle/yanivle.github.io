from PIL import Image
from glob import glob
import os

sizes = {
    'thumbnail': {'width': 350},
    'midsize': {'height': 335},
    'largesize': {'width': 1140},
}

# Existing images that weren't resized correctly before (but still work ok, so suppressing warnings about them now).
known_issues = {
    './assets/images/largesize/soccer_stand_edges.png',
    './assets/images/largesize/n_over_x_to_the_x.png',
    './assets/images/largesize/spacial_partitions.jpg',
    './assets/images/largesize/galois.jpg',
    './assets/images/largesize/good_bad_ugly.jpg',
    './assets/images/largesize/mmx_blur.jpg',
    './assets/images/largesize/dont-be-square.jpg',
    './assets/images/largesize/hilbert.jpg',
    './assets/images/largesize/jungle.jpg',
    './assets/images/largesize/norm.png',
}

def test_image_size(path, width=None, height=None):
    if path in known_issues: return
    size = Image.open(path).size
    if width is not None:
        if size[0] != width:
            print(f'*Warning* Image at {path} has width {size[0]} instead of {width}')
    if height is not None:
        if size[1] != height:
            print(f'*Warning* Image at {path} has height {size[1]} instead of {height}')

def resize_image(src_image, dst_path, width=None, height=None):
    src_w, src_h = src_image.size
    if width is None:
        width = int(height * src_w / src_h)
    if height is None:
        height = int(width * src_h / src_w)
    
    # Allow up to 3 pixels deviation.
    assert int(height * src_w / src_h) <= width <= int(height * src_w / src_h) + 3, (dst_path, width, int(height * src_w / src_h))
    src_image.resize((width, height), resample=Image.LANCZOS).save(dst_path)

def main():
    images_basepath = './assets/images'
    hero_images_path = os.path.join(images_basepath, 'hero')
    for image_path in glob(hero_images_path + '/*'):
        hero_image = Image.open(image_path)
        image_basename = os.path.basename(image_path)
        for typ, size in sizes.items():
            resized_image_path = os.path.join(images_basepath, typ, image_basename)
            if not os.path.isfile(resized_image_path):
                print(f'Size {typ} does not exist for {image_basename}. Creating...')
                resize_image(hero_image, resized_image_path, **size)
            else:
                test_image_size(resized_image_path, **size)


if __name__ == '__main__':
    main()



