# To-Do List Next App

A modern, full-stack To-Do List application built with Next.js for managing day-to-day tasks efficiently. This project demonstrates modern development practices including containerization, CI/CD automation, and AI-assisted development workflows.

## 🎯 Hackathon Submission

This project is part of a hackathon submission showcasing:

- **Dockerization** of a Next.js application for consistent deployment
- **GitHub Actions CI/CD** workflow for automated builds and deployments
- **AI-assisted development** using Cline and CodeRabbit
- **Production deployment** on Vercel

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- 📱 Responsive design for all devices
- 🎨 Modern UI with intuitive user experience
- 🐳 Dockerized for easy deployment
- 🔄 Automated CI/CD pipeline
- ☁️ Production-ready deployment

## 🤖 AI-Assisted Development with Cline

This project leverages **Cline** (VS Code extension) to accelerate development:

### How Cline Helped

- **Command-driven file generation**: On my commands, Cline created the complete Dockerfile with multi-stage builds
- **CI/CD setup**: Generated the GitHub Actions workflow (`.github/workflows/ci.yml`) for automated testing and deployment and on successfull build it will push docker image to Github Container Registy.
- **Docker Compose configuration**: Created `docker-compose.yml` for local development and testing
- **Best practices**: Ensured optimized builds with proper caching and security considerations

Cline transformed hours of manual configuration into minutes of AI-assisted development, allowing me to focus on application logic rather than infrastructure setup.

## 🐳 Dockerization

The application uses a multi-stage Docker build for optimized production images:

### Docker Features

- **Multi-stage builds**: Separates dependencies, build, and runtime stages
- **Layer caching**: Optimizes build times with smart dependency management
- **Production-ready**: Minimal runtime image with only production dependencies
- **Port 3000**: Standard Next.js port for consistent deployment

### Running with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or use Docker directly
docker build -t todo-list-nextapp .
docker run -p 3000:3000 todo-list-nextapp
```
