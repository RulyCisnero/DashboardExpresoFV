import { bcryptUtils } from '../utils/bcrypt.js';
const hash = await bcryptUtils.hashPassword("password123");

console.log(hash);