# Proyecto: Todo List con AWS Lambda + DynamoDB + Vite

## Arquitectura general

```
[Vite Frontend (Vercel)] --> [AWS Lambda (Function URL pública)] --> [DynamoDB]
```

---

## 1. Infraestructura con Terraform

### Archivos requeridos
- `terraform/main.tf` — provider y backend
- `terraform/lambda.tf` — recurso Lambda + IAM role
- `terraform/dynamodb.tf` — tabla DynamoDB
- `terraform/outputs.tf` — outputs: URL de la lambda
- `terraform/variables.tf` — variables configurables

### Provider
- Provider: `aws`
- Región: `us-east-1` (variable)
- Backend: local (archivo `terraform.tfstate`)

### Lambda
- Runtime: `python3.12`
- Handler: `handler.lambda_handler`
- Código fuente: directorio `lambda/` comprimido como `lambda.zip`
- Acceso público: mediante **Lambda Function URL** con `auth_type = "NONE"` (CORS habilitado)
- Variables de entorno: `TABLE_NAME` con el nombre de la tabla DynamoDB
- IAM Role con políticas:
  - `AWSLambdaBasicExecutionRole`
  - Permisos DynamoDB: `PutItem`, `GetItem`, `UpdateItem`, `DeleteItem`, `Scan`, `Query` sobre la tabla

### DynamoDB
- Nombre de tabla: `todo-tasks` (variable)
- Billing mode: `PAY_PER_REQUEST`
- Partition key: `id` (tipo `S`)
- Atributos del ítem:
  ```
  id        (String) — UUID generado por la lambda
  title     (String) — título de la tarea
  completed (Boolean) — false por defecto
  createdAt (String) — ISO 8601 timestamp
  updatedAt (String) — ISO 8601 timestamp
  ```

### Outputs
- `lambda_url` — Function URL pública de la lambda

---

## 2. Lambda (Python)

### Archivo: `lambda/handler.py`

Implementa un API REST completo sobre la tabla DynamoDB:

| Método | Path          | Acción                              |
|--------|---------------|-------------------------------------|
| GET    | `/tasks`      | Listar todas las tareas             |
| POST   | `/tasks`      | Crear nueva tarea                   |
| GET    | `/tasks/{id}` | Obtener tarea por ID                |
| PUT    | `/tasks/{id}` | Actualizar tarea (título/completed) |
| DELETE | `/tasks/{id}` | Eliminar tarea                      |

- El path se extrae de `event["rawPath"]` (Lambda Function URL)
- Responder siempre con `Content-Type: application/json`
- Incluir headers CORS: `Access-Control-Allow-Origin: *`
- Manejar `OPTIONS` para preflight CORS
- Retornar códigos HTTP apropiados (200, 201, 400, 404, 500)
- Usar `boto3` para interactuar con DynamoDB
- Usar `uuid` para generar IDs únicos
- Usar `datetime` para timestamps

### Archivo: `lambda/requirements.txt`
- Solo `boto3` (viene preinstalado en el runtime de Lambda, pero documentarlo)

---

## 3. Testing

### Desplegar
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

### Probar la lambda
Usar el output `lambda_url` para probar con `curl`:

```bash
# Listar tareas
curl <LAMBDA_URL>/tasks

# Crear tarea
curl -X POST <LAMBDA_URL>/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primera tarea"}'

# Actualizar tarea
curl -X PUT <LAMBDA_URL>/tasks/<ID> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Eliminar tarea
curl -X DELETE <LAMBDA_URL>/tasks/<ID>
```

---

## 4. Frontend con Vite + React

### Setup
- Framework: React + TypeScript
- Build tool: Vite
- Directorio: `frontend/`
- Estilo: Tailwind CSS
- Inicializar con: `npm create vite@latest frontend -- --template react-ts`

### Funcionalidades requeridas
1. Listar todas las tareas al cargar
2. Crear nueva tarea (input + botón)
3. Marcar tarea como completada/incompleta (checkbox)
4. Eliminar tarea (botón por ítem)
5. Indicador de loading durante peticiones
6. Manejo de errores con mensaje visible al usuario
7. Diseño profesional y responsivo

### Configuración de la API
- La URL base de la lambda se configura en variable de entorno: `VITE_API_URL`
- Archivo `.env.local` (no commitear): `VITE_API_URL=<LAMBDA_URL>`
- Archivo `.env.example` (sí commitear): `VITE_API_URL=https://your-lambda-url.lambda-url.us-east-1.on.aws`

### Diseño UI
- Fondo oscuro o claro con buena tipografía
- Lista de tareas con animaciones suaves
- Tareas completadas con tachado visual
- Botones con hover states claros
- Responsive: funciona en móvil y desktop

---

## 5. Despliegue Frontend

### GitHub
```bash
git init
git add .
git commit -m "feat: todo app con lambda + dynamodb + vite"
git remote add origin <REPO_URL>
git push -u origin main
```

### Vercel
1. Conectar el repositorio de GitHub en vercel.com
2. Configurar variable de entorno `VITE_API_URL` en el dashboard de Vercel
3. Framework preset: Vite
4. Root directory: `frontend/`
5. Build command: `npm run build`
6. Output directory: `dist`

---

## Estructura de archivos final

```
aws-lambda-vite/
├── CLAUDE.md
├── terraform/
│   ├── main.tf
│   ├── lambda.tf
│   ├── dynamodb.tf
│   ├── variables.tf
│   └── outputs.tf
├── lambda/
│   ├── handler.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── components/
    │       ├── TaskList.tsx
    │       ├── TaskItem.tsx
    │       └── AddTask.tsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```
