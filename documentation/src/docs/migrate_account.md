This method allows a user to migrate their account to the next nonce. The proof nullifies the current `account_id` (_accountPublicKey_ and _nonce_ pair), stopping a lost key from migrating the account. This is useful when one or more signing public keys in the current account are compromised.

Note that it's the user's responsibility to transfer the funds to the new account immediately after the migration to prevent malicious users from spending funds using the compromised keys.

@spec sdk.ts migrateAccount

```js
import { GrumpkinAddress } from '@aztec/sdk';
import { randomBytes } from 'crypto';

async function demoRecoveryData(aztecSdk) {
  // create a new user
  const privacyKey = randomBytes(32);
  const user0 = await aztecSdk.addUser(privacyKey);
  const accountPublicKey = user0.getUserData().publicKey;
  const alias = randomBytes(5).toString();

  // create a new account
  const signer1 = aztecSdk.createSchnorrSigner(randomBytes(32));
  const signer2 = aztecSdk.createSchnorrSigner(randomBytes(32));
  console.info('Creating proof...');
  const txHash = await user0.createAccount(
    alias,
    signer1.getPublicKey(),
    signer2.getPublicKey(),
  );
  console.info(`Proof accepted by server. Tx hash: ${txHash}`);

  console.info('Waiting for tx to settle...');
  await aztecSdk.awaitSettlement(txHash);
  console.info('Account created!');

  // get the newly created user with nonce = 1
  const userId1 = new AccountId(accountPublicKey, 1);
  const user1 = await aztecSdk.getUser(userId1);

  // signer1 is compromised, migrate the account
  console.info('Creating proof...');
  const migrateTxHash = await user1.migrateAccount(
    signer2,
    signer2.getPublicKey(),
  );
  console.info(`Proof accepted by server. Tx hash: ${migrateTxHash}`);

  console.info('Waiting for tx to settle...');
  await aztecSdk.awaitSettlement(migrateTxHash);
  console.info('Account recovered!');

// get the migrated account with nonce = 2
  const userId1 = new AccountId(accountPublicKey, 2);
  const user2 = await aztecSdk.getUser(userId2);

  // remove these demo users from your device
  await aztecSdk.removeUser(user0.id);
  await aztecSdk.removeUser(user1.id);
  await aztecSdk.removeUser(user2.id);
}
```

## See Also

- **[Create account](/#/User/createAccount)**
- **[Add new signing keys](/#/User/addSigningKeys)**
- **[Recover account](/#/User/recoverAccount)**
  