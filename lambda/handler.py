import json
import os
import uuid
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
}


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str),
    }


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("rawPath", "/")

    # Handle CORS preflight
    if method == "OPTIONS":
        return response(200, {})

    # Route: /tasks
    if path == "/tasks" or path == "/tasks/":
        if method == "GET":
            return list_tasks()
        if method == "POST":
            body = parse_body(event)
            return create_task(body)

    # Route: /tasks/{id}
    if path.startswith("/tasks/"):
        task_id = path.split("/tasks/")[1].rstrip("/")
        if not task_id:
            return response(400, {"error": "Missing task id"})
        if method == "GET":
            return get_task(task_id)
        if method == "PUT":
            body = parse_body(event)
            return update_task(task_id, body)
        if method == "DELETE":
            return delete_task(task_id)

    return response(404, {"error": "Not found"})


def parse_body(event):
    try:
        return json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return {}


def list_tasks():
    result = table.scan()
    tasks = sorted(result.get("Items", []), key=lambda t: t.get("createdAt", ""))
    return response(200, tasks)


def create_task(body):
    title = (body.get("title") or "").strip()
    if not title:
        return response(400, {"error": "title is required"})

    task = {
        "id": str(uuid.uuid4()),
        "title": title,
        "completed": False,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    table.put_item(Item=task)
    return response(201, task)


def get_task(task_id):
    result = table.get_item(Key={"id": task_id})
    task = result.get("Item")
    if not task:
        return response(404, {"error": "Task not found"})
    return response(200, task)


def update_task(task_id, body):
    result = table.get_item(Key={"id": task_id})
    if not result.get("Item"):
        return response(404, {"error": "Task not found"})

    update_expr_parts = ["updatedAt = :updatedAt"]
    expr_values = {":updatedAt": now_iso()}

    if "title" in body:
        title = (body["title"] or "").strip()
        if not title:
            return response(400, {"error": "title cannot be empty"})
        update_expr_parts.append("title = :title")
        expr_values[":title"] = title

    if "completed" in body:
        update_expr_parts.append("completed = :completed")
        expr_values[":completed"] = bool(body["completed"])

    updated = table.update_item(
        Key={"id": task_id},
        UpdateExpression="SET " + ", ".join(update_expr_parts),
        ExpressionAttributeValues=expr_values,
        ReturnValues="ALL_NEW",
    )
    return response(200, updated["Attributes"])


def delete_task(task_id):
    result = table.get_item(Key={"id": task_id})
    if not result.get("Item"):
        return response(404, {"error": "Task not found"})
    table.delete_item(Key={"id": task_id})
    return response(200, {"message": "Task deleted"})
