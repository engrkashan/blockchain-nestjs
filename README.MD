## Here’s a detailed documentation outline for your Blockchain Price Monitoring and Alert System built with NestJS .

# Blockchain Price Monitoring and Alert System Documentation

## Overview

The Blockchain Price Monitoring and Alert System is a NestJS application designed to track cryptocurrency prices (Ethereum and Polygon), set price alerts, and notify users via email when their specified price targets are reached. It also includes functionality for calculating swap rates for Ethereum.

## Table of Contents

1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [Application Structure](#application-structure)
4. [Available Endpoints](#available-endpoints)
5. [Services](#services)
6. [Running the Application](#running-the-application)
7. [Testing API Endpoints](#testing-api-endpoints)
8. [Scheduler & Background Tasks](#scheduler--background-tasks)
9. [Error Handling](#error-handling)
10. [Future Improvements](#future-improvements)

---

## Installation

1.  Clone the Repository:

## bash
git clone <repository-url>
cd blockchain-nestjs

2.  Install Dependencies:

## bash
npm install

3.  Set up Docker (Optional):

- Ensure Docker is installed and running if you plan to use Docker for a containerized setup.

4.  Run Docker Compose:

## bash
docker-compose up --build

5.  Run Migrations (for Prisma):

## bash
npx prisma migrate dev

## Environment Variables

The application uses several environment variables stored in a `.env` file in the root directory:

- Database Configuration
- `DATABASE_URL`: Database connection URL.
- Email Configuration
- `EMAIL_HOST`: SMTP host for email notifications.
- `EMAIL_USER`: Email address for sending notifications.
- `EMAIL_PASS`: Password for the email account.
- Blockchain Price API (Moralis)
- `MORALIS_API_KEY`: API key for accessing the Moralis API.

Create a `.env` file with the required variables as shown below:

## .env
DATABASE_URL=your_database_url
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
MORALIS_API_KEY=your_moralis_api_key

## Application Structure

- src/prices : Contains the main business logic for fetching prices, saving data, and handling alerts.
- src/notifications : Manages email notifications and alert notifications.
- src/prisma : Database connection and Prisma integration.
- src/moralis : API configurations and helpers for Moralis API integration.

## Available Endpoints

### 1. Get Hourly Prices

- Endpoint : `GET /prices/hourly`
- Description : Retrieves hourly prices from the past 24 hours.
- Response : Returns a list of prices, ordered by creation time.

### 2. Set Price Alert

- Endpoint : `POST /prices/alert`
- Description : Sets an alert for a specific price target.
- Request Body :

json
{
"chain": "Ethereum",
"targetPrice": 2000,
"email": "user@example.com"
}

- Response : Confirmation of the alert set with `id`, `chain`, `targetPrice`, `email`.

### 3. Get Swap Rate

- Endpoint : `POST /prices/swap-rate`
- Description : Calculates the swap rate for Ethereum.
- Request Body :

json
{
"ethAmount": 1.5
}

- Response :

json
{
"btcEquivalent": 0.045,
"ethFee": 0.045,
"dollarFee": 0.045
}

## Services

### 1. PricesService

- Methods :
- `getHourlyPrices`: Fetches Ethereum and Polygon prices from the last 24 hours.
- `setAlert`: Sets a price alert for a specified chain and price.
- `fetchAndSavePrices`: Periodically fetches ETH and Polygon prices and saves them to the database.
- `checkAndSendPriceAlerts`: Checks if any alerts have been met and sends notifications if necessary.
- `getSwapRate`: Calculates the equivalent BTC and fees for a given amount of ETH.

### 2. EmailService

- Description : Manages email notifications for price alerts.
- Methods :
- `sendEmail`: Sends an email with specified recipient, subject, and message content.

### 3. Scheduler

- Purpose : Fetches and saves prices at regular intervals (e.g., every 5 minutes).
- Configuration : Scheduled using the `@nestjs/schedule` module.

## Running the Application

To run the application locally:

## bash
npm run start:dev

With Docker:

## bash
docker-compose up --build

The server should be accessible at `http://localhost:3000` (or the specified port in your `.env`).

## Testing API Endpoints

To test the API endpoints, use [Postman](https://www.postman.com/) or similar tools. Ensure the server is running and send requests to `http://localhost:3000` or the specified port in your environment variables.

### Example Tests

#### Set an Alert:

- POST `/prices/alert`
- Body:
  json
  {
  "chain": "Ethereum",
  "targetPrice": 2000,
  "email": "user@example.com"
  }

#### Calculate Swap Rate:

- POST `/prices/swap-rate`
- Body:
  json
  {
  "ethAmount": 1.5
  }

## Scheduler & Background Tasks

- The application uses the `@nestjs/schedule` module for periodic tasks.
- fetchAndSavePrices : Runs every 5 minutes to fetch and save the latest prices for Ethereum and Polygon.

## Error Handling

- Errors are logged and handled using `InternalServerErrorException` and `BadRequestException` from `@nestjs/common`.
- Error Logs : Important events and errors are logged using the NestJS `Logger` service.

## Future Improvements

- Add Additional Cryptocurrencies : Expand to support more cryptocurrencies.
- WebSocket Integration : Use WebSockets for real-time price alerts.
- Historical Price Data : Enhance API to provide historical price analysis and trends.
- Advanced Notification Options : Support SMS or push notifications in addition to email.

---

This documentation should provide a comprehensive overview for setup, usage, and testing of the Blockchain Price Monitoring and Alert System built with NestJS . Let me know if you need more details on any section!
