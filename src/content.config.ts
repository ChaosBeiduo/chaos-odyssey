import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const galleryMetadata = defineCollection({
  // 使用 parser 直接提取 overrides 字段，并将其转换为数组格式
  loader: file("src/content/gallery-metadata.json", {
    parser: (text) => {
      const data = JSON.parse(text);
      const overrides = data.overrides || {};
      // 将 { "id": { "title": "..." } } 转换为 [ { "id": "...", "title": "..." } ]
      return Object.entries(overrides).map(([id, value]: [string, any]) => ({
        id,
        ...value
      }));
    }
  }),
  // 现在的 schema 是针对单个 entry 的
  schema: z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
  })
});

export const collections = {
  'gallery-metadata': galleryMetadata,
};
