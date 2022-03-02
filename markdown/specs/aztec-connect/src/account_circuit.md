# Account Circuit

### Circuit Description

The Account Circuit allows the transfer of keys that control notes.
Unlike the Rollup Circuit, which _always_ adds nullifiers to the tree, the Account Circuit _conditionally_ adds nullifiers to the tree.

#### Account Circuit: Worked Example

1. Alice generates a grumpkin key pair (`account_key`)
1. Alice can receive funds prior to registering an `alias` at `account_value_id = (account_public_key, 0)`
1. On registration of the alias 'alice', the `account_id = (alice, 0)` is nullified, and new spending keys are associated with `(alice, 1)`
1. Alice transfers received funds at `(account_public_key, 0)`, to `(account_public_key, 1)`
1. Alice registers additional spending keys to `(alice, 1)`
1. If a spending key becomes compromised, Alice nullifies `account_id = (alice, 1)`, associating new spending keys with `(alice, 2)`
1. Alice transfers funds at `(account_public_key, 1)`, to `(account_public_key, 2)`

### Circuit Inputs: Summary

The inputs for the account circuit are:

$$ \text{Account Inputs} = (\text{Public Inputs}, \text{Private Inputs}) \in \mathbb{F}\_p^{13} \times \mathbb{F}\_p^{25}$$

As previously, the field $\mathbb{F}_p$ is from the BN254 specification.

### Public Inputs: Detail

Recall that all inner circuits must have the **same number of public inputs** as they will be used homogenously by the rollup circuit.

1. `proof_id`
1. `output_nc_1` (nc is short for note commitment)
1. `output_nc_2`
1. `nullifier_1`
1. `nullifier_2`
1. `public_value`
1. `public_owner`
1. `public_asset_id`
1. `data_tree_root`
1. `tx_fee`
1. `tx_fee_asset_id`
1. `bridge_id`
1. `defi_deposit_value`
1. `defi_root`

### Private Inputs: Detail

1. `input_note_1.val`
2. `input_note_1.secret`
3. `input_note_1.account_id`
4. `input_note_1.asset_id`
5. `input_note_2.val`
6. `input_note_2.secret`
7. `input_note_2.account_id`
8. `index_1`
9. `index_2`
10. `input_note_2.asset_id`
11. `output_note_1.val`
12. `output_note_1.secret`
13. `output_note_1.account_id`
14. `output_note_1.asset_id`
15. `output_note_2.val`
16. `output_note_2.secret`
17. `output_note_2.account_id`
18. `output_note_2.asset_id`
19. `account_note.account_id`
20. `account_note.npk` (npk=nullifier public key)
21. `account_note.spk` (spk=spending public key)
22. `index_ac`
23. `note_num`
24. `nk` (nullifier private key)
25. `signature`

### Index of Functions

None

### Circuit Logic (Pseudocode)

Computed vars:

- `alias_hash` = `account_id.slice(0, 28)`
- `nonce` = `account_id.slice(28, 4)`
- `output_nonce` = `migrate + nonce`
- `output_account_id` = `alias_hash + (output_nonce * 2^224)`
- `assert_account_exists` = `nonce != 0`
- `signer` = `nonce == 0 ? account_public_key : signing_public_key`
- `message` = `pedersen(account_public_key, account_id, spending_public_key_1.x, spending_public_key_2.x)`
- `account_note_data` = `pedersen(account_id, account_public_key.x, signer.x)`

Computed public inputs:

- `output_note_1` = `pedersen(output_account_id, account_public_key.x, spending_public_key_1.x)`
- `output_note_2` = `pedersen(output_account_id, account_public_key.x, spending_public_key_2.x)`
- `nullifier_1` = `pedersen(proof_id, account_id) * migrate`
- `nullifier_2` = `0`
- `public_value` = `0`
- `public_owner` = `0`
- `asset_id` = `0`
- `tx_fee` = `0`
- `tx_fee_asset_id` = `0`
- `bridge_id` = `0`
- `defi_deposit_value` = `0`
- `defi_root` = `0`

Circuit constraints:

- `migrate == 1 || migrate == 0`
- `verify_signature(message, signer, signature) == 1`
- `membership_check(account_note_data, account_note_index, account_note_path, data_tree_root) == assert_account_exists`