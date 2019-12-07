import math
import bisect


class SpaceObject(object):
    parent = None
    id = None
    distance = None
    connections = None

    def __init__(self, id, parent):
        self.id = id
        self.parent = parent
        self.connections = set()
        if parent:
            self.connections.add(parent)
        else:
            self.distance = 0

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return "{}{} -[{}]--> {}".format(self.id, self.connections, self.distance, self.parent)


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
# checksum = sum(map(lambda key: source[key].distance, source))
# print(source, checksum)

################################### part two ###########################


def trackConnections(area):
    for key in area:
        if area[key].parent:
            area[area[key].parent].connections.add(key)


trackConnections(source)


class SearchItem():
    def __init__(self, key, distance, score):
        self.key = key
        self.distance = distance
        self.score = score
        self.totalScore = score + distance

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return "{}[{}/{} => {}]".format(self.key, self.distance, self.score, self.totalScore)


def getScore(a, b, area):
    return abs(area[a].distance - area[b].distance)


def aStar(start, target, area):
    toCheck = [SearchItem(start, 0, getScore(start, target, area))]
    visited = set()
    while toCheck:
        checking = toCheck.pop(0)
        print("Checking", checking)
        if checking.key == target:
            return checking.distance
        else:
            visited.add(checking.key)
            newItems = list(
                map(lambda key: SearchItem(key, checking.distance + 1, getScore(key, target, area)),
                    filter(
                        lambda key: key not in visited,
                        area[checking.key].connections)))
            addSearchItems(toCheck, newItems)
            print(toCheck)
    return None


def addSearchItems(sortedList, newItems):
    for item in newItems:
        keys = list(map(lambda item: item.totalScore, sortedList))
        sortedList.insert(bisect.bisect_left(keys, item.totalScore), item)


start = source["YOU"].parent
target = source["SAN"].parent
print(aStar(start, target, source))
