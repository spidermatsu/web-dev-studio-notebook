const mongoose = require("mongoose");
const User = require("./schema/User");

const createUser = async (email, callback) => {
    //finds a email and checks if it matches any other email
    const dupeEmail = await User.findOne({
        email: email
    }).exec();

    //returns DUPLICATE if it finds one
    if (dupeEmail) {
        return callback("DUPLICATE");
    }

    // tries to make a user
    try {
        await User.create({
            "email": email,
            "joinTime": new Date()
        });
        return callback("SUCCESS");

    } catch (err) {
        console.error(`Error in createUser: ${err}`);
        return callback("ERROR")
    }
};

const editUser = async (email, magicLink, callback) => {
    try {
        let user = await User.findOne({
            email: email
        }).exec();

        user.magicLink = magicLink;
        await user.save();

        return callback("SUCCESS")
    } catch (err) {
        console.error(`Error in editUser: ${err}`);
        return callback("ERROR")
    }

}

const removeUser = async (email, callback) => {
    try {
        let user = await User.findOne({
            email: email
        }).exec();
        if (!user) {
            return callback("NOT FOUND")
        }

        User.deleteOne({
            email: email
        }).exec();
        return callback("SUCCESS")

    } catch (err) {
        console.error(`Error in removeUser: ${err}`);
        return callback("ERROR")
    }
}

const getOldestUser = async (callback) => {
    try {

        let user = await User.find().sort({
            "joinTime": 1
        }).limit(1).exec();
        console.log(user)
        return callback(user[0])

    } catch (err) {
        console.error(`Error in getOldestUser: ${err}`);
        return callback("ERROR")
    }
}

const connectDB = async (callback) => {
    try {
        await mongoose.connect(process.env.MONGOURI), {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        return callback("SUCCESS")
    } catch (err) {
        console.error(`Error in connectDB: ${err}`);
        return callback("ERROR")
    }
};

const checkMagicLink = async (magicLink, callback) => {
    try {
        if (magicLink) {
            let user = await User.findOne({
                magicLink: magicLink
            }).exec();
            if (user) {
                return callback("SUCCESS")
            } else {
                return callback("FAIL")
            }
        }
    } catch (err) {
        console.error(`Error in checkMagicLink: ${err}`);
        return callback("ERROR")
    }
};

module.exports = {
    createUser,
    editUser,
    removeUser,
    getOldestUser,
    connectDB,
    checkMagicLink
}