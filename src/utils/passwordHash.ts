import bcrypt from "bcrypt";

const generateHashedPasswordAsync = async(password:string):Promise<string> =>{
    return await bcrypt.hash(password, 10);
}

const checkHashedPasswordAsync = async(plainTextPassword:string, hashedPassword:string,):Promise<boolean> =>{
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export {generateHashedPasswordAsync, checkHashedPasswordAsync};