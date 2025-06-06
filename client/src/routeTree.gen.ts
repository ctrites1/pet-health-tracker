/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as AuthenticatedImport } from "./routes/_authenticated";
import { Route as AuthenticatedIndexImport } from "./routes/_authenticated/index";
import { Route as AuthenticatedProfileImport } from "./routes/_authenticated/profile";
import { Route as AuthenticatedPetsNewImport } from "./routes/_authenticated/pets.new";
import { Route as AuthenticatedPetsPetIdImport } from "./routes/_authenticated/pets.$petId";
import { Route as AuthenticatedPetsPetIdHealthRecordsImport } from "./routes/_authenticated/pets_.$petId.health-records";
import { Route as AuthenticatedPetsPetIdCaregiversImport } from "./routes/_authenticated/pets_.$petId.caregivers";

// Create/Update Routes

const AuthenticatedRoute = AuthenticatedImport.update({
	id: "/_authenticated",
	getParentRoute: () => rootRoute,
} as any);

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedPetsNewRoute = AuthenticatedPetsNewImport.update({
	id: "/pets/new",
	path: "/pets/new",
	getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedPetsPetIdRoute = AuthenticatedPetsPetIdImport.update({
	id: "/pets/$petId",
	path: "/pets/$petId",
	getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedPetsPetIdHealthRecordsRoute =
	AuthenticatedPetsPetIdHealthRecordsImport.update({
		id: "/pets_/$petId/health-records",
		path: "/pets/$petId/health-records",
		getParentRoute: () => AuthenticatedRoute,
	} as any);

const AuthenticatedPetsPetIdCaregiversRoute =
	AuthenticatedPetsPetIdCaregiversImport.update({
		id: "/pets_/$petId/caregivers",
		path: "/pets/$petId/caregivers",
		getParentRoute: () => AuthenticatedRoute,
	} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
	interface FileRoutesByPath {
		"/_authenticated": {
			id: "/_authenticated";
			path: "";
			fullPath: "";
			preLoaderRoute: typeof AuthenticatedImport;
			parentRoute: typeof rootRoute;
		};
		"/_authenticated/profile": {
			id: "/_authenticated/profile";
			path: "/profile";
			fullPath: "/profile";
			preLoaderRoute: typeof AuthenticatedProfileImport;
			parentRoute: typeof AuthenticatedImport;
		};
		"/_authenticated/": {
			id: "/_authenticated/";
			path: "/";
			fullPath: "/";
			preLoaderRoute: typeof AuthenticatedIndexImport;
			parentRoute: typeof AuthenticatedImport;
		};
		"/_authenticated/pets/$petId": {
			id: "/_authenticated/pets/$petId";
			path: "/pets/$petId";
			fullPath: "/pets/$petId";
			preLoaderRoute: typeof AuthenticatedPetsPetIdImport;
			parentRoute: typeof AuthenticatedImport;
		};
		"/_authenticated/pets/new": {
			id: "/_authenticated/pets/new";
			path: "/pets/new";
			fullPath: "/pets/new";
			preLoaderRoute: typeof AuthenticatedPetsNewImport;
			parentRoute: typeof AuthenticatedImport;
		};
		"/_authenticated/pets_/$petId/caregivers": {
			id: "/_authenticated/pets_/$petId/caregivers";
			path: "/pets/$petId/caregivers";
			fullPath: "/pets/$petId/caregivers";
			preLoaderRoute: typeof AuthenticatedPetsPetIdCaregiversImport;
			parentRoute: typeof AuthenticatedImport;
		};
		"/_authenticated/pets_/$petId/health-records": {
			id: "/_authenticated/pets_/$petId/health-records";
			path: "/pets/$petId/health-records";
			fullPath: "/pets/$petId/health-records";
			preLoaderRoute: typeof AuthenticatedPetsPetIdHealthRecordsImport;
			parentRoute: typeof AuthenticatedImport;
		};
	}
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
	AuthenticatedProfileRoute: typeof AuthenticatedProfileRoute;
	AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute;
	AuthenticatedPetsPetIdRoute: typeof AuthenticatedPetsPetIdRoute;
	AuthenticatedPetsNewRoute: typeof AuthenticatedPetsNewRoute;
	AuthenticatedPetsPetIdCaregiversRoute: typeof AuthenticatedPetsPetIdCaregiversRoute;
	AuthenticatedPetsPetIdHealthRecordsRoute: typeof AuthenticatedPetsPetIdHealthRecordsRoute;
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
	AuthenticatedProfileRoute: AuthenticatedProfileRoute,
	AuthenticatedIndexRoute: AuthenticatedIndexRoute,
	AuthenticatedPetsPetIdRoute: AuthenticatedPetsPetIdRoute,
	AuthenticatedPetsNewRoute: AuthenticatedPetsNewRoute,
	AuthenticatedPetsPetIdCaregiversRoute: AuthenticatedPetsPetIdCaregiversRoute,
	AuthenticatedPetsPetIdHealthRecordsRoute:
		AuthenticatedPetsPetIdHealthRecordsRoute,
};

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
	AuthenticatedRouteChildren
);

export interface FileRoutesByFullPath {
	"": typeof AuthenticatedRouteWithChildren;
	"/profile": typeof AuthenticatedProfileRoute;
	"/": typeof AuthenticatedIndexRoute;
	"/pets/$petId": typeof AuthenticatedPetsPetIdRoute;
	"/pets/new": typeof AuthenticatedPetsNewRoute;
	"/pets/$petId/caregivers": typeof AuthenticatedPetsPetIdCaregiversRoute;
	"/pets/$petId/health-records": typeof AuthenticatedPetsPetIdHealthRecordsRoute;
}

export interface FileRoutesByTo {
	"/profile": typeof AuthenticatedProfileRoute;
	"/": typeof AuthenticatedIndexRoute;
	"/pets/$petId": typeof AuthenticatedPetsPetIdRoute;
	"/pets/new": typeof AuthenticatedPetsNewRoute;
	"/pets/$petId/caregivers": typeof AuthenticatedPetsPetIdCaregiversRoute;
	"/pets/$petId/health-records": typeof AuthenticatedPetsPetIdHealthRecordsRoute;
}

export interface FileRoutesById {
	__root__: typeof rootRoute;
	"/_authenticated": typeof AuthenticatedRouteWithChildren;
	"/_authenticated/profile": typeof AuthenticatedProfileRoute;
	"/_authenticated/": typeof AuthenticatedIndexRoute;
	"/_authenticated/pets/$petId": typeof AuthenticatedPetsPetIdRoute;
	"/_authenticated/pets/new": typeof AuthenticatedPetsNewRoute;
	"/_authenticated/pets_/$petId/caregivers": typeof AuthenticatedPetsPetIdCaregiversRoute;
	"/_authenticated/pets_/$petId/health-records": typeof AuthenticatedPetsPetIdHealthRecordsRoute;
}

export interface FileRouteTypes {
	fileRoutesByFullPath: FileRoutesByFullPath;
	fullPaths:
		| ""
		| "/profile"
		| "/"
		| "/pets/$petId"
		| "/pets/new"
		| "/pets/$petId/caregivers"
		| "/pets/$petId/health-records";
	fileRoutesByTo: FileRoutesByTo;
	to:
		| "/profile"
		| "/"
		| "/pets/$petId"
		| "/pets/new"
		| "/pets/$petId/caregivers"
		| "/pets/$petId/health-records";
	id:
		| "__root__"
		| "/_authenticated"
		| "/_authenticated/profile"
		| "/_authenticated/"
		| "/_authenticated/pets/$petId"
		| "/_authenticated/pets/new"
		| "/_authenticated/pets_/$petId/caregivers"
		| "/_authenticated/pets_/$petId/health-records";
	fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
	AuthenticatedRoute: typeof AuthenticatedRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
	AuthenticatedRoute: AuthenticatedRouteWithChildren,
};

export const routeTree = rootRoute
	._addFileChildren(rootRouteChildren)
	._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/profile",
        "/_authenticated/",
        "/_authenticated/pets/$petId",
        "/_authenticated/pets/new",
        "/_authenticated/pets_/$petId/caregivers",
        "/_authenticated/pets_/$petId/health-records"
      ]
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/pets/$petId": {
      "filePath": "_authenticated/pets.$petId.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/pets/new": {
      "filePath": "_authenticated/pets.new.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/pets_/$petId/caregivers": {
      "filePath": "_authenticated/pets_.$petId.caregivers.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/pets_/$petId/health-records": {
      "filePath": "_authenticated/pets_.$petId.health-records.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
