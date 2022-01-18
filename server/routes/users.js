const express = require("express");
const router = express.Router();
const User = require("../models/User");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const checkUserLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};

// ---------------------- Get ----------------------------
// Get user
router.get("/", checkUserLoggedIn, async (req, res) => {
    try {
        const user_id = req.session.passport.user;
        const user = await User.findById(user_id);
        //If fields is passed as a parameter, this block of code only responds with the given fields
        const output_obj = {
            displayName: user.displayName,
            profileIcon: user.profileIcon,
            bio: user.bio,
            description: user.description,
            tutor: user.tutor,
            student: user.student,
            username: user.username,
            startDate: user.startDate,
            id: user_id,
        };
        const fields_arr = req.query.fields
            ? req.query.fields
            : Object.keys(output_obj);
        res.json(
            Object.fromEntries(
                Object.entries(output_obj).filter(([key, value]) =>
                    fields_arr.includes(key)
                )
            )
        );
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get user profile
router.get("/profile/:username", async (req, res) => {
    try {
        const user_id = req.session?.passport?.user;
        const username = req.params.username;
        const requesting_user = await User.findById(user_id);
        const user = await User.findOne({ username: username });
        if (user) {
            res.json({
                id: user._id,
                profileIcon: user.profileIcon,
                displayName: user.displayName,
                bio: user.bio,
                tutor: user.tutor,
                student: user.student,
                pendingStudent:
                    requesting_user?.tutorDeets?.studentRequests?.includes(
                        user._id
                    ),
                currentStudent: requesting_user?.tutorDeets?.students?.includes(
                    user._id
                ),
                startDate: user.startDate,
                isCurrentUser: user._id.toString() === user_id.toString(),
                currentUserTutor: requesting_user.tutor,
            });
        } else {
            res.send({ err: "User does not exist!" });
        }
    } catch (err) {
        res.status(400).send({ err: err.toString() });
    }
});

// Put
router.post("/put/", async (req, res) => {
    console.log("---------");
    console.log(req.body);

    try {
        const user_id = req.session.passport.user;
        user = await User.findById(user_id);

        if (req.body.student) {
            user.student = req.body.student;
            if (!user.studentDeets) {
                user.studentDeets = {
                    tutors: [],
                    tutorRequests: [],
                    blockedTutors: [],
                    sets: [],
                };
            }
        }
        if (req.body.tutor) {
            user.tutor = req.body.tutor;
            if (!user.tutorDeets) {
                user.tutorDeets = {
                    sets: [],
                    students: [],
                    studentRequests: [],
                };
            }
        }
        if (req.body.username?.length | (req.body.username?.length === 0)) {
            //If string sent or empty string sent
            if (req.body.username.length < 4 || req.body.username.length > 36) {
                res.status(400).json({
                    err: "Username must be between 4 and 36 characters",
                });
                return { err: "username" }; //This is just to exit the function, doesn't do anything
            } else {
                const matches = await User.find({
                    username: req.body.username,
                });
                if (matches.length && req.body.username != user.username) {
                    res.status(400).json({
                        err: "Username is already taken",
                    });
                    return { err: "username" }; //This is just to exit the function, doesn't do anything
                } else {
                    user.username = req.body.username;
                }
            }
        }
        if (
            req.body.displayName?.length |
            (req.body.displayName?.length === 0)
        ) {
            if (req.body.displayName.length > 80) {
                res.status(400).json({
                    err: "That display name is really long. Maybe make it less than 80 characters.",
                });
                return { err: "display_name" };
            } else if (!req.body.displayName) {
                res.status(400).json({
                    err: ":/ That's not a display name.",
                });
                return { err: "display_name" };
            } else {
                user.displayName = req.body.displayName;
            }
        }
        if (req.body.bio?.length | (req.body.bio?.length === 0)) {
            if (req.body.bio.length > 512) {
                res.status(400).json({
                    err: "That bio is really long. Maybe make it less than 513 characters.",
                });
                return { err: "bio" };
            } else {
                user.bio = req.body.bio;
            }
        }
        user.save()
            .then((data) => {
                res.sendStatus(200);
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (err) {
        console.log({ err });
        res.status(400).send(err);
    }
});
// router.post("/put/", async (req, res) => {
//     console.log("----------work now----------");
//     console.log(req.body);
//     try {
//         const user_id = req.session.passport.user;
//         const verifyUsername = async (username, current_username) => {
//             if (username === current_username) {
//                 return {};
//             } else {
//                 return new Promise(async (resolve, reject) => {
//                     if (username.length < 4 || username.length > 36) {
//                         resolve({
//                             err: "Username must be between 4 and 36 characters",
//                         });
//                     } else if (!/^[a-z0-9_\-]+$/.exec(username)) {
//                         resolve({
//                             err: "Username may only contain letters A-Z, numbers 0-9, -, and _",
//                         });
//                     } else {
//                         await User.find(
//                             { username: username },
//                             (err, temp_users) => {
//                                 if (temp_users.length) {
//                                     resolve({ err: "Username already taken" });
//                                 } else {
//                                     resolve({});
//                                 }
//                             }
//                         );
//                     }
//                 });
//             }
//         };

//         const verifyDisplayName = (displayName) => {
//             if (displayName.length > 73) {
//                 return {
//                     err: "That display name is really long. Maybe make it less so.",
//                 };
//             } else if (!displayName) {
//                 return {
//                     err: "That display name is really boring. Make it something.",
//                 };
//             } else {
//                 return {};
//             }
//         };

//         const verifyBio = (bio) => {
//             if (bio.length > 512) {
//                 return { err: "Bio must not be more than 512 characters" };
//             } else {
//                 return {};
//             }
//         };

//         User.findById(user_id, async (err, user) => {
//             //Finds Tutor from id and passes it into tutor var
//             req.body.displayName = req.body.displayName?.trim();
//             if (req.body.username?.length | (req.body.username === "")) {
//                 console.log("Trace 1");
//                 const username_verification = await verifyUsername(
//                     req.body.username,
//                     user.username
//                 );
//                 if (username_verification.err) {
//                     console.log("Trace 2");
//                     res.status(400).json(username_verification);
//                     return { err: "username" };
//                 } else {
//                     console.log("Trace 3");
//                     user.username = req.body.username;
//                     console.log(user);
//                 }
//             }
//             if (req.body.displayName | (req.body.displayName === "")) {
//                 console.log("Trace 4");
//                 const display_name_verification = verifyDisplayName(
//                     req.body.displayName
//                 );
//                 if (display_name_verification.err) {
//                     res.status(400).json(display_name_verification);
//                     return { err: "display_name" };
//                 } else {
//                     user.displayName = req.body.displayName;
//                 }
//             }
//             if (req.body.bio | (req.body.bio === "")) {
//                 const bio_verification = verifyBio(req.body.bio);
//                 if (bio_verification.err) {
//                     res.status(400).json(bio_verification);
//                     return { err: "bio" };
//                 } else {
//                     user.bio = req.body.bio;
//                 }
//             }

//             if (req.body.student || req.body.tutor) {
//                 user.tutor = req.body.tutor;
//                 user.student = req.body.student;
//                 if (req.body.tutor && !user.tutorDeets) {
//                     user.tutorDeets = {
//                         sets: [],
//                         students: [],
//                         studentRequests: [],
//                     };
//                 }
//                 if (req.body.student && !user.studentDeets) {
//                     user.studentDeets = {
//                         tutors: [],
//                         tutorRequests: [],
//                         blockedTutors: [],
//                         sets: [],
//                     };
//                 }
//             }

//             user.save()
//                 .then((data) => {
//                     res.sendStatus(200);
//                 })
//                 .catch((err) => {
//                     res.send(err);
//                 });
//         });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// Post

module.exports = router;
