import math


def readInput(file):
    raw_input = []
    with open(file) as my_file:
        raw_input = my_file.read().split(',')
    return list(map(int, raw_input))


memory = readInput("./input.txt")


class OperationInfo:
    operation = None
    argumentCount = 0
    returnValueCount = 0

    def __init__(self, operation, argumentCount, returnValueCount):
        self.operation = operation
        self.argumentCount = argumentCount
        self.returnValueCount = returnValueCount


class OperationReturn:
    value = None
    ipJump = None

    def __init__(self, value, ipJump=None):
        self.value = value
        self.ipJump = ipJump


def getOp(opID):
    if opID == 1:
        return OperationInfo(lambda a, b: OperationReturn(a + b), 2, 1)
    elif opID == 2:
        return OperationInfo(lambda a, b: OperationReturn(a * b), 2, 1)
    elif opID == 3:
        return OperationInfo(lambda: OperationReturn(int(input("Give me input:"))), 0, 1)
    elif opID == 4:
        return OperationInfo(lambda a: OperationReturn(print("Crazy output:", a)), 1, 0)


def processOp(memory, ip):
    opCode = memory[ip]
    opID = opCode % 100
    if opID == 99:
        return 0
    operationInfo = getOp(opID)
    arguments = getArguments(memory, ip, operationInfo.argumentCount, opCode)
    result = operationInfo.operation(*arguments)
    if operationInfo.returnValueCount > 0:
        targetIx = memory[ip + operationInfo.argumentCount + 1]
        memory[targetIx] = result.value
    return 1 + operationInfo.argumentCount + operationInfo.returnValueCount


def getArguments(memory, ip, count, opCode):
    args = []
    argModeCode = math.floor(opCode / 100)
    for ix in range(1, count + 1):
        mode = argModeCode % 10
        argIx = ip + ix
        newArgument = None
        if mode:
            newArgument = memory[argIx]
        else:
            newArgument = memory[memory[argIx]]
        args.append(newArgument)

        argModeCode = math.floor(argModeCode / 10)
    return args


def process(memory):
    instructionPointer = 0
    adjustment = processOp(memory, instructionPointer)
    while adjustment != 0:
        instructionPointer = instructionPointer + adjustment
        adjustment = processOp(memory, instructionPointer)


process(memory)
# [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]

################################### part two ###########################
