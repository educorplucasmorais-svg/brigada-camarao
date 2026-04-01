import { QRCodeSVG } from 'qrcode.react';
import type { User, QRProfileData } from '../types';

function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
}

export function buildQRData(user: User): QRProfileData {
  const raw = `${user.id}:${user.name}:${user.cpf || ''}:${user.credentialNumber || ''}`;
  return {
    id: user.id,
    name: user.name,
    cpf: user.cpf || '',
    credentialNumber: user.credentialNumber || '',
    role: user.role,
    hash: generateHash(raw),
  };
}

interface Props {
  user: User;
  size?: number;
  showCard?: boolean;
}

export function QRProfileCard({ user, size = 180, showCard = true }: Props) {
  const qrData = buildQRData(user);
  const qrValue = JSON.stringify(qrData);

  const qr = (
    <QRCodeSVG
      value={qrValue}
      size={size}
      bgColor="transparent"
      fgColor="#1a1a2e"
      level="H"
      marginSize={2}
      imageSettings={{
        src: '/images/logo-brigada.png',
        height: size * 0.2,
        width: size * 0.2,
        excavate: true,
      }}
    />
  );

  if (!showCard) return qr;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-xs mx-auto">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#900001] via-[#ba100a] to-[#900001]" />

      <div className="p-6 text-center">
        {/* Logo */}
        <img src="/images/logo-brigada.png" alt="Brigada Camarão"
          className="w-14 h-14 rounded-full object-contain mx-auto mb-3" />

        <h3 className="text-base font-extrabold text-[#1a1a2e] tracking-tight">{user.name}</h3>
        <p className="text-[11px] font-bold text-[#ba100a] tracking-[0.15em] uppercase mt-0.5">
          {user.credentialNumber || 'BOMBEIRO CIVIL'}
        </p>

        {/* QR Code */}
        <div className="my-5 flex justify-center">
          <div className="p-3 bg-white rounded-xl border-2 border-[#f0f0f0]">
            {qr}
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2 text-left">
          {user.cpf && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#fafafa] rounded-lg">
              <span className="material-symbols-outlined text-[#ba100a] text-lg">badge</span>
              <div>
                <p className="text-[9px] text-[#999] uppercase tracking-wider font-bold">CPF</p>
                <p className="text-xs font-semibold text-[#333]">{formatCpfDisplay(user.cpf)}</p>
              </div>
            </div>
          )}
          {user.credentialNumber && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#fafafa] rounded-lg">
              <span className="material-symbols-outlined text-[#ba100a] text-lg">verified</span>
              <div>
                <p className="text-[9px] text-[#999] uppercase tracking-wider font-bold">Credencial</p>
                <p className="text-xs font-semibold text-[#333]">{user.credentialNumber}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-[9px] text-[#bbb] mt-4 tracking-wider">
          Escaneie para verificar identidade
        </p>
      </div>
    </div>
  );
}

function formatCpfDisplay(cpf: string): string {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
