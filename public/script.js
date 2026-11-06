const eventForm = document.getElementById("eventForm");
const registrationForm = document.getElementById("registrationForm");
const eventList = document.getElementById("eventList");
const registrationList = document.getElementById("registrationList");
const eventSelect = document.getElementById("eventSelect");
const message = document.getElementById("message");

async function loadEvents() {
    const response = await fetch("/api/events");
    const events = await response.json();

    eventList.innerHTML = "";
    eventSelect.innerHTML = '<option value="">Select Event</option>';

    events.forEach(event => {
        const item = document.createElement("p");
        item.textContent = `${event.name} - ${event.date} - ${event.location}`;
        eventList.appendChild(item);

        const option = document.createElement("option");
        option.value = event.id;
        option.textContent = event.name;
        eventSelect.appendChild(option);
    });
}

eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const location = document.getElementById("eventLocation").value;

    await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date, location })
    });

    message.textContent = "Event added successfully!";
    eventForm.reset();
    loadEvents();
});

registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const studentEmail = document.getElementById("studentEmail").value;
    const eventId = eventSelect.value;

    await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, studentEmail, eventId })
    });

    message.textContent = "Registration successful!";
    registrationForm.reset();
    loadRegistrations();
});

async function loadRegistrations() {
    const response = await fetch("/api/registrations");
    const registrations = await response.json();

    registrationList.innerHTML = "";

    registrations.forEach(reg => {
        const item = document.createElement("p");
        item.textContent = `${reg.studentName} - ${reg.studentEmail} - ${reg.eventName}`;
        registrationList.appendChild(item);
    });
}

loadEvents();
loadRegistrations();
// Student Signup
document.getElementById("studentSignupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const response = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById("authMessage").textContent = data.message;

    if (response.ok) {
        document.getElementById("studentSignupForm").reset();
    }
});

// Student Login
document.getElementById("studentLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("authMessage").textContent = data.message;
});