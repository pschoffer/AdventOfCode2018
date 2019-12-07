import math


def readInput(file):
    raw_input = []
    with open(file) as my_file:
        raw_input = my_file.read().split(',')
    return list(map(int, raw_input))


memory = readInput("./input_test.txt")


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
    elif opID == 3:
        return OperationInfo(lambda: int(input("Give me input:")), 0, 1)
    elif opID == 4:
        return OperationInfo(lambda a: print("Crazy output:", a), 1, 0)


def processOp(memory, ip):
    opID = memory[ip]
    if opID == 99:
        return 0
    operationInfo = getOp(opID)
    arguments = getArguments(memory, ip, operationInfo.argumentCount)
    result = operationInfo.operation(*arguments)
    if operationInfo.returnValueCount > 0:
        targetIx = memory[ip + operationInfo.argumentCount + 1]
        memory[targetIx] = result
    return 1 + operationInfo.argumentCount + operationInfo.returnValueCount


def getArguments(memory, ip, count):
    args = []
    for ix in range(1, count + 1):
        args.append(memory[memory[ip + ix]])
    return args


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
