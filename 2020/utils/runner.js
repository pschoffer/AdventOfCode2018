const binarySize = Math.pow(2, 28);

class Runner {

    constructor(program, options = { maskVersion: 1 }) {
        this.program = program;
        this.ip = 0;
        this.memory = {}
        this.history = {}
        this.mask = null;
        this.options = options
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
                const addresses = this.maybeApplyAddressMask(args[0])
                const value = this.maybeApplyMask(args[1]);
                addresses.forEach(addr => this.memory[addr] = value);
                break;
            default:
                break;
        }

        this.ip = this.ip + ipJump;
    }

    maybeApplyAddressMask(input) {

        if (this.mask && this.options.maskVersion === 2) {
            const inputParts = this._bitsizeSplit(input);


            const addrAfterOr = this._or(inputParts, this.mask.orMask)
            if (this.mask.floatBits.length) {
                const addresses = [];

                const highest = this._bitsizeSplit(Math.max(...this.mask.floatBits.map(this._bitsizeUnsplit)))
                const cleared = this._bitsizeUnsplit(this._and(addrAfterOr, this._not(highest)))

                for (const floatBit of this.mask.floatBits) {
                    addresses.push(cleared + this._bitsizeUnsplit(floatBit));
                }

                return addresses;
            } else {
                return [this._bitsizeUnsplit(addrAfterOr)]
            }

        }


        return [input]
    }

    _or(a, b) {
        return {
            lower: a.lower | b.lower,
            higher: a.higher | b.higher,
        }
    }

    _and(a, b) {
        return {
            lower: a.lower & b.lower,
            higher: a.higher & b.higher,
        }
    }
    _not(a) {
        return {
            lower: ~a.lower,
            higher: ~a.higher,
        }
    }
    maybeApplyMask(input) {
        if (this.mask && this.options.maskVersion === 1) {
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
        let floatBits = [];
        for (let ix = chars.length - 1; ix >= 0; ix--) {
            const element = chars[ix];
            const shifter = Math.pow(2, postition);
            postition++;
            switch (element) {
                case 'x':
                case 'X':
                    if (floatBits.length) {
                        floatBits = floatBits.concat(floatBits.map(prev => prev + shifter));
                    } else {
                        floatBits = [shifter, 0];
                    }
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

        if (this.options.maskVersion === 1) {

            return {
                andMask: this._bitsizeSplit(andMask),
                orMask: this._bitsizeSplit(orMask),
            }
        } else {
            return {
                orMask: this._bitsizeSplit(orMask),
                floatBits: floatBits.map(bit => this._bitsizeSplit(bit))
            }
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