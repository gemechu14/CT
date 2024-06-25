---

# My Equb Backend

Welcome to the backend of the My Equb project, developed using Spring Boot. This document provides an overview of the project, how to set it up, and detailed information about the location of various feature-handling functions within the codebase.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Feature Locations](#feature-locations)
  - [User Management](#user-management)
  - [Group Management](#group-management)
  - [Equb Management](#equb-management)
  - [Equb Members Management](#equb-members-management)
  - [Equb Actions Management](#equb-actions-management)
  - [Transaction Handling](#transaction-handling)
  - [Notification System](#notification-system)
  - [Job Scheduling](#job-scheduling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

"My Equb" is a backend service for managing equb (a traditional Ethiopian rotating savings and credit association). This service provides endpoints for user management, equb creation, swapping, lotting, selling, transaction handling, and more.

## Architecture
![image_2023_07_04T13_13_41_663Z (2)](https://github.com/CoopDxValley/equbmobile-backend/assets/68743748/e98e740f-17a8-4771-9485-2663053cfda6)


## Features

- User Registration and Authentication
- Share Management (Joining as a quarter, half and full member)
- Group Management (Creation, Inviation, Joining and Management)
- Equb Management (Creation, Invitation, Joining, Management)
- Equb Market place (Selling and Buying)
- Equb Swapping
- Transaction Handling 
- Notification System (Push and SMS Notification)
- Job Schudling
- Loan

## Technologies Used
- Java
- Spring Boot
- Spring Security
- Hibernate
- Pistgresql
- Maven
- Web Socket ( For Real time market place )
- Quartz Scheduler

## Project Structure
```
equbmobile-backend/
├── src/main/java/com/dxvalley/project
│   ├── config/          # Configuration classes
│   ├── controllers/     # REST controllers
│   ├── exceptions/      # Exception Handler classes
│   ├── FeignCalls/      # FeignClient Calls
│   ├── Logs/            # Log Filtering class
│   ├── models/          # Entity models
│   ├── oneSignal/       # Push Notification service
│   ├── repositories/    # Repository interfaces
│   ├── scheduledJobs/   # Equb Batch jobs and Schudler configuration
│   ├── security/        # Authentication and Authorization
│   ├── serviceImple/    # Implementation Classes Overriding Interfaces In services 
│   ├── services/        # Service classes
│   ├── socket/          # Test SocketIo module (not used)
│   ├── testFolder/      # Web Socket service and controller
│   ├── Utils/           # Utility classes
│   ├── Bootstrap.java/  # Database Seed Functions
│   └── EqubBackEndApplication.java  # Main application class
├── src/main/resources/
│   ├── application.yml  # Application configuration
├── pom.xml              # Project dependencies
└── README.md            # Project documentation
```

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/my-equb-backend.git
   cd my-equb-backend
   ```

2. **Configure the database**
   - Update the `application.yml` file with your database configurations.
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost/equb
   spring.datasource.username=equb
   spring.datasource.password=password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Install dependencies**
   ```bash
   mvn clean install
   ```

## Running the Application

- **Run the application**
  ```bash
  mvn spring-boot:run
  ```

- The application will be available at `http://localhost:9000`.

## Feature Locations

### User Management
- **Registration and Authentication**
  - **Controller**: `com.dxvalley.project.controllers.UserController`
  - **Repository**: `com.dxvalley.project.services.UserRepository`

### Group Management
- **Creation, Management**
  - **Controller**: `com.dxvalley.project.controllers.GroupController`
  - **Service**: `com.dxvalley.project.services.GroupService`
  - **Repository**: `com.dxvalley.project.repositories.GroupRepository`

### Equb Management
- **Creation, Starting, Management**
  - **Controller**: `com.dxvalley.project.controllers.EqubController`
  - **Service**: `com.dxvalley.project.services.EqubService`
  - **Repository**: `com.dxvalley.project.repositories.EqubRepository`
  - 
### Equb Members Management
- **Invitation, Joining, Rejecting**
  - **Controller**: `com.dxvalley.project.controllers.GroupMemberController`
  - **Service**: `com.dxvalley.project.services.GroupMemberService`
  - **Repository**: `com.dxvalley.project.repositories.GroupMembersRepository`
  - 
### Equb Actions Management
- **Selling, Buying, Swap Managment(including requesting, accepting and rejecting), Lotting**
  - **Controller**: `com.dxvalley.project.controllers.GroupMemberEqubController`
  - **Service**: `com.dxvalley.project.services.GroupMemberEqubService`
  - **Repository**: `com.dxvalley.project.repositories.GroupMemberEqubRepository`
    
### Transaction Handling
- **Handling transactions within equbs**
  - **Controller**: `com.dxvalley.project.controllers.TransactionsController`
  - **Service**: `com.dxvalley.project.services.TransactionsService`
  - **Repository**: `com.dxvalley.project.services.TransactionsRepository`

### Notification System
- **Sending notifications to users**
  - **Service**: `com.dxvalley.project.oneSignal.oneSignalService`

### Job Scheduling
- **Scheduled Jobs features and management**
  - **Job**: `com.dxvalley.project.scheduledJobs.EqubBatchJobs`
  - **Config**: `com.dxvalley.project.scheduledJobs.QuartzConfig`

## Contributing

We welcome contributions to enhance the My Equb project. Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License

This project is owned by Cooperative Bank of Oromia Innavation Hub.

---
