import { FileText, ArrowRight } from 'lucide-react';
import { mockQuotes } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { DataBadge } from '../../components/DataBadge';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import type { Quote } from '../../types';

export function QuotesPage() {
  const { data: quotes, isLive } = useApiData<Quote[]>(() => api.getQuotes(), mockQuotes);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Pré-Comando</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">Orçamentos e Cotações</h1>
        </div>
        <DataBadge isLive={isLive} />
      </div>

      {/* Quotes grid */}
      <div className="space-y-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-surface-container-lowest shadow-sm">
            {/* Quote header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FileText className="w-5 h-5 text-on-primary-container" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Proposta Orç: 2024-{quote.id.padStart(3, '0')}
                  </p>
                  <h3 className="font-bold text-on-surface text-sm">{quote.clientName}</h3>
                </div>
              </div>
              <StatusBadge status={quote.status} />
            </div>

            {/* Quote items */}
            <div className="p-5">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Detalhes do Serviço</p>
              <div className="space-y-2 mb-4">
                {quote.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">{item.description}</span>
                    <span className="font-bold text-on-surface">R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/20 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Valor</p>
                  <p className="text-2xl font-black text-primary tracking-tight">
                    R$ {quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button className="py-2.5 px-4 bg-primary text-on-primary font-black text-xs rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-1.5 uppercase tracking-tight">
                  Detalhes <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
