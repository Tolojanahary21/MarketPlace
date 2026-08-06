//Hash Mot de Passe
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hash du mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Comparaison (servira plus tard pour le login)
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
