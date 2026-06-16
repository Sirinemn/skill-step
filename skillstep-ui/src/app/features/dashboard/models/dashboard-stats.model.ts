import { CategoryStats } from "./category-stats.model";
import { DayActivity } from "./day-activity.model";

export interface DashboardStats {
  totalLogs:         number;
  totalMinutes:      number;
  activeCategories:  number;
  logsThisWeek:      number;
  streakDays:        number;
  activityLast7Days: DayActivity[];
  topCategories:     CategoryStats[];
}