const each = require('jest-each').default;
const { isFieldValid, passportFields2 } = require('./run')


describe("Day4 ", () => {
    each([
        [
            "2020",
            {
                range: [2020, 2020]
            },
            true
        ],
        [
            "2021",
            {
                range: [2020, 2020]
            },
            false
        ],
    ]).test('Test range %p', (value, cond, expected) => {
        const result = isFieldValid('field', value, cond);
        expect(result).toBe(expected);
    });

    const heighCond = passportFields2.hgt

    each([
        [
            "150cm",
            heighCond,
            true
        ],
        [
            "140cm",
            heighCond,
            false
        ], [
            "cm",
            heighCond,
            false
        ], [
            "150cm2",
            heighCond,
            false
        ], [
            "60in",
            heighCond,
            true
        ], [
            "50in",
            heighCond,
            false
        ], [
            "77in",
            heighCond,
            false
        ],
    ]).test('Test height %p', (value, cond, expected) => {
        const result = isFieldValid('field', value, cond);
        expect(result).toBe(expected);
    });

    each([
        [
            "#123abc",
            passportFields2.hcl,
            true
        ],
        [
            "#aaaabc",
            passportFields2.hcl,
            true
        ],
        [
            "#aaaa2c",
            passportFields2.hcl,
            true
        ],
        [
            "#123abz",
            passportFields2.hcl,
            false
        ],
        [
            "123abc",
            passportFields2.hcl,
            false
        ],
    ]).test('Hair color %p', (value, cond, expected) => {
        const result = isFieldValid('field', value, cond);
        expect(result).toBe(expected);
    });


    each([
        [
            "amb",
            passportFields2.ecl,
            true
        ],
        [
            "blu",
            passportFields2.ecl,
            true
        ],
        [
            "brn",
            passportFields2.ecl,
            true
        ],
        [
            "gry",
            passportFields2.ecl,
            true
        ],
        [
            "grn",
            passportFields2.ecl,
            true
        ],
        [
            "hzl",
            passportFields2.ecl,
            true
        ],
        [
            "oth",
            passportFields2.ecl,
            true
        ],
        [
            "other",
            passportFields2.ecl,
            false
        ],
    ]).test('Eye color %p', (value, cond, expected) => {
        const result = isFieldValid('field', value, cond);
        expect(result).toBe(expected);
    });

    each([
        [
            "123456789",
            passportFields2.pid,
            true
        ],
        [
            "1234567",
            passportFields2.pid,
            false
        ],
        [
            "023456789",
            passportFields2.pid,
            true
        ],
        [
            "000000000",
            passportFields2.pid,
            true
        ],
        [
            "00000000a",
            passportFields2.pid,
            false
        ],


    ]).test('PID %p', (value, cond, expected) => {
        const result = isFieldValid('field', value, cond);
        expect(result).toBe(expected);
    });
});
