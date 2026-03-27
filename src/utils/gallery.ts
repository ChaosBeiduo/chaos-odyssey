import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';

export interface Photo {
  id: string;          // 唯一 ID: "2026-03-20/01"
  date: string;        // "2026-03-20"
  slug: string;        // 用于 URL 的路径: "2026-03-20-01"
  asset: ImageMetadata;
  title: string;       // 默认 "Untitled"
  description?: string;
  tags?: string[];
  location?: string;
}

export async function getPhotos(): Promise<Photo[]> {
  // 1. 自动扫描 assets/gallery 下的所有图片
  // 路径相对于当前文件，或者使用绝对路径 (Astro 会解析)
  const allImages = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/gallery/**/*.{jpeg,jpg,png,webp,avif,JPEG,JPG}',
    { eager: true }
  );

  // 2. 获取手动编写的 metadata
  // 注意：getCollection 返回的是一个数组，即便只有一个 JSON 文件
  const metadataCollection = await getCollection('gallery-metadata');
  const overrides = metadataCollection[0]?.data.overrides || {};

  const photos = Object.entries(allImages).map(([filepath, module]) => {
    // 提取 ID，例如从 "/src/assets/gallery/2026-03-20/01.jpg" 
    // 提取出 "2026-03-20/01"
    const id = filepath
      .replace('/src/assets/gallery/', '')
      .replace(/\.[^/.]+$/, '');

    const [date] = id.split('/');
    const photoOverride = overrides[id] || {};

    return {
      id,
      date,
      slug: id.replace(/\//g, '-'), // "2026-03-20-01"
      asset: module.default,
      title: photoOverride.title || 'Untitled',
      description: photoOverride.description,
      tags: photoOverride.tags,
      location: photoOverride.location,
    };
  });

  // 按日期和 ID 倒序排列 (最新的在前)
  return photos.sort((a, b) => b.id.localeCompare(a.id));
}
