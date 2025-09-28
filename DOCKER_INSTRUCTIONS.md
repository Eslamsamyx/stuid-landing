# Docker Instructions for StuID Landing Page

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

## Files Created
- `Dockerfile` - Production multi-stage build
- `Dockerfile.dev` - Development build
- `docker-compose.yml` - Production orchestration
- `docker-compose.dev.yml` - Development orchestration
- `.dockerignore` - Files to exclude from Docker context

## Production Build

### Build the production image:
```bash
docker build -t stuid-landing:latest .
```

### Run the production container:
```bash
docker run -p 3000:3000 --name stuid-landing stuid-landing:latest
```

### Or use docker-compose:
```bash
docker-compose up -d
```

## Development Mode

### Build and run development container:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Environment Variables

Add your SendGrid credentials in docker-compose.yml:
```yaml
environment:
  - SENDGRID_API_KEY=your_api_key_here
  - SENDGRID_SENDER_EMAIL=your_sender_email
  - SENDGRID_RECIPIENT_EMAIL=your_recipient_email
```

Or create a `.env` file and reference it:
```yaml
env_file:
  - .env
```

## Commands

### Build image:
```bash
docker build -t stuid-landing:latest .
```

### Run container:
```bash
docker run -p 3000:3000 stuid-landing:latest
```

### Stop container:
```bash
docker stop stuid-landing
```

### Remove container:
```bash
docker rm stuid-landing
```

### View logs:
```bash
docker logs stuid-landing
```

### Interactive shell:
```bash
docker exec -it stuid-landing sh
```

## Docker Compose Commands

### Start services:
```bash
docker-compose up -d
```

### Stop services:
```bash
docker-compose down
```

### Rebuild and start:
```bash
docker-compose up --build -d
```

### View logs:
```bash
docker-compose logs -f
```

## Access the Application

Once running, the application will be available at:
- http://localhost:3000

## Production Optimizations

The production Dockerfile uses:
- Multi-stage build to reduce image size
- Node Alpine images for smaller footprint
- Non-root user for security
- Standalone Next.js build for optimal performance
- Layer caching for faster rebuilds

## Image Size
- Production image: ~150MB
- Development image: ~350MB