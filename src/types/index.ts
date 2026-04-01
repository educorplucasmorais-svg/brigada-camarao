export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coo' | 'staff';
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  type: string;
  vacancies: number;
  filledVacancies: number;
  budget: number;
  description?: string;
  uniform?: string;
}

export interface Vacancy {
  id: string;
  eventId: string;
  eventTitle: string;
  role: string;
  quantity: number;
  filled: number;
  status: 'open' | 'filled' | 'closed';
  requirements: string[];
  hourlyRate: number;
}

export interface Quote {
  id: string;
  clientName: string;
  eventType: string;
  date: string;
  value: number;
  status: 'pending' | 'approved' | 'rejected' | 'negotiating';
  items: QuoteItem[];
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on_mission';
  certifications: string[];
  avatar?: string;
  eventsCompleted: number;
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalStaff: number;
  availableStaff: number;
  monthlyRevenue: number;
  pendingQuotes: number;
  occupancyRate: number;
  customerSatisfaction: number;
}
