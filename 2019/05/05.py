import math


def readInput(file):
    raw_input = []
    with open(file) as my_file:
        raw_input = my_file.read().split(',')
    return list(map(int, raw_input))


memory = readInput("./input_test02.txt")


class OperationInfo:
    operation = None
    argumentCount = 0
    returnValueCount = 0

    def __init__(self, operation, argumentCount, returnValueCount):
        self.operation = operation
        self.argumentCount = argumentCount
        self.returnValueCount = returnValueCount


def getOp(opID):
    if opID == 1:
        return OperationInfo(lambda a, b: a + b, 2, 1)
    elif opID == 2:
        return OperationInfo(lambda a, b: a * b, 2, 1)


def processOp(memory, ix):
    opID = memory[ix]
    if opID == 99:
        return 0
    targetIx = memory[ix + 3]
    aIx = memory[ix + 1]
    bIx = memory[ix + 2]
    operationInfo = getOp(opID)
    memory[targetIx] = operationInfo.operation(memory[aIx], memory[bIx])
    return 1 + operationInfo.argumentCount + operationInfo.returnValueCount


def process(memory):
    instructionPointer = 0
    print("start", memory)
    adjustment = processOp(memory, instructionPointer)
    while adjustment != 0:
        print("after", instructionPointer, memory)
        instructionPointer = instructionPointer + adjustment
        print("before", instructionPointer, memory)
        adjustment = processOp(memory, instructionPointer)


process(memory)
# [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]

################################### part two ###########################
