FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port
EXPOSE 5173

# Run vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
