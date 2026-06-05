import { Category } from '../category/models/category.model';

export interface LearningLog {
  id: number;
  title: string;
  description: string | null;
  durationMin: number;
  logDate: string;
  resourceUrl: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}
