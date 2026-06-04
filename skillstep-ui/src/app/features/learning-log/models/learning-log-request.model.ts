export interface LearningLogRequest {
  title:       string;
  description: string | null;
  durationMin: number;
  logDate:     string;
  resourceUrl: string | null;
  categoryId:  number | null;
}