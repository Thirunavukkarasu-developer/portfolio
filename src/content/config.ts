import { z, defineCollection } from "astro:content";
const blogsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishedDate: z.date(),
    draft: z.boolean(),
    description: z.string(),
    authors: z.array(z.string()).optional(),
    popularTags:z.string().optional()
  }),
});

export const collections = {
  blogs: blogsCollection,
};
