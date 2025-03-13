# Sheba's Medical Scheduling System

## Overview
Welcome to **Sheba's Medical Scheduling System**, an easy-to-use platform that allows users to schedule and manage their medical appointments efficiently. The system provides features to search for doctors, select available time slots, and manage appointments—all within a seamless interface.

---

## Setup Instructions

### Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

### Steps to Set Up

1. **Clone the repository**
   -git clone https://github.com/your-username/sheba-medical-scheduling.git
   -cd sheba-medical-scheduling
   
2. **Install dependencies for the server and start the appication**
   -cd server
   
   -2.1. npm install
   -2.2 npm start
   
3. **Install dependencies for the client and start the appication**
   -cd ..
   -cd client
   
   -3.1. npm install
   -3.2 npm start

---

## Architecture Decisions

1. **Component-Based Architecture (React)**
   I used React for building the front-end as it allows to create reusable components, making the development process more efficient.
   The components interact with each other via props and state, and I utilize React hooks for managing state and lifecycle.

2. **State Management**
   State management is achieved using React's Context API for global state management, particularly for managing the user’s appointments.
   The AppointmentsContext provides all the necessary state and functions, ensuring that multiple components in the app have access to shared state.

3. **Backend - Node.js**
   The backend of the system is built using **Node.js** due to its asynchronous, event-driven nature, which allows it to handle multiple concurrent requests efficiently.
   This is ideal for a scheduling system where numerous requests (appointments, rescheduling, cancellations) can occur simultaneously.
   The Node.js server listens for API requests and interacts with the MongoDB database to fetch or modify the necessary data.

   Additionally, **Express.js** is used to structure the API, providing a minimal and flexible framework for routing and middleware.
   This ensures clean separation of concerns and simplifies the handling of API requests.

4. **Database - MongoDB**
   **MongoDB** is chosen for the database due to its document-based design.
   This flexibility allows to store varied types of data, such as user profiles, appointments, and doctors' information, without requiring a fixed schema.
   Given the nature of medical scheduling, where data can evolve (e.g., doctors' schedules, patient information), MongoDB’s schema-less approach fits well.
   MongoDB's ability to scale horizontally ensures that the application can handle an increasing number of users and appointments as the system grows.

   Using **Mongoose**, a MongoDB object modeling tool, provides a structured way to interact with the database and ensures data validation and query optimization.

5. **Database Design**
   - **Users Collection**: Stores patient details and authentication credentials.
   - **Doctors Collection**: Contains doctor profiles, specialties, and assigned medical fields.
   - **Appointments Collection**: Tracks scheduled appointments, their status and appointments history.
   - **Medical Fields Collection**: Stores different specialties and links them to relevant doctors.

6. **API Design (RESTful API)**
   The communication between the front-end and back-end is done using **RESTful APIs**.
   These APIs adhere to standard HTTP methods (GET, POST, PUT, DELETE) for interacting with resources such as appointments, users, doctors, and medical fields.
   This structure provides clarity and scalability for the system, as each API endpoint is responsible for a specific operation on the data(e.g., fetching user appointments,
   booking a new appointment, etc.).

   The API is designed to be **stateless**, meaning each request contains all necessary information (e.g., authentication tokens, request data) for processing.
   I use **JWT (JSON Web Tokens)** for authentication and authorization, ensuring that sensitive data is only accessible by authorized users.

---

## Features Implemented
1. **User Authentication (Sign-In)**
   Users can sign in using their phone number.
   Once logged in, they can access the scheduling system.
   
2. **Managing Appointments**
   Users can book appointments by selecting a medical field, doctor, and available date/time.
   Reschedule or cancel appointments as necessary.
   Availability is dynamically updated based on the selected fields.
   
3. **Viewing personal Appointments**
   Users can view their upcoming appointments.
   View their appointments history.
   
