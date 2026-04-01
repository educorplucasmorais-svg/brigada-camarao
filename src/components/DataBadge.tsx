/** Shows if data is live from API or using demo fallback */
export function DataBadge({ isLive, className = '' }: { isLive: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-outline'}`} />
      <span className={isLive ? 'text-success' : 'text-outline'}>
        {isLive ? 'Live' : 'Demo'}
      </span>
    </span>
  );
}
