import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const bcryptUtils = {
  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
  },
};
