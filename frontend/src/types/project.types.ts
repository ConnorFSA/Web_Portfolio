

export interface Project {
  id: number;
  name: string;
  slug: string;

  type: Type;
  url: string;

  start_date: Date;
  end_date: Date;

  summary: string;
  descriptions: Descriptions[];

  categories: Category[];
  languages: Language[];

  images: ProjectImage[];
  thumbnail: ProjectThumbnail;
}

export interface ProjectBrief {
  id: number;
  name: string;
  slug: string;

  type: Type;

  summary: string;

  start_date: Date;
  end_date: String;

  categories: Category[];
  languages: Language[];

  thumbnail: ProjectThumbnail;
}

export interface Descriptions {
  description: string;
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
  language: string;
  image_url: string;

}

// Categories are what a project is about, related to or uses
export interface Category {
  category: string;
}

// Types define the overarching classification "Personal", "Work", "Academic" etc
export interface Type {
  type: string;
}