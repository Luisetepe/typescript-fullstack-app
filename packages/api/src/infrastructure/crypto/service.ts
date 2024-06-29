import { hash, verify } from '@node-rs/argon2'

export interface ICryptoService {
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>
}

export class CryptoService implements ICryptoService {
  async hashPassword(password: string) {
    return await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
  }

  async verifyPassword(password: string, hash: string) {
    return await verify(hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
  }
}
