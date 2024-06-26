# Cedar Backend: Analytics as a Service

## Introduction
Cedar Backend is a Node.js application that serves as an Analytics as a Service platform, designed to provide scalable and efficient analytics capabilities to its users. It integrates with Azure Active Directory for secure authentication and utilizes PostgreSQL as the database managed through Sequelize ORM.

## Architecture
The Cedar backend follows a layered architecture that separates concerns and promotes scalability and maintainability:

- **Presentation Layer**: Exposes RESTful API endpoints for interaction with the analytics service.
- **Business Logic Layer**: Handles core business logic including data aggregation, filtering, and visualization.
- **Data Access Layer**: Utilizes Sequelize ORM to interact with the PostgreSQL database, ensuring efficient data storage and retrieval.
- **Integration Layer**: Integrates with Azure Active Directory for user authentication and authorization.

## Technologies Used
- **Node.js**: Runtime environment for executing JavaScript code server-side.
- **Express.js**: Web application framework for Node.js, used to build RESTful APIs.
- **Sequelize**: Promise-based ORM for Node.js, used for managing PostgreSQL database interactions.
- **PostgreSQL**: Open-source relational database management system.
- **Azure Active Directory**: Provides secure authentication and access control for users.
- **Swagger**: Used for API documentation, accessible at `/docs`.

## Features
- **Authentication**: Secure login using Azure Active Directory credentials.
- **Analytics Services**: Provides a range of analytics functionalities including data aggregation and visualization.
- **Scalability**: Designed to handle large volumes of data and concurrent user requests.
- **Documentation**: Comprehensive API documentation available at `/docs`.

## Installation
1. **Clone Repository:**
   ```bash
   git clone https://github.com/your/repository.git
   cd repository
2. **Install Dependencies:**
  npm install
3. **Set Up Database: **
Ensure PostgreSQL is installed and running.
Configure the database connection in config/database.js.
4. **Set Environment Variables:**
Create a .env file  and configure necessary variables.
5. **Start the Server:**
npm start


