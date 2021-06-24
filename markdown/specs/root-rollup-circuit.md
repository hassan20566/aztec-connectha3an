---
tags: Specs
---
[edit](https://hackmd.io/hyOqv7pqQeqJ6tQL578Lzg)
# Root Rollup circuit

### ◈ Circuit Description

This circuit rolls up other rollup proofs.

It is defined by a parameter `rollup_num`, of inner rollups. Let's also denote $M:=$`rollup_num` for convenience.

### ◈ Circuit Inputs: Summary

The inputs for the root rollup circuit are:

$$ \text{Rool Rollup Inputs} = (\text{Public Inputs}, \text{Private Inputs}) \in \mathbb{F}_p^{27 + M * (12 * 32)} \times \mathbb{F}_p^{27M}$$

As previously, the field $\mathbb{F}_p$ is from the BN254 specification.

### ◈ Public Inputs 

1. For $i=1,..,M$
    1. A set $PI_i$ of public inputs of the roll-up circuit's inner-circuit proofs.
2. A pair of points $Q_{M+1}$ (given as 16 field elements as described in the rollup circuit)
3. `rollup_id` (The location where `new_root_M` will be inserted in the roots tree)
4. `rollup_size`
5. `data_start_index`
6. `old_data_root`
7. `new_data_root`
8. `old_null_root`
9. `new_null_root`
10. `old_root_root`
11. `new_root_root`

### ◈ Private Inputs

1. The recursive proof output of each inner rollup proof (4 $\mathbb{F}_q$ elements represented as 16 $\mathbb{F}_p$ elements, see above)
2. The remaining public inputs of each rollup proof

### ◈ Circuit Logic (Pseudocode)
1. For $i=2,..,M+1$, check that $Q_i = aggregate(PI_{i-1}, \pi_{i-1}, vk, Q_{i-1}, (i > 1))$
2. For $i=2,..,M$, check that `new_data_root`$_{i-1}$=`old_data_root`$_i$.
3. Validate `Update(old_data_roots_root, new_data_roots_root, rollup_id, new_data_root_M)`

where $vk$ is the verification key of the rollup circuit. 