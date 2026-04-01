const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  upcoming: { label: 'Próximo', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  active: { label: 'Ativo', bg: 'bg-primary', text: 'text-on-primary' },
  completed: { label: 'Concluído', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' },
  cancelled: { label: 'Cancelado', bg: 'bg-error-container', text: 'text-on-error-container' },
  open: { label: 'Aberta', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  filled: { label: 'Preenchida', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  closed: { label: 'Fechada', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' },
  pending: { label: 'Pendente', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  approved: { label: 'Aprovado', bg: 'bg-primary-container', text: 'text-on-primary-container' },
  rejected: { label: 'Rejeitado', bg: 'bg-error-container', text: 'text-on-error-container' },
  negotiating: { label: 'Negociando', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  on_mission: { label: 'Em Missão', bg: 'bg-primary', text: 'text-on-primary' },
  inactive: { label: 'Inativo', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' },
  finalizado: { label: 'Finalizado', bg: 'bg-primary-container', text: 'text-on-primary-container' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
