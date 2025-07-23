import { gql } from "graphql-tag";
import { Page, PageQueryOptions } from "./page";
import { fetchPost, Post } from "./post";
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
    comments(options: PageQueryOptions): CommentsPage
    comment(id: ID!): Comment
  }

  extend type Mutation {
    createComment(input: CreateCommentInput!): Comment
    updateComment(id: ID!, input: UpdateCommentInput!): Comment
    deleteComment(id: ID!): Boolean
  }

  type Comment {
    id: ID
    name: String
    email: String
    body: String
    post: Post
  }

  input CreateCommentInput {
    name: String!
    email: String!
    body: String!
  }

  input UpdateCommentInput {
    name: String
    email: String
    body: String
  }
`;

export interface Comment {
  id: string;
  name: string;
  email: string;
  body: string;
  postId: string;
}

export interface CreateCommentInput {
  name: string;
  email: string;
  body: string;
}

export interface UpdateCommentInput {
  name?: string;
  email?: string;
  body?: string;
}

export async function fetchComments(
  options?: PageQueryOptions
): Promise<Page<Comment>> {
  return fetchPage<Comment>("/comments", options);
}

export async function fetchComment(id: string): Promise<Comment> {
  return fetchResource<Comment>(`/comments/${id}`);
}

export async function createComment(
  input: CreateCommentInput
): Promise<Comment> {
  return createResource<Comment>(`/comments`, JSON.stringify(input));
}

export async function updateComment(
  id: string,
  input: UpdateCommentInput
): Promise<Comment> {
  return updateResource<Comment>(`/comments/${id}`, JSON.stringify(input));
}

export async function deleteComment(id: string): Promise<boolean> {
  await deleteResource<Comment>(`/comments/${id}`);
  return true;
}

export const resolvers = {
  Query: {
    async comments(_: undefined, args: object): Promise<Page<Comment>> {
      const { options } = enforcePageOptionsLimit(args as { options?: PageQueryOptions });
      debugLog("Fetching COMMENTs with options:", JSON.stringify(options));
      return fetchComments(options);
    },
    async comment(_: undefined, args: object): Promise<Comment> {
      const { id } = args as { id: string };
      debugLog("Fetching COMMENT with id:", id);
      return fetchComment(id);
    },
  },
  Mutation: {
    async createComment(_: undefined, args: object): Promise<Comment> {
      const { input } = args as { input: CreateCommentInput };
      debugLog("Creating COMMENT with input:", input);
      return createComment(input);
    },
    async updateComment(_: undefined, args: object): Promise<Comment> {
      const { id, input } = args as { id: string; input: UpdateCommentInput };
      debugLog("Updating COMMENT with id:", id, "and input:", input);
      return updateComment(id, input);
    },
    async deleteComment(_: undefined, args: object): Promise<boolean> {
      const { id } = args as { id: string };
      debugLog("Deleting COMMENT with id:", id);
      return deleteComment(id);
    },
  },
  Comment: {
    async post(comment: Comment): Promise<Post> {
      debugLog("Fetching POST for COMMENT with id:", comment.id);
      return fetchPost(comment.postId);
    },
  },
};
