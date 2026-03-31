# Resumen de sesión — Todo App con AWS Lambda + DynamoDB + Vite

**Fecha:** 31 de Marzo 2026

---

## Objetivo

Construir una aplicación de lista de tareas completa: backend serverless en AWS, infraestructura como código con Terraform, y frontend profesional desplegado en Vercel.

---

## Lo que se construyó

### 1. Infraestructura Terraform (`terraform/`)

- **DynamoDB** tabla `todo-tasks` en modo `PAY_PER_REQUEST` con PK `id` (String)
- **Lambda** Python 3.12 con IAM role y política de acceso a DynamoDB
- **API Gateway v2 (HTTP API)** como endpoint público con CORS configurado
- **Profile AWS** `jvh-2026`, región `us-east-1`

**Problema encontrado:** Lambda Function URL devolvía 403 Forbidden por el nuevo feature de AWS "Block Public Access" para Lambda (2024), no soportado aún en boto3 ni en AWS CLI. **Solución:** migrar a API Gateway v2 que no tiene esta restricción.

### 2. Lambda Python (`lambda/handler.py`)

API REST completa con 5 endpoints:

| Método | Path | Acción |
|--------|------|--------|
| GET | `/tasks` | Listar todas las tareas |
| POST | `/tasks` | Crear tarea |
| GET | `/tasks/{id}` | Obtener tarea |
| PUT | `/tasks/{id}` | Actualizar (título / completed) |
| DELETE | `/tasks/{id}` | Eliminar tarea |

Modelo de datos: `id` (UUID), `title`, `completed`, `createdAt`, `updatedAt`.

### 3. Frontend Vite + React + TypeScript (`frontend/`)

- **Framework:** Vite + React + TypeScript + Tailwind CSS
- **Tipografía:** Playfair Display (display) + Lora (body) + DM Mono (UI/números)
- **Diseño:** Layout editorial de dos columnas — sidebar con progress ring SVG animado + área principal con lista de tareas
- **Paleta:** Negro sobre blanco cálido (`#0D0C0A` sobre `#FAFAF8`)
- **Checkboxes:** Diamantes `◇` / `◆` con animación
- **Input:** Underline minimalista con `→` como submit

---

## URLs del proyecto

| Recurso | URL |
|---------|-----|
| GitHub | https://github.com/Jviejo/aws-lambda-vite |
| Vercel (frontend) | https://frontend-delta-flame-56.vercel.app |
| API Gateway (destruida) | `https://lkxgdtq231.execute-api.us-east-1.amazonaws.com` |

---

## Problemas y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Lambda Function URL → 403 Forbidden | AWS "Block Public Access" para Lambda (feature 2024, no soportado en CLI/boto3 disponibles) | Migrar a API Gateway v2 HTTP API |
| `OPTIONS` en allow_methods de Function URL → ValidationException | Límite de 6 caracteres por método en Lambda Function URL | Eliminar `OPTIONS` (Lambda lo maneja automáticamente) |
| `aws_lambda_permission` en conflict al aplicar | El permiso ya existía en AWS por un apply previo fallido | `terraform import` para sincronizar el state |
| State lock al lanzar segundo apply | Primer apply corriendo en background | Esperar a que terminase y re-aplicar |

---

## Flujo de despliegue

```bash
# Infraestructura
cd terraform
terraform init
terraform apply -auto-approve

# Frontend local
cd frontend
cp .env.example .env.local   # agregar VITE_API_URL
npm run dev

# Frontend producción
vercel --prod --build-env VITE_API_URL=<api_url>
```

---

## Destrucción de infraestructura

Al final de la sesión se destruyeron todos los recursos AWS:

```bash
cd terraform
terraform destroy -auto-approve
# Destroy complete! Resources: 10 destroyed.
```

Recursos eliminados: Lambda, DynamoDB, API Gateway (API + integración + ruta + stage), IAM Role + políticas.

---

## Estructura final del proyecto

```
aws-lambda-vite/
├── CLAUDE.md              # Spec del proyecto
├── RESUMEN.md             # Este archivo
├── .gitignore
├── terraform/
│   ├── main.tf            # Provider AWS + profile jvh-2026
│   ├── dynamodb.tf        # Tabla todo-tasks
│   ├── lambda.tf          # Lambda + API Gateway v2 + IAM
│   ├── variables.tf
│   └── outputs.tf
├── lambda/
│   ├── handler.py         # API REST Python 3.12
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.tsx         # Layout dos columnas + estado
    │   ├── api.ts          # Cliente tipado para la API
    │   ├── index.css       # Tema editorial negro/blanco
    │   └── components/
    │       ├── AddTask.tsx      # Input underline minimalista
    │       ├── TaskItem.tsx     # Fila numerada con diamante
    │       ├── TaskList.tsx     # Lista con secciones
    │       └── ProgressRing.tsx # SVG ring animado
    ├── .env.example
    └── vite.config.ts
```
