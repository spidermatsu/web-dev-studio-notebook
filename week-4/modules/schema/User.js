const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    magicLink: {
        type: String
    },
    joinTime: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);