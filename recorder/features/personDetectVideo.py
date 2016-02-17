#!/usr/bin/env python

import numpy as np
import cv2
import json
import urllib2
import requests

def inside(r, q):
    rx, ry, rw, rh = r
    qx, qy, qw, qh = q
    return rx > qx and ry > qy and rx + rw < qx + qw and ry + rh < qy + qh

def draw_detections(img, rects, thickness = 1):
    for x, y, w, h in rects:
        # the HOG detector returns slightly larger rectangles than the real objects.
        # so we slightly shrink the rectangles to get a nicer output.
        pad_w, pad_h = int(0.15*w), int(0.05*h)
        cv2.rectangle(img, (x+pad_w, y+pad_h), (x+w-pad_w, y+h-pad_h), (0, 255, 0), thickness)

skip = 25
debug = True

if __name__ == '__main__':
    import sys
    from glob import glob
    import itertools as it

    hog = cv2.HOGDescriptor()
    hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

    for fn in it.chain(*map(glob, sys.argv[1:])):
        total = 0
        count = 0
        MAX = 0
        MIN = 9999
        frameNum = 0

        cap = cv2.VideoCapture(fn)

        # take first frame of the video
        ret,frame = cap.read()

        while(ret==True):
            frameNum += 1

            if ret == True:
                # cv2.imshow('img2',frame)
                
                try:
                    img = frame#cv2.imread(frame)
                    if img is None:
                        print 'Failed to load image file:', fn
                        continue
                except:
                    print 'loading error'
                    continue

                found, w = hog.detectMultiScale(img, winStride=(8,8), padding=(32,32), scale=1.05)
                found_filtered = []
                if (debug):
                    for ri, r in enumerate(found):
                        for qi, q in enumerate(found):
                            if ri != qi and inside(r, q):
                                break
                        else:
                            found_filtered.append(r)
                    draw_detections(img, found)
                    draw_detections(img, found_filtered, 3)
                    total += len(found)
                    MAX = max(len(found),MAX)
                    MIN = min(len(found),MIN)
                    count += 1
                    print 'Filtered: %d | Found: %d | Total: %d | Count: %d | Avg: %d | Frame: %d ' % (len(found_filtered), len(found),total,count,total/count,frameNum)
                    cv2.imshow('img', img)
                    k = cv2.waitKey(1) & 0xff
                    if k == 27:
                        break
                    # else:
                    #     cv2.imwrite(chr(k)+".jpg",frame)
                else:
                    total += len(found)
                    MAX = max(len(found),MAX)
                    MIN = min(len(found),MIN)
                    count += 1

                for x in xrange(1,skip):
                    ret ,frame = cap.read()
                    frameNum += 1
            else:
                break
        print 'Total: %d | Count: %d | Avg: %d | Frame: %d | Max: %d | Min: %d ' % (total,count,total/count,frameNum,MAX,MIN)

        cv2.destroyAllWindows()
        cap.release()
