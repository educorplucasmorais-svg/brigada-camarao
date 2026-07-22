import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { QRProfileData } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (data: QRProfileData) => void;
}

export function QRScannerModal({ open, onClose, onScan }: Props) {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING
          await scannerRef.current.stop();
        }
      } catch { /* ignore */ }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    const startScanner = async () => {
      if (!containerRef.current) return;
      setError('');
      setScanning(true);

      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText) as QRProfileData;
              if (data.id && data.name && data.hash) {
                onScan(data);
                stopScanner();
              }
            } catch {
              setError('QR Code inválido — não é um perfil Brigada Camarão.');
            }
          },
          () => { /* ignore scan failures */ }
        );
      } catch (err) {
        setError(
          err instanceof Error && err.message.includes('Permission')
            ? 'Permissão da câmera negada. Habilite nas configurações.'
            : 'Não foi possível iniciar a câmera.'
        );
        setScanning(false);
      }
    };

    const timer = setTimeout(startScanner, 300);
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [open, onScan, stopScanner]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) { stopScanner(); onClose(); } }}>
      <div className="bg-[#1e1e2a] rounded-2xl overflow-hidden w-full max-w-sm border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba100a] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
            <h3 className="text-sm font-bold text-white">Escanear Credencial</h3>
          </div>
          <button onClick={() => { stopScanner(); onClose(); }}
            className="text-white/30 hover:text-white/60 transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scanner viewport */}
        <div className="p-5">
          <div ref={containerRef} className="rounded-xl overflow-hidden bg-black aspect-square relative">
            <div id="qr-reader" className="w-full h-full" />
            {!scanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-white/30 text-5xl animate-pulse">photo_camera</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-base shrink-0">error</span>
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}

          <p className="text-[11px] text-white/30 text-center mt-3">
            Aponte a câmera para o QR Code da credencial
          </p>
        </div>
      </div>
    </div>
  );
}
