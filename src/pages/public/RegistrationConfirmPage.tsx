import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, CreditCard, Mail, AlertTriangle, CheckCircle } from 'lucide-react';

export function RegistrationConfirmPage() {
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-2">Inscrição Confirmada!</h2>
          <p className="text-on-surface-variant text-sm font-medium mb-6">
            Sua inscrição foi registrada com sucesso. Você receberá uma confirmação por e-mail.
          </p>
          <Link
            to="/eventos"
            className="inline-block py-3.5 px-8 bg-primary text-on-primary font-black text-sm rounded-2xl shadow-xl shadow-primary/30 uppercase tracking-tight"
          >
            Ver Outros Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/eventos" className="text-on-surface-variant">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[11px] font-black text-primary uppercase tracking-widest">Confirmação de Inscrição</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-extrabold text-on-surface tracking-tight mb-1">Verifique seus dados</h1>
        <p className="text-sm text-on-surface-variant mb-6">Confirme as informações para o deslocamento imediato.</p>

        {/* Data fields */}
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1.5">Nome Completo</label>
            <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-on-surface">Ricardo Augusto Camarão</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1.5">CPF de Registro</label>
            <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-on-surface">•••.452.189-••</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              Chave PIX para Reembolso
              <span className="text-success text-[10px]">CONFIRMADA</span>
            </label>
            <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-on-surface flex-1">ricardo.brigada@email.com</span>
              <button className="text-primary">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">
            Termos e Condições do Evento
          </p>
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm max-h-40 overflow-y-auto mb-4">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Contrato de Prestação de Serviços de Brigadista</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              BRIGADA CAMARÃO LTDA, pessoa jurídica de direito privado, inscrita no CNPJ nº 71.769.886/0001-81, 
              com sede na Rua Piauí, nº 411, Bairro Coração de Jesus, Belo Horizonte/MG, CEP 30.740-430, 
              doravante designada como CONTRATANTE.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-primary"
            />
            <span className="text-sm text-on-surface-variant font-medium">
              Li e aceito os termos de contrato do evento
            </span>
          </label>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-error-container rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <p className="text-xs text-on-error-container font-medium leading-relaxed">
            Ao confirmar, você está se comprometendo com a escala de proteção da <strong>Brigada Camarão</strong>. 
            Em caso de desistência, informe com antecedência profissional.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => accepted && setConfirmed(true)}
            disabled={!accepted}
            className="w-full py-4 bg-primary text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-40 disabled:active:scale-100"
          >
            Confirmar Dados e Inscrição
            <ArrowRight className="w-5 h-5" />
          </button>

          <Link
            to="/eventos"
            className="block text-center text-sm font-bold text-primary uppercase tracking-wider py-2"
          >
            Revisar Evento
          </Link>
        </div>
      </div>
    </div>
  );
}
