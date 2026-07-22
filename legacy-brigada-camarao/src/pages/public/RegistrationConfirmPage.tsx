import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CONTRACT_TEXT = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE BRIGADISTA

BRIGADA CAMARÃO LTDA, pessoa jurídica de direito privado, inscrita no CNPJ nº 71.769.886/0001-81, com sede na Rua Piauí, nº 411, Bairro Coração de Jesus, Belo Horizonte/MG, CEP 30.740-430, doravante denominada CONTRATANTE.

CONTRATADO: O profissional cadastrado na plataforma Sentinel Response, devidamente identificado por CPF e número de credencial, doravante denominado CONTRATADO.

CLÁUSULA 1ª – DO OBJETO
O presente contrato tem por objeto a prestação de serviços de brigadista civil pelo CONTRATADO ao CONTRATANTE, para atuação no evento especificado na escala da plataforma.

CLÁUSULA 2ª – DA REMUNERAÇÃO
O CONTRATADO receberá remuneração conforme valor estabelecido na escala do evento, a ser pago via PIX na chave cadastrada, em até 5 dias úteis após o término do evento.

CLÁUSULA 3ª – DAS OBRIGAÇÕES DO CONTRATADO
I. Comparecer ao local com 30 minutos de antecedência;
II. Portar uniforme completo conforme Portaria 50/CBMMG e normas da CONTRATANTE;
III. Manter postura profissional durante toda a escala;
IV. Comunicar ausência com mínimo de 24 horas de antecedência;
V. Não consumir bebidas alcoólicas durante a escala.

CLÁUSULA 4ª – DAS OBRIGAÇÕES DA CONTRATANTE
I. Fornecer local adequado para descanso durante folgas;
II. Garantir alimentação durante escalas superiores a 8 horas;
III. Efetuar pagamento no prazo estipulado;
IV. Fornecer todas as informações necessárias sobre o evento.

CLÁUSULA 5ª – DO UNIFORME
O CONTRATADO deverá apresentar-se com uniforme completo conforme determinado pela Portaria 50/CBMMG: calça preta, camiseta/polo vermelha com identificação, colete refletivo, boné e calçado fechado preto.

CLÁUSULA 6ª – DA VIGÊNCIA
O presente contrato vigorará pelo período do evento especificado na escala, podendo ser renovado a cada nova inscrição aprovada.

CLÁUSULA 7ª – DA RESCISÃO
O descumprimento de quaisquer cláusulas deste contrato poderá resultar em cancelamento da inscrição, bloqueio temporário ou definitivo na plataforma, sem prejuízo das demais sanções legais cabíveis.

CLÁUSULA 8ª – DA CONFIDENCIALIDADE
O CONTRATADO compromete-se a manter sigilo sobre informações dos clientes, locais de evento e dados operacionais da CONTRATANTE.

CLÁUSULA 9ª – DO FORO
Fica eleito o foro da Comarca de Belo Horizonte/MG para dirimir quaisquer dúvidas ou litígios decorrentes do presente contrato.

CLÁUSULA 10ª – DA LGPD
Os dados pessoais do CONTRATADO serão tratados conforme a Lei 13.709/2018 (LGPD), sendo utilizados exclusivamente para fins de gestão contratual e pagamento.

CLÁUSULA 11ª – DA ASSINATURA DIGITAL
A confirmação via plataforma Sentinel Response, mediante aceite do presente contrato, tem validade jurídica equivalente à assinatura física, nos termos da MP 2.200-2/2001 e da Lei 14.063/2020.`;

export function RegistrationConfirmPage() {
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [pixValue, setPixValue] = useState(user?.pixKey ?? 'ricardo.brigada@email.com');

  const displayName = user?.name ?? 'Ricardo Augusto Camarão';
  const rawCpf = user?.cpf ?? '00000000189';
  const maskedCpf = `•••.•••.${rawCpf.slice(-5, -2)}-••`;
  const credential = user?.credentialNumber ?? 'BC-00421';

  if (confirmed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
          <span
            className="material-symbols-outlined text-5xl text-success block mb-4"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight mb-2">
            Inscrição Confirmada!
          </h2>
          <p className="text-on-surface-variant text-sm font-medium mb-8">
            Sua inscrição foi registrada. Aguarde o contato da equipe.
          </p>
          <Link
            to="/eventos"
            className="inline-block py-3.5 px-8 bg-primary text-on-primary font-black text-sm rounded-2xl uppercase tracking-tight"
          >
            Ver Outros Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* TopAppBar */}
      <div className="sticky top-0 z-30 bg-white border-b border-outline-variant/20">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <Link to="/eventos" className="p-1 -ml-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <img
            src="/images/logo-brigada.png"
            alt="Brigada Camarão"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">BRIGADA CAMARÃO</p>
            <p className="text-sm font-black text-on-surface">Confirmação de Inscrição</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto pb-2">
        {/* Page header */}
        <div className="px-4 pt-6 pb-3">
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
            VERIFIQUE SEUS DADOS
          </p>
          <p className="text-sm text-on-surface-variant">
            Confirme as informações abaixo antes de prosseguir.
          </p>
        </div>

        {/* Data card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mx-4 mb-4">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">
            SEUS DADOS
          </p>

          {/* Nome */}
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              NOME COMPLETO
            </p>
            <div className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mt-1.5">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">person</span>
              <span className="text-sm font-bold text-on-surface flex-1">{displayName}</span>
              <span
                className="material-symbols-outlined text-[18px] text-success shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* CPF */}
          <div className="mt-3">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              CPF DE REGISTRO
            </p>
            <div className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mt-1.5">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">badge</span>
              <span className="text-sm font-bold text-on-surface">{maskedCpf}</span>
            </div>
          </div>

          {/* PIX */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                CHAVE PIX PARA REEMBOLSO
              </p>
              <span className="text-[9px] font-black text-success uppercase tracking-widest">CONFIRMADA</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mt-1.5">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">pix</span>
              <input
                type="text"
                value={pixValue}
                onChange={(e) => setPixValue(e.target.value)}
                className="text-sm font-bold text-on-surface flex-1 bg-transparent outline-none"
              />
              <span className="material-symbols-outlined text-[16px] text-outline shrink-0">edit</span>
            </div>
          </div>

          {/* Credencial */}
          <div className="mt-3">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              NÚMERO CREDENCIAL
            </p>
            <div className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 mt-1.5">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">qr_code</span>
              <span className="text-sm font-bold text-on-surface flex-1">{credential}</span>
              <span
                className="material-symbols-outlined text-[18px] text-success shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
        </div>

        {/* Contract card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mx-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">description</span>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS
            </p>
          </div>
          <div className="max-h-52 overflow-y-auto bg-surface-container rounded-xl p-4">
            <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">
              {CONTRACT_TEXT}
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="px-4 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-primary shrink-0"
            />
            <span className="text-sm text-on-surface-variant font-medium">
              Li e aceito os termos do Contrato de Prestação de Serviços de Brigadista da Brigada Camarão.
            </span>
          </label>
        </div>

        {/* Warning */}
        <div className="mx-4 mb-6 bg-error-container/60 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-error shrink-0 mt-0.5">warning</span>
          <p className="text-xs text-on-error-container font-medium leading-relaxed">
            Ao confirmar, você está assumindo compromisso profissional com esta escala. Ausências não comunicadas impactam sua avaliação na plataforma.
          </p>
        </div>

        {/* Confirm button */}
        <div className="px-4 pb-8">
          <button
            onClick={() => accepted && setConfirmed(true)}
            disabled={!accepted}
            className="w-full py-4 bg-primary disabled:opacity-40 text-on-primary font-black rounded-2xl uppercase tracking-tight transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            Confirmar Dados e Inscrição
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
