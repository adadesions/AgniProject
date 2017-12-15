#!/usr/bin/python
import sys
import os
import dlib
import glob
from skimage import io, img_as_ubyte
from skimage.transform import resize
from skimage.draw import circle
import matplotlib.pyplot as plt
import numpy as np

if len(sys.argv) != 3:
    print(
        "Give the path to the trained shape predictor model as the first "
        "argument and then the directory containing the facial images.\n"
        "For example, if you are in the python_examples folder then "
        "execute this program by running:\n"
        "    ./face_landmark_detection.py shape_predictor_68_face_landmarks.dat ../examples/faces\n"
        "You can download a trained facial shape predictor from:\n"
        "    http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2"
        )
    exit()

faces_path = sys.argv[1]
predictor_path = sys.argv[2]

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

img = io.imread(faces_path)
# img = resize(img, (100, 100), mode='reflect')
result = img_as_ubyte(img, force_copy=True)

dets = detector(result, 1)
for d in dets:
    shape = predictor(img, d)


for i in range(shape.num_parts):
    px = shape.part(i)
    print(px)
    rr, cc = circle(px.x, px.y, 4)
    result[cc, rr] = (0, 255, 0)


fig = plt.figure(figsize=(15, 15))
fig.add_subplot(121)
plt.imshow(img)

fig.add_subplot(122)
plt.imshow(result)

plt.show()
