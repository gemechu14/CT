# CATER-STREET
# Cedar Backend: Analytics as a Service

## Introduction
Cedar Backend is a Node.js application that serves as an Analytics as a Service platform, designed to provide users with scalable and efficient analytics capabilities. It integrates with Azure Active Directory for secure authentication and utilizes PostgreSQL as the database managed through Sequelize ORM.

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
- **JWT (JSON Web Tokens)**: For user authentication and authorization.
- **Bcrypt.js**: Library for hashing passwords.
- **Axios**: HTTP client for making API requests.

## Features
- **User Management**: Manage user profiles, and authentication. This includes creating and updating user profiles, managing passwords, and assigning roles.
- **Multi-Tenant Support**: Manages multiple tenants (organizations) with isolated data and permissions per tenant.
- **Email Notifications**: Automatically sends an email notification when a new user is created, helping to improve onboarding and communication.
- **Dynamic Layouts per Tenant**: Tailored user interfaces based on tenant preferences, allowing customized layouts for each tenant.
- **Power BI Integration**: Supports embedding Power BI reports and dashboards, including handling report generation via the Power BI API.
- **Scheduled Power BI Capacity Management**: Automates the turning on and off of Power BI capacities at predefined time intervals to optimize resource usage.
- **Error Handling and Logging**: Centralized error handling with proper logging for troubleshooting and monitoring.


## Project Structure

- `index.js`: Entry point of the application.
- `routes/`: Contains route handlers for different API endpoints.
- `models/`: Defines Sequelize models for database entities.
- `controllers/`: Contains logic for handling business logic.
- `middleware/`: Middleware functions for authentication and error handling.
- `config/`: Configuration files for environment variables.
- `utils/`: Utility functions.
## Environment Variables  
To configure environment-specific settings, create a `.env` file in the root of your project. This file is used to set variables such as API endpoints, client IDs, and feature flags that your application needs to function correctly. Below are some common environment variables used in the Cedar Backend:

- `PORT`: The port on which the server will run.
- `EMAIL`: The email address for sending notifications.
- `DB_HOST`: Hostname of the PostgreSQL database.
- `DB_PORT`: Port for the PostgreSQL database.
- `DB_NAME`: Name of the PostgreSQL database.
- `DB_USER`: Username for the PostgreSQL database.
- `DB_PASSWORD`: Password for the PostgreSQL database.
- `CLIENT_ID_Microsoft`: Client ID for Microsoft authentication.
- `CLIENTSECRET_ID_Microsoft`: Client Secret for Microsoft authentication.
- `EMAIL_PASSWORD`: Password for the email account used for notifications.

### Reporting Hub
- `TENANT_ID`: The ID of the tenant for your application.
- `CLIENT_ID`: Client ID for accessing the Reporting Hub.
- `CLIENT_SECRET`: Client Secret for accessing the Reporting Hub.
- `SCOPE`: Required scope for API access.
- `SUBSCRIPTION_ID`: Azure subscription ID.
- `DEDICATEDCAPACITYNAME`: Name of the dedicated Power BI capacity.
- `RESOURCEGROUPNAME`: Name of the resource group in Azure.
- `APPVERSION`: Version of the application.

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
Create a .env file  and configure the necessary variables.
5. **Start the Server:**
npm start


