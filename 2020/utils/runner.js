class Runner {

    constructor(program) {
        this.program = program;
        this.ip = 0;
        this.memory = {}
        this.history = {}
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
            default:
                break;
        }

        this.ip = this.ip + ipJump;
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