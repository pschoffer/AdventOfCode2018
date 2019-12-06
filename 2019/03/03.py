import math


def parseItem(item):
    return {
        "dir": item[0],
        "length": int(item[1:])
    }


def readInput(file):
    lines = []
    with open(file) as my_file:
        lines = my_file.read().splitlines()
    return (
        list(map(parseItem, lines[0].split(','))),
        list(map(parseItem, lines[1].split(',')))
    )


area = {}
source = readInput("./input.txt")


def adjustPosition(start, dir):
    if dir is "U":
        return (start[0], start[1] + 1)
    elif dir is "D":
        return (start[0], start[1] - 1)
    elif dir is "R":
        return (start[0] + 1, start[1])
    elif dir is "L":
        return (start[0] - 1, start[1])
    return start


def plot(position, directions, id, distance):
    if directions:
        direction = directions[0]
        for i in range(0, direction["length"]):
            position = adjustPosition(position, direction["dir"])
            distance += 1
            addWire(position, id, distance)
        plot(position, directions[1:], id, distance)


def addWire(position, id, distance):
    if not position in area:
        area[position] = {}
    if not id in area[position]:
        area[position][id] = distance


plot((0, 0), source[0], 'a', 0)
plot((0, 0), source[1], 'b', 0)


def manhatanDist(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


# crossedWires = list(
#     map(
#         lambda key: (key, manhatanDist((0, 0), key)),
#         filter(
#             lambda key: len(area[key]) > 1,
#             area)))
# closest = min(crossedWires, key=lambda wireItem: wireItem[1])
# print(closest)


################################### part two ###########################

crossedWires = list(
    map(
        lambda key: (key, area[key]['a'] + area[key]['b']),
        filter(
            lambda key: len(area[key]) > 1,
            area)))
closest = min(crossedWires, key=lambda wireItem: wireItem[1])
print(closest)
