

export interface Project {
  id: number;
  name: string;
  slug: string;

  type: string | null;
  url: string;

  start_date: string | null;
  end_date: string | null;

  summary: string;
  blocks: ProjectBlock[];

  categories: Category[];
  languages: Language[];
  tools: Tool[];
  type_ids?: number[];

  images: ProjectImage[];
  thumbnail: ProjectThumbnail;
}

export interface ProjectBrief {
  id: number;
  name: string;
  slug: string;

  type: Type | null;

  summary: string;

  start_date: string | null;
  end_date: string | null;

  categories: Category[];
  languages: Language[];

  thumbnail: ProjectThumbnail;
}

export interface ProjectBlock {
  id: number;
  type: string;
  position: number;
  config: {
    text?: string;
    image_ids?: Array<number | string>;
    images?: ProjectImage[];
    [key: string]: unknown;
  };
}

export interface ProjectImage {
  id: number;
  image: string;
  alt_text: string;
}

export interface ProjectThumbnail {
  id: number;
  url: string;
  alt_text: string;
}

export interface Language {
  id?: number;
  language: string;
  image_url: string;

}

// Categories are what a project is about, related to or uses
export interface Category {
  id?: number;
  category: string;
}

// Types define the overarching classification "Personal", "Work", "Academic" etc
export interface Type {
  id?: number;
  type: string;
}

export interface Tool {
  id: number;
  tool: string;
  image_url: string;
}