import math


class SpaceObject(object):
    parent = None
    id = None
    distance = None

    def __init__(self, id, parent):
        self.id = id
        self.parent = parent
        self.distance = 0 if parent is None else None

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return "{} -[{}]--> {}".format(self.id, self.distance, self.parent)


def parseItem(item):
    itemParts = item.split(")")
    return SpaceObject(itemParts[1], itemParts[0])


def readInput(file):
    lines = []
    area = dict()
    with open(file) as my_file:
        lines = my_file.read().splitlines()
    for line in lines:
        item = parseItem(line)
        area[item.id] = item
    area["COM"] = SpaceObject("COM", None)
    return area


def calculateDistanceMap(area):
    for key in area:
        calculateDistance(area, key)


def calculateDistance(area, key):
    spaceObject = area[key]
    if spaceObject.distance is None:
        spaceObject.distance = 1 + calculateDistance(area, spaceObject.parent)
    return spaceObject.distance


source = readInput("./input.txt")
calculateDistanceMap(source)
checksum = sum(map(lambda key: source[key].distance, source))
print(source, checksum)

################################### part two ###########################
