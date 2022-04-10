import {
    generateHashedPasswordAsync,
    checkHashedPasswordAsync,
} from '../src/utils/passwordHash';

describe('Hashing', () => {
    let pass: string;
    let hashedPass: string;
    beforeEach(async () => {
        pass = 'test';
        hashedPass = await generateHashedPasswordAsync(pass);
    });

    test('Password hashing', async () => {
        expect(pass).not.toEqual(hashedPass);
    });

    test('Hash comparison', async () => {
        expect(await checkHashedPasswordAsync(pass, hashedPass)).toEqual(true);
        expect(await checkHashedPasswordAsync('tests', hashedPass)).toEqual(
            false
        );
    });
});
