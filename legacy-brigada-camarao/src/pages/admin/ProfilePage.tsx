import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { QRProfileCard } from '../../components/QRProfileCard';
import { QRScannerModal } from '../../components/QRScannerModal';
import type { QRProfileData } from '../../types';

const Icon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>{name}</span>
);

export function ProfilePage() {
  const { user } = useAuth();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<QRProfileData | null>(null);

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'coo';

  const handleScan = (data: QRProfileData) => {
    setScannedProfile(data);
    setScannerOpen(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-bold text-primary-container uppercase tracking-[0.15em] mb-1">Minha Conta</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Perfil & Credencial</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          {isAdmin ? 'Gerencie sua identidade e escaneie credenciais da equipe.' : 'Seu QR Code pessoal para check-in em eventos.'}
        </p>
      </div>

      {/* ═══ QR Credential Card ═══ */}
      <QRProfileCard user={user} size={200} />

      {/* ═══ Profile Info ═══ */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
        <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Icon name="person" filled className="text-primary-container text-lg" />
          Dados Pessoais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon="badge" label="Nome" value={user.name} />
          <InfoRow icon="mail" label="E-mail" value={user.email} />
          {user.phone && <InfoRow icon="phone" label="Telefone" value={user.phone} />}
          {user.cpf && <InfoRow icon="fingerprint" label="CPF" value={formatCpf(user.cpf)} />}
          {user.pixKey && <InfoRow icon="pix" label="Chave PIX" value={user.pixKey} />}
          {user.credentialNumber && <InfoRow icon="verified" label="Nº Credencial" value={user.credentialNumber} />}
          <InfoRow icon="shield" label="Perfil" value={user.role.toUpperCase()} />
        </div>
      </div>

      {/* ═══ Admin: QR Scanner ═══ */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
          <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Icon name="qr_code_scanner" filled className="text-primary-container text-lg" />
            Verificar Credencial
          </h2>
          <p className="text-xs text-on-surface-variant">
            Escaneie o QR Code de um membro para verificar identidade no evento.
          </p>
          <button onClick={() => setScannerOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#ba100a] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98]">
            <Icon name="photo_camera" className="text-lg" />
            Escanear QR Code
          </button>

          {/* Scanned Result */}
          {scannedProfile && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="check_circle" filled className="text-[#16a34a] text-xl" />
                <h3 className="text-sm font-bold text-[#15803d]">Credencial Verificada</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ScanResult label="Nome" value={scannedProfile.name} />
                <ScanResult label="CPF" value={formatCpf(scannedProfile.cpf)} />
                <ScanResult label="Credencial" value={scannedProfile.credentialNumber} />
                <ScanResult label="Hash" value={scannedProfile.hash} />
              </div>
              <button onClick={() => setScannedProfile(null)}
                className="mt-2 text-xs text-[#16a34a] font-bold hover:underline">
                Escanear outro
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ Actions ═══ */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
        <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Icon name="tune" filled className="text-primary-container text-lg" />
          Ações
        </h2>
        <div className="flex flex-wrap gap-2">
          <ActionButton icon="download" label="Baixar QR Code" onClick={() => downloadQR(user.name)} />
          <ActionButton icon="share" label="Compartilhar" onClick={() => shareProfile(user.name)} />
        </div>
      </div>

      <QRScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleScan} />
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#fafafa] rounded-lg">
      <span className="material-symbols-outlined text-[#ba100a]/60 text-lg">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] text-[#999] uppercase tracking-wider font-bold">{label}</p>
        <p className="text-xs font-semibold text-[#333] truncate">{value}</p>
      </div>
    </div>
  );
}

function ScanResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5">
      <p className="text-[9px] text-[#666] uppercase tracking-wider font-bold">{label}</p>
      <p className="text-xs font-semibold text-[#333]">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] hover:bg-[#eee] rounded-xl text-sm font-semibold text-[#333] transition-colors active:scale-[0.97]">
      <span className="material-symbols-outlined text-lg text-[#ba100a]">{icon}</span>
      {label}
    </button>
  );
}

function formatCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function downloadQR(name: string) {
  const svg = document.querySelector('.max-w-xs svg') as SVGElement | null;
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.download = `qr-${name.toLowerCase().replace(/\s/g, '-')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

async function shareProfile(name: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Credencial - ${name}`,
        text: `Credencial Brigada Camarão: ${name}`,
        url: window.location.href,
      });
    } catch { /* cancelled */ }
  }
}
