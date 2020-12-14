const binarySize = Math.pow(2, 28);

class Runner {

    constructor(program) {
        this.program = program;
        this.ip = 0;
        this.memory = {}
        this.history = {}
        this.mask = null;
    }

    execute() {
        // console.log(this);
        const state = this.recordState();
        const stateHash = this.hashState();
        if (this.history[stateHash] && this.history[stateHash].length) {
            return {
                ok: false,
                memory: this.memory,
                ip: this.ip
            };
        }
        this.history[stateHash] = this.history[stateHash] ? this.history[stateHash].concat([state]) : [state];

        if (this.ip >= this.program.length) {
            return {
                ok: true,
                memory: this.memory,
                ip: this.ip
            }
        }

        this.runInstruction();

        return this.execute();
    }

    runInstruction() {
        let ipJump = 1;
        const { instructionCode, args } = this.program[this.ip];

        switch (instructionCode) {
            case 'jmp':
                ipJump = args[0];
                break;
            case 'acc':
                this.memory[0] = (this.memory[0] || 0) + args[0];
                break;
            case 'mask':
                this.mask = this.parseMask(args[0]);
                break;
            case 'mem':
                this.memory[args[0]] = this.maybeApplyMask(args[1]);
                break;
            default:
                break;
        }

        this.ip = this.ip + ipJump;
    }

    maybeApplyMask(input) {
        if (this.mask) {
            const inputParts = this._bitsizeSplit(input);

            const result = {
                lower: (this.mask.andMask.lower & inputParts.lower) | this.mask.orMask.lower,
                higher: (this.mask.andMask.higher & inputParts.higher) | this.mask.orMask.higher,
            }
            return this._bitsizeUnsplit(result);
        }
        return input;
    }


    _bitsizeUnsplit(input) {
        return input.higher * binarySize + input.lower;
    }

    _bitsizeSplit(input) {
        return {
            higher: Math.floor(input / binarySize),
            lower: input % binarySize
        }
    }

    parseMask(mask) {
        const chars = mask.split("");
        let postition = 0;
        let orMask = 0;
        let andMask = 0;
        for (let ix = chars.length - 1; ix >= 0; ix--) {
            const element = chars[ix];
            const shifter = Math.pow(2, postition);
            postition++;
            switch (element) {
                case 'x':
                case 'X':
                    andMask += shifter;
                    break;
                case '1':
                    andMask += shifter;
                    orMask += shifter;
                case '0':
                default:
                    break;
            }
        }

        return {
            andMask: this._bitsizeSplit(andMask),
            orMask: this._bitsizeSplit(orMask)
        }
    }

    recordState() {
        return [this.ip]
    }

    hashState() {
        return this.ip;
    }
}

module.exports = {
    Runner
}