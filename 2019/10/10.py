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
print(maxAngels, len(maxAngels[1]))
