import { gql } from "graphql-tag";
import { Page, PageQueryOptions } from "./page";
import { fetchUser, User } from "./user";
import {
  createResource,
  deleteResource,
  fetchPage,
  fetchResource,
  updateResource,
} from "../util/json-placeholder";
import { debugLog, enforcePageOptionsLimit } from "../util/debug";

export const typeDefs = gql`
  extend type Query {
    todos(options: PageQueryOptions): TodosPage
    todo(id: ID!): Todo
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo
    updateTodo(id: ID!, input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean
  }

  type Todo {
    id: ID
    title: String
    completed: Boolean
    user: User
  }

  input CreateTodoInput {
    title: String!
    completed: Boolean!
  }

  input UpdateTodoInput {
    title: String
    completed: Boolean
  }
`;

export interface Todo {
  id: string;
  title: string;
  completed: string;
  userId: string;
}

export interface CreateTodoInput {
  title: string;
  completed: boolean;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export async function fetchTodos(
  options?: PageQueryOptions
): Promise<Page<Todo>> {
  return fetchPage<Todo>("/todos", options);
}

export async function fetchTodo(id: string): Promise<Todo> {
  return fetchResource<Todo>(`/todos/${id}`);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return createResource<Todo>(`/todos`, JSON.stringify(input));
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo> {
  return updateResource<Todo>(`/todos/${id}`, JSON.stringify(input));
}

export async function deleteTodo(id: string): Promise<boolean> {
  await deleteResource<Todo>(`/todos/${id}`);
  return true;
}

export const resolvers = {
  Query: {
    async todos(_: undefined, args: object): Promise<Page<Todo>> {
      const { options } = enforcePageOptionsLimit(args as { options?: PageQueryOptions });
      debugLog("Fetching TODOs with options:", JSON.stringify(options));
      return fetchTodos(options);
    },
    async todo(_: undefined, args: object): Promise<Todo> {
      const { id } = args as { id: string };
      debugLog("Fetching TODO with id:", id);
      return fetchTodo(id);
    },
  },
  Mutation: {
    async createTodo(_: undefined, args: object): Promise<Todo> {
      const { input } = args as { input: CreateTodoInput };
      debugLog("Creating TODO with input:", input);
      return createTodo(input);
    },
    async updateTodo(_: undefined, args: object): Promise<Todo> {
      const { id, input } = args as { id: string; input: UpdateTodoInput };
      debugLog("Updating TODO with id:", id, "and input:", input);
      return updateTodo(id, input);
    },
    async deleteTodo(_: undefined, args: object): Promise<boolean> {
      const { id } = args as { id: string };
      debugLog("Deleting TODO with id:", id);
      return deleteTodo(id);
    },
  },
  Todo: {
    async user(todo: Todo): Promise<User> {
      debugLog("Fetching USER for TODO with id:", todo.id);
      return fetchUser(todo.userId);
    },
  },
};
