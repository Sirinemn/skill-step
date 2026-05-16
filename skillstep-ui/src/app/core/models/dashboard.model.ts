export interface KpiCard {
  value:   string;
  label:   string;
  color:   string;
  bgLight: string;
  bgDark:  string;
  borderLight: string;
  borderDark:  string;
}

export interface RecentLog {
  title:    string;
  date:     string;
  duration: string;
}

export interface TopCategory {
  name:       string;
  percentage: number;
  color:      string;
}
export interface ActivityDay {
  day:    string;
  height: number;
}
