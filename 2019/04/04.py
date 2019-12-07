mainRange = ([1, 9, 3, 6, 5, 1], [6, 4, 9, 7, 2, 9])
baseCiferRange = list(map(lambda x: (0, 9), range(0, 6)))


def generateRange(value, lastValueIx=None):
    if lastValueIx is None:
        lastValueIx = len(value) - 1
    generatedRange = baseCiferRange[:]
    currMin = 0
    for ix in range(0, 6):
        relevantValues = [currMin]
        if ix > 0 and ix - 1 <= lastValueIx:
            relevantValues.append(value[ix - 1])
        currMin = max(relevantValues)
        generatedRange[ix] = (currMin, 9)
    return generatedRange


def increment(value):
    newValue = value[:]
    ciferRanges = generateRange(value)
    for ix in range(len(value) - 1, 0 - 1, -1):
        testValueCifer = value[ix] + 1
        if isWithin(testValueCifer, ciferRanges[ix]):
            newValue[ix] = testValueCifer
            initRest(newValue, ix)
            return newValue
    return None


def initRest(value, lastIx):
    restCiferRanges = generateRange(value, lastValueIx=lastIx)
    for ix in range(lastIx + 1, len(value)):
        value[ix] = restCiferRanges[ix][0]


def isWithin(number, ciferRange):
    return number >= ciferRange[0] and number <= ciferRange[1]


def compareNumbers(a, b):
    for ix in range(0, len(a)):
        if a[ix] > b[ix]:
            return 1
        elif a[ix] < b[ix]:
            return -1
    return 0


def findPasswords(start, end):
    current = start[:]
    result = []
    while compareNumbers(current, end) <= 0:
        if isValid(current):
            result.append(current)
        current = increment(current)
    return result


def isValid(number):
    return hasSameCifer(number)


def hasSameCifer(number):
    for ix in range(1, len(number)):
        if number[ix] == number[ix - 1]:
            return True
    return False


result = findPasswords(mainRange[0], mainRange[1])
# Hmm wonder where that 1 is hiding
print("Result", len(result) + 1)

########