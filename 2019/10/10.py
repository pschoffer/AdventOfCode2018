import math


def readInput(file):
    lines = []
    asteroids = []
    with open(file) as my_file:
        lines = my_file.read().splitlines()
    for y in range(0, len(lines)):
        for x in range(0, len(lines[y])):
            if lines[y][x] == "#":
                asteroids.append((x, y))
    return asteroids


asteroids = readInput("./input_test.txt")
asteroids = readInput("./input.txt")


def calculateAngle(start, target):
    diff = (target[0] - start[0], target[1] - start[1])
    diffSum = sum(map(abs, diff))
    return (diff[0] / diffSum, diff[1] / diffSum)


def getAngels(start, asteroids):
    angles = set()
    for asteroid in asteroids:
        if asteroid != start:
            angles.add(calculateAngle(start, asteroid))
    return angles


def findMostVisible(asteroids):
    return list(map(lambda asteroid: (asteroid, getAngels(asteroid, asteroids)), asteroids))


angels = findMostVisible(asteroids)
maxAngels = max(angels, key=lambda item: len(item[1]))
# print(maxAngels, len(maxAngels[1]))

################################### part two ###########################

laser = maxAngels[0]


def calcManhatonDistance(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def mapPerAngels(start, asteroids):
    result = dict()
    for asteroid in filter(lambda asteroid: asteroid != start, asteroids):
        angle = calculateAngle(start, asteroid)
        if angle not in result:
            result[angle] = []
        result[angle].append((asteroid, calcManhatonDistance(start, asteroid)))
    for key in result:
        result[key] = sorted(result[key], key=lambda item: item[1])
    return result


def sortAngelForLaser(angels):
    originalLen = len(angels)
    angelsPerKvadrant = []
    angelsPerKvadrant.append(
        filter(lambda angel: angel[0] >= 0 and angel[1] < 0, angels))
    angelsPerKvadrant.append(
        filter(lambda angel: angel[0] > 0 and angel[1] >= 0, angels))
    angelsPerKvadrant.append(
        filter(lambda angel: angel[0] <= 0 and angel[1] > 0, angels))
    angelsPerKvadrant.append(
        filter(lambda angel: angel[0] < 0 and angel[1] <= 0, angels))

    allAngels = []
    for i in range(0, len(angelsPerKvadrant)):
        allAngels.extend(sorted(
            angelsPerKvadrant[i],
            key=lambda angle: abs(angle[0]),
            reverse=True if i % 2 != 0 else False))

    if originalLen != len(allAngels):
        print("Something is really wrong")
    return allAngels


angelsToShootAt = mapPerAngels(laser, asteroids)


def shootStuff(angelsToShootAt):
    angels = sortAngelForLaser(angelsToShootAt.keys())
    shotNumber = 1
    somethingToShootAt = True
    while somethingToShootAt:
        somethingToShootAt = False
        for angel in angels:
            if (angelsToShootAt[angel]):
                somethingToShootAt = True
                print("SHOT ", shotNumber, " -> ",
                      angelsToShootAt[angel].pop(0))
                shotNumber += 1


shootStuff(angelsToShootAt)
