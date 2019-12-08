import math
from enum import Enum
from copy import deepcopy


class PX(Enum):
    BLACK = 0
    WHITE = 1
    TRANS = 2

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        if self == PX.BLACK:
            return "#"
        elif self == PX.WHITE:
            return "□"
        else:
            return " "


def readInput(file, width, heigh):
    line = None
    layerSize = width * heigh
    with open(file) as my_file:
        line = my_file.readline()
    result = []
    totalProcessedPXs = 0
    rowProcessedPXs = 0
    for digit in line:
        if totalProcessedPXs % layerSize == 0:
            result.append([])
            rowProcessedPXs = 0
        layerIx = len(result) - 1
        if rowProcessedPXs % width == 0:
            result[layerIx].append([])
        rowIx = len(result[layerIx]) - 1

        # result[layerIx][rowIx].append(PX(int(digit)))
        result[layerIx][rowIx].append(PX(int(digit)))

        rowProcessedPXs += 1
        totalProcessedPXs += 1

    return result


source = readInput("./input_test.txt", 2, 2)
source = readInput("./input.txt", 25, 6)
# print(source)

# oneWithLeastZeros = min(
#     map(lambda layer: (layer, sum(row.count(0) for row in layer)), source),
#     key=lambda item: item[1])[0]

# result = sum(row.count(1) for row in oneWithLeastZeros) * \
#     sum(row.count(2) for row in oneWithLeastZeros)
# print(oneWithLeastZeros, result)

################################### part two ###########################


def printPicture(picture):
    for row in picture:
        line = "".join(map(lambda px: str(px), row))
        print(line)


def paintPicture(layers):
    picture = deepcopy(layers[len(layers) - 1])
    for layerIX in range(len(layers) - 2, 0 - 1, -1):
        for rowIX in range(0, len(layers[layerIX])):
            for pxIX in range(0, len(layers[layerIX][rowIX])):
                if layers[layerIX][rowIX][pxIX] != PX.TRANS:
                    picture[rowIX][pxIX] = layers[layerIX][rowIX][pxIX]
    return picture


printPicture(paintPicture(source))
