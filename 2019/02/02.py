import math


def readInput(file):
    with open(file) as my_file:
        return my_file.read().split(',')


test_memory = list(map(int, readInput("./input_test.txt")))
memory = list(map(int, readInput("./input.txt")))
memory[1] = 12
memory[2] = 2


def getOp(opID):
    if opID == 1:
        return lambda a, b: a + b
    elif opID == 2:
        return lambda a, b: a * b


def processOp(memory, ix):
    print(memory)
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
        print(str(step) + ". ix - [" + str(ix) + "]")
        adjustment = processOp(memory, ix)
        step += 1


process(memory)
print(memory)


################################### part two ###########################
