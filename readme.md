<h1 align="center">Grammaid</h1>

<div align="center">
   <img src="screenshots/tela%20inicial.png" alt="Grammaid Dashboard" width="800">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next JS" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  <img src="https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" />
</p>

<h2 align="center">🇬🇧 AI-Powered English Essay Correction Platform</h2>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#layout">Layout</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#author">Author</a>
</p>

## 📝 About

**Grammaid** is a web application developed as a final paper for the Computer Science degree at **UFAM (Federal University of Amazonas)**. 

The platform leverages **Large Language Models (LLMs)** to provide automated, detailed, and proficiency-aware feedback on English essays. It aims to assist students in improving their writing skills by offering instant corrections, suggestions, and grading based on standardized criteria (CEFR levels).

## ✨ Features

- **Automated Essay Correction**: Instant feedback on grammar, vocabulary, coherence, and cohesion.
- **Proficiency Levels**: Supports Basic, Intermediate, and Advanced levels (A1-C2) with adapted grading criteria.
- **Detailed Annotations**: Specific error highlighting with explanations and correction suggestions.
- **Progress Tracking**: Dashboard to monitor user performance and essay history.
- **Admin Tools**: Interface for creating and managing essay proposals.

## 🎨 Layout

### 📌 Essay Proposals
Select from a variety of essay topics tailored to different difficulty levels.
<div align="center">
  <img src="screenshots/proposta%20de%20redacao.png" alt="Essay Proposals" width="700">
</div>

### 📝 Correction Overview
Get an overall grade and general feedback on your writing performance.
<div align="center">
  <img src="screenshots/correcao%20geral.png" alt="Correction Overview" width="700">
</div>

### 🔍 Detailed Feedback
Interactive review with specific error annotations and improvement suggestions.
<div align="center">
  <img src="screenshots/feedback%20detalhado.png" alt="Detailed Feedback" width="700">
</div>

### 💡 Text Suggestions
AI-powered suggestions to rewrite sentences for better clarity and flow.
<div align="center">
  <img src="screenshots/sugestao%20de%20texto.png" alt="Text Suggestions" width="700">
</div>

### 🚀 User Progression
Visual tracking of user level advancement (Basic → Intermediate → Advanced).
<div align="center">
  <img src="screenshots/promocao%20de%20usuario.jpg" alt="User Promotion" width="700">
</div>

### 🤖 AI Workflow (n8n)
The backend orchestration uses n8n to process texts through LLMs.
<div align="center">
  <img src="screenshots/n8n.png" alt="n8n Workflow" width="700">
</div>

## 🛠 Technologies

The project follows a Monorepo structure with **Docker** containerization.

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **Language**: TypeScript

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [MySQL 8.4](https://www.mysql.com/)
- **Validation**: Joi

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Orchestration**: n8n (Workflow Automation)

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed.
- Node.js (for local development without Docker, optional).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grammaid.git
   cd final-paper
   ```

2. **Configure Environment Variables**
   Copy the example environment files and configure them:
   
   Root:
   ```bash
   cp env.example .env
   ```
   
   Backend:
   ```bash
   cp backend/env.example backend/.env
   ```
   
   Frontend:
   ```bash
   cp frontend/env.example frontend/.env
   ```

3. **Run with Docker**
   Start all services (Database, Backend, Frontend, PHPMyAdmin):
   ```bash
   docker compose up
   ```

4. **Access the Application**
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:6677`
   - **PHPMyAdmin**: `http://localhost:8282`

## 👤 Author

Developed by **Micael** as a Computer Science Undergraduate Thesis at **UFAM**.

