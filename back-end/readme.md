# Backend

### signature/add

- to
- value
- data
- operation
- signature
- owner

After receiving the submission

Retrieve dataHash from the contract

Retrieve data from the contract

Call `checkNSignatures(hash, data, signature, 1)`. If successful, store it in the database; if not, return an error.

Database storage

- to
- value
- data
- operation
- signature
- owner
- txData
- txHash (hash of txData)
- id (auto increment)

### signature/exec

TODO: Permission management

- txHash
- execTimeStamp

It will fetch all signatures from the database ordered by owner in ascending order, retrieve `getThreshold` from the contract, and if the number of signatures is greater than the threshold, it will insert into the database.

Implement a loop that runs once a minute to read scheduled upgrade tasks from the database.