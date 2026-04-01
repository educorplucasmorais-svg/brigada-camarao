import bcrypt from 'bcryptjs';
import prisma from './lib/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  const hash = await bcrypt.hash('123456', 12);

  // Users (upsert to handle re-runs)
  for (const user of [
    { name: 'Iago Camarão', email: 'admin@brigadacamarao.com', passwordHash: hash, role: 'admin', phone: '(31) 99999-0001' },
    { name: 'Carlos Oliveira', email: 'coo@brigadacamarao.com', passwordHash: hash, role: 'coo', phone: '(31) 99999-0002' },
    { name: 'Maria Silva', email: 'staff@brigadacamarao.com', passwordHash: hash, role: 'staff', phone: '(31) 99999-0003' },
  ]) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Events
  const events = [
    { title: 'Festival Gastronômico BH', date: '2026-04-15', location: 'Belo Horizonte, MG', status: 'upcoming', type: 'Festival', vacancies: 25, filledVacancies: 18, budget: 45000, description: 'Festival gastronômico com 50+ barracas', uniform: 'Camiseta preta + colete refletivo' },
    { title: 'Show Sertanejo Arena', date: '2026-04-20', location: 'Uberlândia, MG', status: 'active', type: 'Show', vacancies: 40, filledVacancies: 40, budget: 72000, description: 'Show com público estimado de 15.000 pessoas', uniform: 'Uniforme completo brigada' },
    { title: 'Feira Industrial FIEMG', date: '2026-04-25', location: 'Contagem, MG', status: 'upcoming', type: 'Feira', vacancies: 15, filledVacancies: 8, budget: 28000, description: 'Feira industrial com foco em segurança do trabalho' },
    { title: 'Casamento Villa Real', date: '2026-05-02', location: 'Nova Lima, MG', status: 'upcoming', type: 'Evento Privado', vacancies: 6, filledVacancies: 6, budget: 8500 },
    { title: 'Carnaval Ouro Preto', date: '2026-02-14', location: 'Ouro Preto, MG', status: 'completed', type: 'Carnaval', vacancies: 60, filledVacancies: 60, budget: 120000, description: 'Cobertura completa do carnaval' },
    { title: 'Corrida de Rua 10K', date: '2026-05-10', location: 'Betim, MG', status: 'upcoming', type: 'Esportivo', vacancies: 12, filledVacancies: 5, budget: 15000 },
    { title: 'Rock in BH Festival', date: '2026-03-28', location: 'Belo Horizonte, MG', status: 'completed', type: 'Show', vacancies: 50, filledVacancies: 50, budget: 95000 },
    { title: 'Expo Construção 2026', date: '2026-04-18', location: 'Belo Horizonte, MG', status: 'active', type: 'Feira', vacancies: 20, filledVacancies: 16, budget: 35000 },
  ];
  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // Team members
  const members = [
    { name: 'João Pedro Santos', role: 'Brigadista Líder', phone: '(31) 99876-5432', email: 'joao@brigada.com', status: 'on_mission', certifications: '["NR-23","APH","NR-35"]', eventsCompleted: 89 },
    { name: 'Ana Carolina Lima', role: 'Socorrista', phone: '(31) 99765-4321', email: 'ana@brigada.com', status: 'active', certifications: '["APH","Resgate","PHTLS"]', eventsCompleted: 67 },
    { name: 'Roberto Ferreira', role: 'Técnico Segurança', phone: '(31) 99654-3210', email: 'roberto@brigada.com', status: 'active', certifications: '["TST","NR-35","NR-33"]', eventsCompleted: 45 },
    { name: 'Fernanda Oliveira', role: 'Brigadista', phone: '(31) 99543-2109', email: 'fernanda@brigada.com', status: 'on_mission', certifications: '["NR-23","Primeiros Socorros"]', eventsCompleted: 34 },
    { name: 'Lucas Mendes', role: 'Brigadista', phone: '(31) 99432-1098', email: 'lucas@brigada.com', status: 'active', certifications: '["NR-23","APH"]', eventsCompleted: 52 },
  ];
  for (const member of members) {
    await prisma.teamMember.upsert({
      where: { email: member.email },
      update: {},
      create: member,
    });
  }

  // Quotes with items
  await prisma.quote.create({
    data: {
      clientName: 'Prefeitura de BH', eventType: 'Festival', date: '2026-04-10', value: 85000, status: 'approved',
      items: { create: [
        { description: 'Brigadistas (20 un x 12h)', quantity: 20, unitPrice: 540 },
        { description: 'Socorristas (5 un x 12h)', quantity: 5, unitPrice: 660 },
        { description: 'Equipamentos', quantity: 1, unitPrice: 8500 },
      ]},
    },
  });

  await prisma.quote.create({
    data: {
      clientName: 'Arena Shows MG', eventType: 'Show', date: '2026-04-12', value: 72000, status: 'pending',
      items: { create: [
        { description: 'Equipe Completa (40 profissionais)', quantity: 40, unitPrice: 1500 },
        { description: 'Ambulância UTI', quantity: 2, unitPrice: 6000 },
      ]},
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
