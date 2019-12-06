import math


def fuelConsumption(mass):
    fuel = math.floor(mass / 3) - 2
    return max(0, fuel)


def readInputLines(file):
    with open(file) as my_file:
        return my_file.read().splitlines()


massOfModules = readInputLines("./input.txt")
# fuels = sum(map(fuelConsumption, map(int, massOfModules)))
# print(fuels)

################################### part two ###########################

fuelCache = dict()


def complexFuelConsumption(mass):
    if mass in fuelCache:
        print(str(mass) + " - Cached!")
        return fuelCache[mass]

    baseFuel = fuelConsumption(mass)
    totalFuel = baseFuel
    if baseFuel > 0:
        totalFuel += complexFuelConsumption(baseFuel)
    fuelCache[mass] = totalFuel
    print(str(mass) + " <- " + str(totalFuel))
    return totalFuel


fuels = sum(map(complexFuelConsumption, map(int, massOfModules)))
print(fuels)
