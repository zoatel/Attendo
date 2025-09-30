# Attendo

Attendo is a budget-friendly attendance management system designed for educational institutions. It leverages existing infrastructure and affordable components to streamline student attendance tracking and provide instructors with powerful tools for managing classes and sessions.

## Overview

Attendo enables students to register their attendance using RFID tags linked to their student accounts and mobile devices. Instructors can easily manage batches, courses, sessions, and download attendance statistics, all through a user-friendly web interface.

## Key Features

- **Student Attendance Registration:**  
  Students receive an RFID tag linked to their account and mobile device MAC address via the React Native mobile app. Attendance is registered when the student scans their RFID tag with their mobile phone nearby and Bluetooth enabled.

- **Instructor Dashboard:**  
  Instructors use the web application to:

  - Add batches of students
  - Create courses and sessions
  - Assign class halls (RFID nodes)
  - Control session timing (open/close attendance)
  - Download attendance and grade statistics

- **Session Management:**  
  Attendance can only be registered during active sessions. Once a session ends, no further attendance is allowed.

- **Statistics & Reports:**  
  Instructors can export attendance and grade data for individual sessions, courses, or entire batches.

- **Student Tracking:**  
  Students can view their attendance records for all enrolled courses via the mobile app.

## System Architecture

- **RFID Nodes:**  
  Placed in classrooms to detect student RFID tags.

- **Bridge Node & Gateway Node:**  
  ESP devices that facilitate communication between RFID nodes and the backend.

- **Mobile Application:**  
  React Native app for students to link RFID tags, register attendance, and track their records.

- **Web Application:**  
  Vite + React-based frontend for instructors to manage the system.

- **Backend:**  
  Node.js server handling authentication, session management, and data storage.

## How It Works

1. **Student Setup:**

   - Student receives an RFID tag.
   - Links RFID tag and mobile MAC address to their account using the mobile app.

2. **Attendance Registration:**

   - Student scans RFID tag in class with mobile phone nearby and Bluetooth enabled.
   - System verifies both RFID and mobile device presence before marking attendance.

3. **Instructor Actions:**
   - Creates batches, courses, and sessions via the web dashboard.
   - Assigns RFID nodes to class halls.
   - Starts and ends sessions to control attendance windows.
   - Downloads attendance and grade reports.

## ESP Node Setup

- **Gateway Node:** Central communication hub.
- **Bridge Node:** Connects gateway to multiple RFID nodes.
- **RFID Nodes:** Placed in classrooms for student check-in.

## Installation & Setup

1. **Backend:**

   - Navigate to `BACK/` and run `npm install` to install dependencies.
   - Start the server with `node main.js`.

2. **Frontend:**

   - Navigate to `FRONT/` and run `npm install`.
   - Start the web app with `npm run dev`.

3. **Mobile App:**

   - Navigate to `MOBILE/` and run `npm install`.
   - Use Expo or React Native CLI to run the app on your device.

4. **ESP Nodes:**
   - Flash the provided code in `ESPs/` to your ESP devices.
   - Deploy nodes in classrooms as needed.

## Budget-Friendly Approach

Attendo is designed to minimize costs by:

- Using affordable RFID and ESP components
- Leveraging students’ existing mobile devices
- Avoiding proprietary or expensive hardware

## Screenshots

<img width="1200" height="568" alt="Picture1" src="https://github.com/user-attachments/assets/d30b5253-1735-4074-997b-956a57f02748" />
<img width="1198" height="566" alt="Picture2" src="https://github.com/user-attachments/assets/67baceb2-f0c6-456c-96af-8c22377e069e" />
<img width="1179" height="555" alt="Picture3" src="https://github.com/user-attachments/assets/84703bb2-f9b4-4f91-ac0d-027bcaa3514b" />
<img width="1165" height="548" alt="Picture4" src="https://github.com/user-attachments/assets/32fb2bed-caa6-4603-a602-4fbae17a8b7d" />
![Picture5](https://github.com/user-attachments/assets/1d7c92c1-c56e-4214-bff3-431d1c59562c)
![Picture6](https://github.com/user-attachments/assets/85e3bca2-b1e4-45ea-a7c9-7edbf946a97c)


## Contributing

Contributions are welcome! Please open issues or submit pull requests to help improve Attendo.

## License

[MIT License](LICENSE)
