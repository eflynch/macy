import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt
import matplotlib.cm as cm
import argparse


SHIFT_KEY = cv.EVENT_FLAG_SHIFTKEY
ALT_KEY = cv.EVENT_FLAG_ALTKEY


def show(img):
    fig, ax = plt.subplots()
    ax.imshow(img, cmap=cm.gray)
    plt.show()


class MapMaker:
    def __init__(self, img):
        h, w = img.shape[:2]

        self.img = img
        self.regions = {}
        self.name = ""
        self.mask = np.zeros((h, w), dtype=np.uint8)
        self._flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        self._flags = 4 | cv.FLOODFILL_FIXED_RANGE | cv.FLOODFILL_MASK_ONLY | 255 << 8
        self.contours = np.zeros((h, w), dtype=np.uint8)

    def run(self):
        def callback(event, x, y, flags, *userdata):
            if event != cv.EVENT_LBUTTONDOWN:
                return

            modifier = flags & (ALT_KEY + SHIFT_KEY)

            self._flood_mask[:] = 0
            cv.floodFill(self.img, self._flood_mask, (x, y), 0, 8, 8, self._flags)

            flood_mask = self._flood_mask[1:-1, 1:-1].copy()

            if modifier == (ALT_KEY + SHIFT_KEY):
                self.mask = cv.bitwise_and(self.mask, flood_mask)
            elif modifier == SHIFT_KEY:
                self.mask = cv.bitwise_or(self.mask, flood_mask)
            elif modifier == ALT_KEY:
                self.mask = cv.bitwise_and(self.mask, cv.bitwise_not(flood_mask))
            else:
                self.mask = flood_mask

            viz = self.img.copy()
            contours, _ = cv.findContours(self.mask, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
            viz = cv.drawContours(viz, contours, -1, color=(100,) * 3, thickness=-1)
            self.contours[:] = 0
            self.contours = cv.drawContours(self.contours, contours, -1, color=(255,) * 3, thickness=-1)
            cv.imshow("Name", viz)

        cv.namedWindow("Name")
        cv.setMouseCallback("Name", callback)
        cv.imshow("Name", self.img)

        while True:
            k = cv.waitKey() & 0xFF
            if k in (ord("1"), ord("\x1b")):
                cv.destroyWindow("Name")
                print(self.regions)
                break
            elif k in (ord("2"),):
                self.name = ""
                print("")
            elif k in [ord(x) for x in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ."]:
                self.name += chr(k)
                print(chr(k), end="")
            elif k in [ord("3")]:
                print("saved", self.name)
                self.regions[self.name] = self.contours.copy()
                self.name = ""


def main():
    parser = argparse.ArgumentParser(description="Mapmaker")
    parser.add_argument("input")

    args = parser.parse_args()

    img = cv.imread(args.input)
    imggray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    thresh = cv.adaptiveThreshold(imggray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
                                  cv.THRESH_BINARY, 11, 2)

    m = MapMaker(thresh)
    m.run()


if __name__ == "__main__":
    main()
