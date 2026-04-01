import type { Event, Vacancy, Quote, TeamMember, DashboardStats } from '../types';

export const mockStats: DashboardStats = {
  totalEvents: 47,
  activeEvents: 8,
  totalStaff: 156,
  availableStaff: 89,
  monthlyRevenue: 285000,
  pendingQuotes: 12,
  occupancyRate: 78,
  customerSatisfaction: 96,
};

export const mockEvents: Event[] = [
  { id: '1', title: 'Festival Gastronômico BH', date: '2026-04-15', location: 'Belo Horizonte, MG', status: 'upcoming', type: 'Festival', vacancies: 25, filledVacancies: 18, budget: 45000, description: 'Festival gastronômico com 50+ barracas', uniform: 'Camiseta preta + colete refletivo' },
  { id: '2', title: 'Show Sertanejo Arena', date: '2026-04-20', location: 'Uberlândia, MG', status: 'active', type: 'Show', vacancies: 40, filledVacancies: 40, budget: 72000, description: 'Show com público estimado de 15.000 pessoas', uniform: 'Uniforme completo brigada' },
  { id: '3', title: 'Feira Industrial FIEMG', date: '2026-04-25', location: 'Contagem, MG', status: 'upcoming', type: 'Feira', vacancies: 15, filledVacancies: 8, budget: 28000, description: 'Feira industrial com foco em segurança do trabalho' },
  { id: '4', title: 'Casamento Villa Real', date: '2026-05-02', location: 'Nova Lima, MG', status: 'upcoming', type: 'Evento Privado', vacancies: 6, filledVacancies: 6, budget: 8500 },
  { id: '5', title: 'Carnaval Ouro Preto', date: '2026-02-14', location: 'Ouro Preto, MG', status: 'completed', type: 'Carnaval', vacancies: 60, filledVacancies: 60, budget: 120000, description: 'Cobertura completa do carnaval' },
  { id: '6', title: 'Corrida de Rua 10K', date: '2026-05-10', location: 'Betim, MG', status: 'upcoming', type: 'Esportivo', vacancies: 12, filledVacancies: 5, budget: 15000 },
  { id: '7', title: 'Rock in BH Festival', date: '2026-03-28', location: 'Belo Horizonte, MG', status: 'completed', type: 'Show', vacancies: 50, filledVacancies: 50, budget: 95000 },
  { id: '8', title: 'Expo Construção 2026', date: '2026-04-18', location: 'Belo Horizonte, MG', status: 'active', type: 'Feira', vacancies: 20, filledVacancies: 16, budget: 35000 },
];

export const mockVacancies: Vacancy[] = [
  { id: '1', eventId: '1', eventTitle: 'Festival Gastronômico BH', role: 'Brigadista', quantity: 10, filled: 7, status: 'open', requirements: ['NR-23', 'Primeiros Socorros'], hourlyRate: 45 },
  { id: '2', eventId: '1', eventTitle: 'Festival Gastronômico BH', role: 'Socorrista', quantity: 5, filled: 3, status: 'open', requirements: ['APH', 'NR-23'], hourlyRate: 55 },
  { id: '3', eventId: '2', eventTitle: 'Show Sertanejo Arena', role: 'Brigadista', quantity: 20, filled: 20, status: 'filled', requirements: ['NR-23'], hourlyRate: 50 },
  { id: '4', eventId: '2', eventTitle: 'Show Sertanejo Arena', role: 'Segurança', quantity: 15, filled: 15, status: 'filled', requirements: ['Vigilante'], hourlyRate: 40 },
  { id: '5', eventId: '3', eventTitle: 'Feira Industrial FIEMG', role: 'Técnico Segurança', quantity: 8, filled: 4, status: 'open', requirements: ['TST', 'NR-35'], hourlyRate: 60 },
  { id: '6', eventId: '6', eventTitle: 'Corrida de Rua 10K', role: 'Socorrista', quantity: 6, filled: 2, status: 'open', requirements: ['APH', 'Resgate'], hourlyRate: 55 },
  { id: '7', eventId: '8', eventTitle: 'Expo Construção 2026', role: 'Brigadista', quantity: 10, filled: 8, status: 'open', requirements: ['NR-23', 'NR-35'], hourlyRate: 48 },
];

export const mockQuotes: Quote[] = [
  { id: '1', clientName: 'Prefeitura de BH', eventType: 'Festival', date: '2026-04-10', value: 85000, status: 'approved', items: [{ description: 'Brigadistas (20 un x 12h)', quantity: 20, unitPrice: 540 }, { description: 'Socorristas (5 un x 12h)', quantity: 5, unitPrice: 660 }, { description: 'Equipamentos', quantity: 1, unitPrice: 8500 }] },
  { id: '2', clientName: 'Arena Shows MG', eventType: 'Show', date: '2026-04-12', value: 72000, status: 'pending', items: [{ description: 'Equipe Completa (40 profissionais)', quantity: 40, unitPrice: 1500 }, { description: 'Ambulância UTI', quantity: 2, unitPrice: 6000 }] },
  { id: '3', clientName: 'FIEMG', eventType: 'Feira', date: '2026-04-08', value: 28000, status: 'negotiating', items: [{ description: 'Técnicos Segurança (8 un x 10h)', quantity: 8, unitPrice: 600 }, { description: 'Brigadistas (7 un x 10h)', quantity: 7, unitPrice: 450 }, { description: 'Equipamentos NR', quantity: 1, unitPrice: 4850 }] },
  { id: '4', clientName: 'Eventos Villa Real', eventType: 'Casamento', date: '2026-04-20', value: 8500, status: 'approved', items: [{ description: 'Brigadistas (6 un x 8h)', quantity: 6, unitPrice: 1100 }, { description: 'Kit Primeiros Socorros', quantity: 2, unitPrice: 450 }] },
  { id: '5', clientName: 'Secretaria de Esportes', eventType: 'Corrida', date: '2026-04-22', value: 15000, status: 'pending', items: [{ description: 'Socorristas (6 un x 6h)', quantity: 6, unitPrice: 330 }, { description: 'Ambulância Básica', quantity: 2, unitPrice: 3500 }, { description: 'Moto Resgate', quantity: 2, unitPrice: 2020 }] },
  { id: '6', clientName: 'Mineração Vale Verde', eventType: 'Industrial', date: '2026-04-05', value: 120000, status: 'rejected', items: [{ description: 'Brigada Industrial (30 un x 30 dias)', quantity: 30, unitPrice: 3500 }, { description: 'Equipamentos Especiais', quantity: 1, unitPrice: 15000 }] },
];

export const mockTeam: TeamMember[] = [
  { id: '1', name: 'João Pedro Santos', role: 'Brigadista Líder', phone: '(31) 99876-5432', email: 'joao@brigada.com', status: 'on_mission', certifications: ['NR-23', 'APH', 'NR-35'], eventsCompleted: 89 },
  { id: '2', name: 'Ana Carolina Lima', role: 'Socorrista', phone: '(31) 99765-4321', email: 'ana@brigada.com', status: 'active', certifications: ['APH', 'Resgate', 'PHTLS'], eventsCompleted: 67 },
  { id: '3', name: 'Roberto Ferreira', role: 'Técnico Segurança', phone: '(31) 99654-3210', email: 'roberto@brigada.com', status: 'active', certifications: ['TST', 'NR-35', 'NR-33'], eventsCompleted: 45 },
  { id: '4', name: 'Fernanda Oliveira', role: 'Brigadista', phone: '(31) 99543-2109', email: 'fernanda@brigada.com', status: 'on_mission', certifications: ['NR-23', 'Primeiros Socorros'], eventsCompleted: 34 },
  { id: '5', name: 'Lucas Mendes', role: 'Brigadista', phone: '(31) 99432-1098', email: 'lucas@brigada.com', status: 'active', certifications: ['NR-23', 'APH'], eventsCompleted: 52 },
  { id: '6', name: 'Patricia Souza', role: 'Socorrista', phone: '(31) 99321-0987', email: 'patricia@brigada.com', status: 'inactive', certifications: ['APH', 'ACLS'], eventsCompleted: 78 },
  { id: '7', name: 'Marcos Almeida', role: 'Segurança', phone: '(31) 99210-9876', email: 'marcos@brigada.com', status: 'active', certifications: ['Vigilante', 'Defesa Pessoal'], eventsCompleted: 23 },
  { id: '8', name: 'Juliana Costa', role: 'Brigadista', phone: '(31) 99109-8765', email: 'juliana@brigada.com', status: 'active', certifications: ['NR-23', 'NR-35', 'APH'], eventsCompleted: 61 },
  { id: '9', name: 'Thiago Barbosa', role: 'Técnico Segurança', phone: '(31) 98998-7654', email: 'thiago@brigada.com', status: 'on_mission', certifications: ['TST', 'NR-33', 'NR-35', 'Resgate em Altura'], eventsCompleted: 92 },
  { id: '10', name: 'Camila Rodrigues', role: 'Recepcionista', phone: '(31) 98887-6543', email: 'camila@brigada.com', status: 'active', certifications: ['Atendimento'], eventsCompleted: 41 },
];
