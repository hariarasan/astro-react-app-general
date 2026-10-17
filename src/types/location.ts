export interface CitySuggestion {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone name, e.g. "Asia/Kolkata"
}

export interface BirthFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  birthTime: Date | null; // only hours/minutes are meaningful, carries AM/PM
  location: CitySuggestion | null;
}
