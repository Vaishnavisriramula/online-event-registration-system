const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const db = new Database("events.db");

app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET || "event-lab-development-secret",
    resave: false,
    saveUninitialized: false
}));

db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date TEXT,
        location TEXT
    );

    CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT,
        studentEmail TEXT,
        eventId INTEGER
    );
`);

// Student Registration
app.post("/api/students/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must contain at least 6 characters"
        });
    }

    const existing = db.prepare(
        "SELECT id FROM students WHERE email = ?"
    ).get(cleanEmail);

    if (existing) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare(
        "INSERT INTO students (name, email, password) VALUES (?, ?, ?)"
    ).run(name.trim(), cleanEmail, hashedPassword);

    res.json({ message: "Student registered successfully" });
});

// Student Login
app.post("/api/students/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Enter email and password"
        });
    }

    const student = db.prepare(
        "SELECT * FROM students WHERE email = ?"
    ).get(email.trim().toLowerCase());

    if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    req.session.studentId = student.id;

    res.json({
        message: "Login successful",
        name: student.name
    });
});

// Events
app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events").all();
    res.json(events);
});

app.post("/api/events", (req, res) => {
    const { name, date, location } = req.body;

    db.prepare(
        "INSERT INTO events (name, date, location) VALUES (?, ?, ?)"
    ).run(name, date, location);

    res.json({ message: "Event added successfully" });
});

// Event Registration
app.post("/api/register", (req, res) => {
    const { studentName, studentEmail, eventId } = req.body;

    db.prepare(
        "INSERT INTO registrations (studentName, studentEmail, eventId) VALUES (?, ?, ?)"
    ).run(studentName, studentEmail, eventId);

    res.json({ message: "Registration successful" });
});

// View Participants
app.get("/api/registrations", (req, res) => {
    const registrations = db.prepare(`
        SELECT registrations.*, events.name AS eventName
        FROM registrations
        JOIN events ON registrations.eventId = events.id
    `).all();

    res.json(registrations);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});