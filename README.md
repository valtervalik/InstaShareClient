# InstaShareClient Setup Guide

This guide provides step-by-step instructions to set up and run the InstaShareClient project.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

1. **Node.js** (version 16 or newer) - [Download Node.js](https://nodejs.org/)
2. **pnpm** (latest)

## Steps to Set Up the Project

Follow these steps to get the project up and running:

### 1. Clone the Repository
Clone the repository to your local machine using the following command:
```bash
git clone https://github.com/valtervalik/InstaShareClient.git
```

Navigate into the project directory:
```bash
cd InstaShareClient
```

2. Install Dependencies
Install the required dependencies by running:
```bash
pnpm install
```

3. Configure Environment Variables
Make a copy of .env.example:

```bash
cp .env.example .env
```

4. Run the Development Server
Start the development server with the following command:

```bash
pnpm dev
```
The application will be accessible at http://localhost:3000.

Building and Running for Production
To build and run the application in production mode, follow these steps:

1. Build the Application
Generate the production build:

```bash
pnpm build
```

2. Start the Production Server
Run the production server:

```bash
pnpm start
```
The application will be available at http://localhost:3000.

Additional Notes
Refer to the package.json file for additional scripts and commands.
Ensure the required environment variables are properly configured before running the application.
