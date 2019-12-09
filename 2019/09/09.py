import math
from enum import Enum
import itertools
import collections


class Memmory(collections.MutableSequence):

    def __init__(self, l=[]):
        if type(l) is not list:
            l = list(l)

        self._inner_list = l

    def __len__(self):
        return len(self._inner_list)

    def __delitem__(self, index):
        self._inner_list.__delitem__(index)

    def insert(self, index, value):
        self._inner_list.insert(index, value)

    def __setitem__(self, index, value):
        self.checkSize(index)
        self._inner_list.__setitem__(index, value)

    def checkSize(self, index):
        if type(index) is int and index >= len(self):
            self._inner_list += [0] * (index - len(self) + 1)

    def __getitem__(self, index):
        self.checkSize(index)
        return self._inner_list.__getitem__(index)

    def __repr__(self):
        return self._inner_list.__repr__()

    def __str__(self):
        return self._inner_list.__str__()


def readInput(file):
    raw_input = []
    with open(file) as my_file:
        raw_input = my_file.read().split(',')
    return Memmory(map(int, raw_input))


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
    def __init__(self, value, ipJump=None, relativeBaseAdjustment=None):
        self.value = value
        self.ipJump = ipJump
        self.relativeBaseAdjustment = relativeBaseAdjustment

    def __str__(self):
        return "[{}], IP {}, Rb {}".format(self.value, self.ipJump, self.relativeBaseAdjustment)


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


class InputNeeded(Exception):
    pass


class Process():

    def __init__(self, memory, iStrem, oStream):
        self.ip = 0
        self.relativeBase = 0
        self.memory = memory
        self.iStream = iStrem
        self.oStream = oStream
        self.isDone = False

    def go(self):
        adjustment = self.doStep()
        while not self.isDone:
            if self.oStream:
                print(self.oStream.pop(0))

            self.doAdjustment(adjustment)
            # print(self)
            adjustment = self.doStep()

    def doAdjustment(self, adjustment):
        self.ip = adjustment.adjutment if adjustment.adjustmentType is AdjustmentType.ABSOLUTE else self.ip + adjustment.adjutment

    def doStep(self):
        opCode = self.memory[self.ip]
        opID = opCode % 100
        if opID == 99:
            self.isDone = True
            return Adjustment(AdjustmentType.HALT, None)

        operationInfo = self.getOp(opID)
        arguments = self.getArguments(operationInfo.argumentCount, opCode)

        result = operationInfo.operation(*arguments)

        if operationInfo.returnValueCount > 0 and result.value is not None:
            self.writeResult(operationInfo.argumentCount, opCode, result.value)
        if result.value is None:
            if result.ipJump is not None:
                return Adjustment(AdjustmentType.ABSOLUTE, result.ipJump)
            elif result.relativeBaseAdjustment is not None:
                self.relativeBase += result.relativeBaseAdjustment
        return Adjustment(AdjustmentType.RELATIVE, 1 + operationInfo.argumentCount + operationInfo.returnValueCount)

    def _read(self):
        if self.iStream:
            return OperationReturn(self.iStream.pop(0))
        raise InputNeeded

    def getOp(self, opID):
        if opID == 1:
            return OperationInfo(lambda a, b: OperationReturn(a + b), 2, 1)
        elif opID == 2:
            return OperationInfo(lambda a, b: OperationReturn(a * b), 2, 1)
        elif opID == 3:
            return OperationInfo(lambda: OperationReturn(int(input("Give me input:"))), 0, 1)
            # return OperationInfo(self._read, 0, 1)
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
        elif opID == 9:  # relative base adjustment
            return OperationInfo(lambda a: OperationReturn(None, relativeBaseAdjustment=a), 1, 0)

    def writeResult(self, argumentCount, opCode, value):
        modeCodes = math.floor(opCode / 100)
        for ix in range(0, argumentCount):
            modeCodes = math.floor(modeCodes / 10)
        resultMode = modeCodes % 10

        targetIx = None
        if resultMode == 2:
            targetIx = self.relativeBase + \
                self.memory[self.ip + argumentCount + 1]
        else:
            targetIx = self.memory[self.ip + argumentCount + 1]
        self.memory[targetIx] = value

    def getArguments(self, count, opCode):
        args = []
        argModeCode = math.floor(opCode / 100)
        for ix in range(1, count + 1):
            mode = argModeCode % 10
            argIx = self.ip + ix
            newArgument = None
            if mode == 1:
                newArgument = self.memory[argIx]
            elif mode == 2:
                newArgument = self.memory[self.relativeBase +
                                          self.memory[argIx]]
            else:
                newArgument = self.memory[self.memory[argIx]]
            args.append(newArgument)

            argModeCode = math.floor(argModeCode / 10)
        return args

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return "<{}> In: {}, Out: {}, {}".format(self.isDone, self.iStream, self.oStream, self.memory[self.ip:])


def run(memory):
    iStream = []
    program = Process(memory, iStream, [])
    try:
        program.go()
    except InputNeeded:
        iStream.append(int(input("Provide input: ")))
        print(program)
        program.go()


run(memory)
################################### part two ###########################
