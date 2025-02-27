# Orderly

A basic application for monitoring and managing orders.

## Overview

This application serves as a showcase of technical abilities, with a greater focus on frontend development rather than backend. Some architectural decisions would not be suitable for a real-world scenario, for example, retrieving all orders from the database and handling them client-side is not scalable. In a production environment, pagination, server-side filtering, and sorting would be necessary as the volume of orders increases, but for this demonstration, we will ignore this concern.

## Features

On the backend, basic CRUD operations for Orders, Products, and Clients entities are implemented. However, the Vue application only allows for creating, updating, and deleting orders. I made that decision to concentrate on the most complex case that would contain all other functionality.

The app works with the following entities:

- **Client**: Represents the fictional buyers
- **Product**: Represents the fictional products
- **Order**: Represents the clients' orders. Contains the status, what products and how many of them have been added to the order, and the payment
- **Payment**: Represents the payment linked to the order. A payment is automatically created during the order creation phase by the OrderController, to simulate a payment operation which is probably executed by a third party application

All required entities are installed during project setup using Laravel's DatabaseSeeder.

## Installation

1. Follow the instructions in the `README.md` of the backend folder
2. Then follow the instructions in the frontend folder's `README.md`
3. Return to this document

## Pre-configured Users

The backend installation comes with two pre-configured users, with different permissions:

| Email              | Password | Permissions                           |
| ------------------ | -------- | ------------------------------------- |
| admin@orderdly.com | admin    | Read, edit, create, and delete orders |
| user@orderly.com   | user     | Read-only access to orders            |

Once the Vue application is up and running, use one of them to access the application!

_Note: User creation functionality has not been implemented in this application._
