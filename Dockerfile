# Use the official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Default command runs all tests
CMD ["npx", "playwright", "test", "--reporter=list,allure-playwright"]
