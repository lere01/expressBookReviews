const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (isValid(username)) {
        return res.status(409).json({message: "Username exists"});
    }

    if (!username) {
        return res.status(400).json({message: "username not provided"})
    }

    if (!password) {
        return res.status(400).json({message: "password not provided"})
    }

    users.push({username, password});

    res.send(`User, ${username} successfully registered`);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let bookDetails = books[isbn];
    res.send(JSON.stringify({ bookDetails }, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let book_list = Object.entries(books);
    let bookDetails = Object.fromEntries(book_list.filter(item => item[1].author === author));
    res.send(JSON.stringify({ bookDetails }, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let book_list = Object.entries(books);
    let bookDetails = Object.fromEntries(book_list.filter(item => item[1].title === title));
    res.send(JSON.stringify({ bookDetails }, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    res.send(JSON.stringify({ reviews }, null, 4));
});

module.exports.general = public_users;
