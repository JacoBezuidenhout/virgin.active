import numpy as np
import cv2

if __name__ == '__main__':
	import sys
	from glob import glob
	import itertools as it

	for fn in it.chain(*map(glob, sys.argv[1:])):
		total = 0.00
		count = 0
		MAX = 0
		MIN = 9999
		frameNum = 0

		cap = cv2.VideoCapture(fn)
		ret, frame = cap.read()
		fgbg = cv2.createBackgroundSubtractorMOG2()

		while(ret):

		    fgmask = fgbg.apply(frame)
		    total += float(cv2.countNonZero(fgmask))/float(fgmask.size)*100.00
		    count += 1

		    cv2.imshow('frame',fgmask)
		    k = cv2.waitKey(10) & 0xff
		    if k == 27:
		        break

		    ret, frame = cap.read()
		
		print float(total)/float(count)


		cap.release()
		cv2.destroyAllWindows()
