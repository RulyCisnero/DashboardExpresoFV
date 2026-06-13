import { bcryptUtils } from '../utils/bcrypt.ts';
const hash = await bcryptUtils.hashPassword("password123");

console.log(hash);