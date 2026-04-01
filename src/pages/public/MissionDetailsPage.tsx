import { useParams, Link } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';
import { Flame, ArrowLeft, ArrowRight, Shirt, Building2, Radio, MessageCircle, ChevronDown, Users } from 'lucide-react';

export function MissionDetailsPage() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-on-surface-variant font-medium">Missão não encontrada.</p>
          <Link to="/eventos" className="text-primary font-bold text-sm mt-2 inline-block">← Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top branded header */}
      <div className="bg-primary px-4 py-4 flex items-center gap-3">
        <Link to="/eventos" className="text-on-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Flame className="w-5 h-5 text-on-primary" />
        <div>
          <p className="text-on-primary font-black text-sm uppercase tracking-wider">Brigada Camarão</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Event header */}
        <div className="mb-6">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Brigada Ativa</p>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Detalhes do Evento</h1>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-success pulse-dot" />
            <span className="text-sm font-bold text-success">Inscrição Confirmada</span>
            <span className="ml-auto text-2xl font-black text-on-surface">{event.filledVacancies}/{event.vacancies}</span>
          </div>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Preenchidas</p>
          <p className="text-sm font-bold text-on-surface mt-2">Sua vaga está garantida!</p>
        </div>

        {/* Info sections */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
              <Shirt className="w-5 h-5 text-on-tertiary-container" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Uniforme</p>
              <p className="text-sm font-bold text-on-surface">{event.uniform || 'Uniforme completo brigada'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
              <Building2 className="w-5 h-5 text-on-tertiary-container" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Local</p>
              <p className="text-sm font-bold text-on-surface">{event.location}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-outline" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                <Radio className="w-5 h-5 text-on-tertiary-container" />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Comunicação</p>
                <p className="text-sm font-bold text-on-surface">Grupo de Coordenação</p>
              </div>
            </div>
            <a
              href="#"
              className="w-full py-3 bg-success text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 uppercase tracking-tight"
            >
              <MessageCircle className="w-4 h-4" />
              Entrar no Grupo de WhatsApp
            </a>
          </div>
        </div>

        {/* Registrations section */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <p className="text-sm font-bold text-on-surface uppercase">Inscrições</p>
            </div>
            <ChevronDown className="w-5 h-5 text-outline" />
          </div>
        </div>

        {/* Confirm button */}
        <div className="mt-6">
          <Link
            to="/confirmacao"
            className="w-full py-4 bg-primary text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight"
          >
            Confirmar Dados e Inscrição
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
