const bcrypt = require("bcryptjs");

const password = "CHANGE_ME_TO_A_STRONG_PASSWORD";
const hash = bcrypt.hashSync(password, 12);
console.log(hash);