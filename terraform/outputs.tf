output "api_url" {
  description = "Public URL of the API Gateway"
  value       = aws_apigatewayv2_api.todo_api.api_endpoint
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.todo_tasks.name
}
