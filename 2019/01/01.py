import math


def fuelConsumption(mass):
    fuel = math.floor(mass / 3) - 2
    return max(0, fuel)


def readInputLines(file):
    with open(file) as my_file:
        return my_file.read().splitlines()


massOfModules = readInputLines("./input.txt")
fuels = sum(map(fuelConsumption, map(int, massOfModules)))
print(fuels)
