'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import { Play, Trophy, X } from 'lucide-react';
export function DayCelebration({ onClose, onReplay }: { onClose: () => void; onReplay: () => void }) {
 const dialogRef = useRef<HTMLDialogElement>(null);
 useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => dialog?.close(); }, []);
 return <dialog ref={dialogRef} className="day-celebration" aria-labelledby="day-celebration-title" onCancel={event => { event.preventDefault(); onClose(); }}>
  <div className="celebration-confetti" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ '--confetti-left': `${(index * 37) % 100}%`, '--confetti-delay': `${-(index % 9) * 0.35}s`, '--confetti-duration': `${2.8 + index % 5 * 0.3}s`, '--confetti-color': ['#83cba5', '#f6e9c5', '#edcb72', '#e87979', '#8cc9ef'][index % 5] } as CSSProperties} />)}</div>
  <button className="icon-button celebration-close" aria-label="Stäng grattiskort" onClick={onClose}><X size={23}/></button>
  <div className="celebration-trophy" aria-hidden="true"><Trophy size={70} strokeWidth={1.5}/><span>✨</span></div>
  <h2 id="day-celebration-title">Grattis du klarade 3/4 uppdrag</h2>
  <p>Vilket dygn! Kör igen för nya slumpade uppdrag.</p>
  <div className="celebration-actions"><button className="secondary" onClick={onClose}>Stäng</button><button className="primary" onClick={onReplay} autoFocus><Play size={18}/> Kör igen</button></div>
 </dialog>;
}
