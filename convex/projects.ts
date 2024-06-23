import {
	mutation,
	query,
} from "@/convex/_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import projects from "@/pages/api/projects";
import { describe } from "node:test";

export const getProjects = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Not Authenticated");
		}

		const projects = await ctx.db
			.query("projects")
			.filter((q) =>
				q.eq(q.field("userId"), identity?.subject)
			)
			?.collect();

		return projects;
	},
});


export const getProjectById = mutation({
	// Define the arguments for the mutation
	args: {
	  id: v.id("projects"),
	},
	// Define the handler for the mutation
	handler: async (ctx, args) => {
	  const { id } = args;
  
	  // Use the db.get method to retrieve the project
	  const project = await ctx.db.get(id);
  
	  // Return the project
	  return project;
	},
  });


// export const getProjectById = query({
// 	args: { projectId: v.id("projects") },

// 	handler: async (ctx, args) => {
// 		const identity = await ctx.auth.getUserIdentity();

// 		if (!identity) {
// 			throw new Error("Not Authenticated");
// 		}
// 		// const project = await ctx.db
// 		// 	.query("projects")
// 		// 	.filter((q) =>
// 		// 		q.and(
// 		// 			q.eq(q.field("userId"), identity?.subject),
// 		// 			q.eq(q.field("_id"), projectId)
// 		// 		)
// 		// 	)
// 		// 	?.first();

// 		const project = await ctx.db.get(args.projectId);

// 		if (!project) {
// 			throw new Error("Project not found");
// 		}

// 		return project;
// 	},
// });


// export const getProjectById = query({
// 	handler: async (ctx) => {
// 	  const identity = await ctx.auth.getUserIdentity();
  
// 	  if (!identity) {
// 		throw new Error("Not Authenticated");
// 	  }
  
// 	  const { projectId } = ctx.params;
  
// 	  if (!projectId) {
// 		throw new Error("Project ID is required");
// 	  }
  
// 	  const project = await ctx.db
// 		.query("projects")
// 		.filter((q) =>
// 		  q.and(
// 			q.eq(q.field("userId"), identity?.subject),
// 			q.eq(q.field("_id"), projectId)
// 		  )
// 		)
// 		.first();
  
// 	  if (!project) {
// 		throw new Error("Project not found");
// 	  }
  
// 	  return project;
// 	},
//   });
  
// export const getProjectById = query({
//   args: { projectId: v.id("projects") },
//   handler: async (ctx, { projectId }) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Not Authenticated");
//     }

//     if (!projectId) {
//       throw new Error("Project ID is required");
//     }

//     const project = await ctx.db
//       .query("projects")
//       .filter((q) =>
//         q.and(q.eq(q.field("userId"), identity?.subject), q.eq(q.field("_id"), projectId))
//       )
//       .first();

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     return project;
//   },
// });


export const createProject = mutation({
	args: {
		title: v.string(),
        description: v.string(),
        objectives: v.string(),

	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Not Authenticated");
		}

		const project = await ctx.db.insert("projects", {
			title: args.title,
			description: args.description,
			objectives: args.objectives,
			userId: identity.subject,
			isArchived: false,
			createdAt: BigInt(Date.now()), // Use BigInt for timestamps
			updatedAt: BigInt(Date.now()), // Use BigInt for timestamps
		});

		return project;
	},
});

export const updateProject = mutation({
	args: {
	  id: v.id("projects"),
	  title: v.optional(v.string()),
	  description: v.optional(v.string()),
	  objectives: v.optional(v.string()),
	  userId: v.optional(v.string()),
	  isArchived: v.optional(v.boolean()),
	  content: v.optional(v.string()),
	  stakeholders: v.optional(v.string()),
	  scope: v.optional(v.string()),
	  targetAudience: v.optional(v.string()),
	  constraints: v.optional(v.string()),
	  budget: v.optional(v.string()),
	  dependencies: v.optional(v.string()),
	  priorities: v.optional(v.string()),
	  risks: v.optional(v.string()),
	  icon: v.optional(v.string()),
	  isPublished: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
	  const { id } = args;
	  const { title, description, objectives, userId, isArchived, content, stakeholders, scope, targetAudience, constraints, budget, dependencies, priorities, risks, icon, isPublished } = args;
  
	  await ctx.db.patch(id, {
		title: title ?? undefined,
		description: description ?? undefined,
		objectives: objectives ?? undefined,
		userId: userId ?? undefined,
		isArchived: isArchived ?? undefined,
		content: content ?? undefined,
		stakeholders: stakeholders ?? undefined,
		scope: scope ?? undefined,
		targetAudience: targetAudience ?? undefined,
		constraints: constraints ?? undefined,
		budget: budget ?? undefined,
		dependencies: dependencies ?? undefined,
		priorities: priorities ?? undefined,
		risks: risks ?? undefined,
		icon: icon ?? undefined,
		isPublished: isPublished ?? undefined,
	  });
  
	},
  });
