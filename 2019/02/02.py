import math


def readInput(file):
    raw_input = []
    with open(file) as my_file:
        raw_input = my_file.read().split(',')
    return list(map(int, raw_input))


memory = readInput("./input.txt")
memory[1] = 12
memory[2] = 2


def getOp(opID):
    if opID == 1:
        return lambda a, b: a + b
    elif opID == 2:
        return lambda a, b: a * b


def processOp(memory, ix):
    opID = memory[ix]
    if opID == 99:
        return 0
    targetIx = memory[ix + 3]
    aIx = memory[ix + 1]
    bIx = memory[ix + 2]
    memory[targetIx] = getOp(opID)(memory[aIx], memory[bIx])
    return 4


def process(memory):
    step = 1
    ix = 0
    adjustment = processOp(memory, ix)
    while adjustment != 0:
        ix = ix + adjustment
        adjustment = processOp(memory, ix)
        step += 1


# process(memory)
# print(memory[0])


################################### part two ###########################

def findInputs(target):
    a = 0
    b = 0
    done = False
    while not done:
        memory = readInput("./input.txt")
        memory[1] = a
        memory[2] = b
        process(memory)
        result = memory[0]
        print(str(a) + " " + str(b) + " -> " + str(result))
        if result == target:
            done = True
        else:
            b += 1
            if b > 99:
                a += 1
                b = 0
    return (a, b)


resultTuple = findInputs(19690720)
result = 100 * resultTuple[0] + resultTuple[1]
print("Found it ", result)
