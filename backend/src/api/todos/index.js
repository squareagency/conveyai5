// src/api/todos/index.js
import { Router } from 'express';
import { authenticateUser, validateTenant } from '../../middleware/auth';
import * as todoController from './todo.controller';

const router = Router();

// Get all todos for a user
router.get('/', authenticateUser, validateTenant, todoController.getTodos);

// Get todos for a matter
router.get('/matter/:matterId', authenticateUser, validateTenant, todoController.getMatterTodos);

// Create a new todo
router.post('/', authenticateUser, validateTenant, todoController.createTodo);

// Update a todo
router.put('/:id', authenticateUser, validateTenant, todoController.updateTodo);

// Mark a todo as completed
router.put('/:id/complete', authenticateUser, validateTenant, todoController.completeTodo);

export default router;