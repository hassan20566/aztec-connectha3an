import { GrumpkinAddress } from '@aztec/barretenberg/address';
import { AccountId, AliasHash } from '@aztec/barretenberg/account_id';
import { Grumpkin } from '@aztec/barretenberg/ecc/grumpkin';

export * from '@aztec/barretenberg/account_id';
export * from './recovery_payload';

export interface UserData {
  id: AccountId;
  privateKey: Buffer;
  publicKey: GrumpkinAddress;
  nonce: number;
  aliasHash?: AliasHash;
  syncedToRollup: number;
}

export class UserDataFactory {
  constructor(private grumpkin: Grumpkin) {}

  derivePublicKey(privateKey: Buffer) {
    return new GrumpkinAddress(this.grumpkin.mul(Grumpkin.one, privateKey));
  }

  async createUser(privateKey: Buffer, nonce: number, aliasHash?: AliasHash, syncedToRollup = -1): Promise<UserData> {
    const publicKey = this.derivePublicKey(privateKey);
    const id = new AccountId(publicKey, nonce);
    return { id, privateKey, publicKey, nonce, aliasHash, syncedToRollup };
  }
}
