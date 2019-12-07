import math
from enum import Enum
import itertools


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


class AdjustmentType(Enum):
    ABSOLUTE = 1
    RELATIVE = 2
    HALT = 3


class Adjustment:
    adjustmentType: None
    adjutment: None

    def __init__(self, adjustmentType, adjutment):
        self.adjustmentType = adjustmentType
        self.adjutment = adjutment


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


class Process():

    def __init__(self, memory, iStrem, oStream):
        self.ip = 0
        self.memory = memory
        self.iStream = iStrem
        self.oStream = oStream
        self.isDone = False

    def go(self):
        adjustment = self.doStep()
        while not self.isDone and not self.oStream:
            self.doAdjustment(adjustment)
            adjustment = self.doStep()
        if not self.isDone:
            self.doAdjustment(adjustment)

    def doAdjustment(self, adjustment):
        self.ip = adjustment.adjutment if adjustment.adjustmentType is AdjustmentType.ABSOLUTE else self.ip + adjustment.adjutment

    def doStep(self):
        opCode = self.memory[self.ip]
        opID = opCode % 100
        if opID == 99:
            self.isDone = True
            return Adjustment(AdjustmentType.HALT, None)

        operationInfo = self.getOp(opID)
        arguments = getArguments(
            self.memory, self.ip, operationInfo.argumentCount, opCode)

        result = operationInfo.operation(*arguments)

        if operationInfo.returnValueCount > 0:
            targetIx = self.memory[self.ip + operationInfo.argumentCount + 1]
            if result.value is not None:
                self.memory[targetIx] = result.value
        if result.value is None and result.ipJump is not None:
            return Adjustment(AdjustmentType.ABSOLUTE, result.ipJump)
        return Adjustment(AdjustmentType.RELATIVE, 1 + operationInfo.argumentCount + operationInfo.returnValueCount)

    def getOp(self, opID):
        if opID == 1:
            return OperationInfo(lambda a, b: OperationReturn(a + b), 2, 1)
        elif opID == 2:
            return OperationInfo(lambda a, b: OperationReturn(a * b), 2, 1)
        elif opID == 3:
            # return OperationInfo(lambda: OperationReturn(int(input("Give me input:"))), 0, 1)
            return OperationInfo(lambda: OperationReturn(int(self.iStream.pop(0))), 0, 1)
        elif opID == 4:
            # return OperationInfo(lambda a: OperationReturn(print(a)), 1, 0)
            return OperationInfo(lambda a: OperationReturn(self.oStream.append(a)), 1, 0)
        elif opID == 5:  # jmp if true
            return OperationInfo(lambda a, b: OperationReturn(None, ipJump=b) if a else OperationReturn(None), 2, 0)
        elif opID == 6:  # jmp if false
            return OperationInfo(lambda a, b: OperationReturn(None, ipJump=b) if not a else OperationReturn(None), 2, 0)
        elif opID == 7:  # less than
            return OperationInfo(lambda a, b: OperationReturn(1) if a < b else OperationReturn(0), 2, 1)
        elif opID == 8:  # equals
            return OperationInfo(lambda a, b: OperationReturn(1) if a == b else OperationReturn(0), 2, 1)

    def __str__(self):
        return "In: {}, Out: {}, {}".format(self.iStream, self.oStream, self.memory[self.ip:])


modulePossibleValues = [0, 1, 2, 3, 4]


def calculateCombinations(values, sofar):
    result = []
    for value in filter(lambda potentialValue: potentialValue not in sofar, values):
        newPosible = sofar[:]
        newPosible.append(value)
        if len(newPosible) == len(values):
            result.append(newPosible)
        else:
            result.extend(calculateCombinations(values, newPosible))
    return result


allCombinations = calculateCombinations(modulePossibleValues, [])


def run(allCombinations):
    maxValue = 0
    for combination in allCombinations:
        proceses = list(map(
            lambda phase: Process(memory[:], [phase], []),
            combination))
        carry = 0
        for proces in proceses:
            proces.iStream.append(carry)
            proces.go()
            carry = proces.oStream.pop(0)
        print("Done: ", combination, carry)
        maxValue = max(maxValue, carry)
    return maxValue


print(run(allCombinations))
################################### part two ###########################
