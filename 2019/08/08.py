import math


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

        result[layerIx][rowIx].append(int(digit))

        rowProcessedPXs += 1
        totalProcessedPXs += 1

    return result


source = readInput("./input_test.txt", 3, 2)
source = readInput("./input.txt", 25, 6)
# print(source)

oneWithLeastZeros = min(
    map(lambda layer: (layer, sum(row.count(0) for row in layer)), source),
    key=lambda item: item[1])[0]

result = sum(row.count(1) for row in oneWithLeastZeros) * \
    sum(row.count(2) for row in oneWithLeastZeros)
print(oneWithLeastZeros, result)

################################### part two ###########################
