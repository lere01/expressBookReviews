const express = require('express');
const jwt = require('jsonwebtoken');
var _ = require('lodash');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(item => item.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(item => item.username === username && item.password === password);
}


const getUserFromSession = (req) => {
    return jwt.decode(req.session.authorization['accessToken'])['data']['username'];
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    if (!(username && password)) return res.status(400).json({ message: "empty request body" });

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign(
            { data: { username, password } },
            "access",
            { expiresIn: 60 * 60 }
        )

        req.session.authorization = {
            accessToken
        }

        res.status(200).send("user successfully logged in");
        return
    }

    return res.status(400).json({ message: "invalid user credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const reviews = books[isbn].reviews;
    const user = getUserFromSession(req);

    books[isbn]['reviews'][user] = review;

    if (user in reviews) {
        return res.status(200).send("review has been updated");
    } else {
        return res.status(200).send("review has been added")
    }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviews = books[isbn]['reviews'];

    delete books[isbn]['reviews'][user];
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
