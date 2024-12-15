import { Category } from './category.interface';

export interface Task {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  category?: Category;
}
