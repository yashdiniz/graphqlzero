import { gql } from "graphql-tag";
import { Album, fetchAlbum } from "./album";
import { Page, PageQueryOptions } from "./page";
import {
  createResource,
  deleteResource,
  fetchPage,
  fetchResource,
  updateResource,
} from "../util/json-placeholder";
import { debugLog } from "../util/debug";

export const typeDefs = gql`
  extend type Query {
    photos(options: PageQueryOptions): PhotosPage
    photo(id: ID!): Photo
  }

  extend type Mutation {
    createPhoto(input: CreatePhotoInput!): Photo
    updatePhoto(id: ID!, input: UpdatePhotoInput!): Photo
    deletePhoto(id: ID!): Boolean
  }

  type Photo {
    id: ID
    title: String
    url: String
    thumbnailUrl: String
    album: Album
  }

  input CreatePhotoInput {
    title: String!
    url: String!
    thumbnailUrl: String!
  }

  input UpdatePhotoInput {
    title: String
    url: String
    thumbnailUrl: String
  }
`;

export interface Photo {
  albumId: string;
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface CreatePhotoInput {
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface UpdatePhotoInput {
  title?: string;
  url?: string;
  thumbnailUrl?: string;
}

export async function fetchPhotos(
  options?: PageQueryOptions
): Promise<Page<Photo>> {
  return fetchPage<Photo>("/photos", options);
}

export async function fetchPhoto(id: string): Promise<Photo> {
  return fetchResource<Photo>(`/photos/${id}`);
}

export async function createPhoto(input: CreatePhotoInput): Promise<Photo> {
  return createResource<Photo>(`/photos`, JSON.stringify(input));
}

export async function updatePhoto(
  id: string,
  input: UpdatePhotoInput
): Promise<Photo> {
  return updateResource<Photo>(`/photos/${id}`, JSON.stringify(input));
}

export async function deletePhoto(id: string): Promise<boolean> {
  await deleteResource<Photo>(`/photos/${id}`);
  return true;
}

export const resolvers = {
  Query: {
    async photos(_: undefined, args: object): Promise<Page<Photo>> {
      const { options } = args as { options?: PageQueryOptions };
      debugLog("Fetching photos with options:", options);
      return fetchPhotos(options);
    },
    async photo(_: undefined, args: object): Promise<Photo> {
      const { id } = args as { id: string };
      debugLog("Fetching photo with id:", id);
      return fetchPhoto(id);
    },
  },
  Mutation: {
    async createPhoto(_: undefined, args: object): Promise<Photo> {
      const { input } = args as { input: CreatePhotoInput };
      debugLog("Creating photo with input:", input);
      return createPhoto(input);
    },
    async updatePhoto(_: undefined, args: object): Promise<Photo> {
      const { id, input } = args as { id: string; input: UpdatePhotoInput };
      debugLog("Updating photo with id:", id, "and input:", input);
      return updatePhoto(id, input);
    },
    async deletePhoto(_: undefined, args: object): Promise<boolean> {
      const { id } = args as { id: string };
      debugLog("Deleting photo with id:", id);
      return deletePhoto(id);
    },
  },
  Photo: {
    async album(photo: Photo): Promise<Album> {
      debugLog("Fetching album for photo with id:", photo.id);
      return fetchAlbum(photo.albumId);
    },
  },
};
