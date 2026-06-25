FROM node:18-bullseye-slim

# Install system dependencies for native packages (canvas, sqlite3, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpng-dev \
    libpixman-1-dev \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --production 2>&1 || npm install --production --ignore-scripts 2>&1

COPY . .

EXPOSE ${PORT:-3000}

CMD ["node", "index.js"]
