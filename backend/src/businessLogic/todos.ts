import { TodosAccess } from '../dataLayer/todosAccess';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';
import * as uuid from 'uuid';

const todosAccess = new TodosAccess();
const logger = createLogger('Todos');

export async function getAllTodos(userId: string): Promise<TodoItem[]> {

  logger.info('getAllTodos call')

  return await todosAccess.getAllTodos(userId)

}

export async function createTodoItem(createGroupRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

  logger.info('createTodoItem call')

  return await todosAccess.createTodoItem(
    {
      userId,
      todoId: uuid.v4(),
      done: false,
      createdAt: new Date().toISOString(),
      ...createGroupRequest
    }
  )

}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {

  logger.info('generateUploadUrl call')

  const uploadUrl = await todosAccess.getSignedUrl(todoId)
  await todosAccess.updateAttachmentUrl(userId, todoId)

  return uploadUrl

}

export async function updateTodoItem(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<void> {

  logger.info('updateTodoItem call')

  await todosAccess.updateTodoItem(updateTodoRequest, userId, todoId)

}

export async function deleteTodoItem(userId: string, todoId: string) {

  logger.info('deleteTodoItem call')

  await Promise.all(
    [
      todosAccess.deleteTodoItem(userId, todoId),
      todosAccess.deleteTodoItemAttachment(todoId)
    ]
  )

}