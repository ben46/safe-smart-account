# Frontend

Develop using React and TypeScript.

Connect the wallet using `ethers`.

Communicate with the backend using RESTful APIs, with the format as JSON.

# Home Page

Upon entering, there are two large buttons: "I am the Boss" and "I am the Tech Person."

# I am the Tech Person Page

Fill in the upgrade details, which include the following fields:
- calldata (long text input)
- Upgrade content (long text input)
- Version number (string)
- Submitter's email
- Submitter's name

# I am the Boss Page

The boss selects the upgrade content from a dropdown (the dropdown displays version numbers, with one pre-selected). After selection, the details filled out by the tech team will be displayed.

### After selecting an item from the dropdown, the following will appear:

A list with three columns: the first column displays the wallet address, the second column shows whether it has been signed, and the third column shows the signing time.

A sign button, which when clicked will pop up the MetaMask wallet to sign the calldata.

### When the number of signatures exceeds three, the following will display:

A button to set a scheduled task, which is a dropdown time component using UTC+8 time.