# Orderly Backend

## Requirements

-   Node 20

## Installation

1. Open this folder in the terminal and run:

    ```bash
    cp .env.example .env  # since no sensitive information are contained, this is all you'll need
    npm install
    ```

2. Enter the Docker container:

    ```bash
    docker compose exec php bash
    ```

3. Inside the container, run:

    ```bash
    composer install
    php artisan key:generate
    php artisan migrate --seed
    ```

4. That's it! Installation complete.
