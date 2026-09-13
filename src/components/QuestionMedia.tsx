import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { questionMediaError, type QuestionMedia as Media } from '../media/questionMedia';
import { Modal } from './Modal';
import '../styles/question-media.css';

interface Props {
  media?: readonly Media[];
  active?: boolean;
  showCredits?: boolean;
  muted?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function QuestionMedia({ media, active = true, showCredits = false, muted = false, onPlayingChange }: Props) {
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  useEffect(() => { if (!active) setEnlarged(false); }, [active]);
  if (!media?.length) return null;
  if (questionMediaError(media)) return <p role="alert">This question’s media is invalid.</p>;
  const item = media[index] ?? media[0];
  return <div className="question-media" data-question-media onKeyDown={(event) => event.stopPropagation()}>
    <MediaItem key={item.src} item={item} active={active && !enlarged} muted={muted} onPlayingChange={onPlayingChange} onEnlarge={() => setEnlarged(true)} />
    {media.length > 1 && <div className="question-media__navigation" aria-label="Question media">
      {media.map((_, i) => <button type="button" key={i} className="quiet-button" aria-pressed={index === i} onClick={() => setIndex(i)}>{i + 1}</button>)}
      <span>{index + 1} of {media.length}</span>
    </div>}
    {item.description && <details className="question-media__description"><summary>Text description</summary><p>{item.description}</p></details>}
    {showCredits && <p className="question-media__credit">{item.credit} · {item.license} · <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></p>}
    {enlarged && active && item.kind === 'image' && createPortal(<div className="question-media-modal"><Modal title="Question image" wide onClose={() => setEnlarged(false)}><img className="question-media__enlarged" src={item.src} alt={item.alt} /></Modal></div>, document.body)}
  </div>;
}

function MediaItem({ item, active, muted, onPlayingChange, onEnlarge }: { item: Media; active: boolean; muted: boolean; onPlayingChange?: (playing: boolean) => void; onEnlarge: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(item.kind === 'image' ? item.src : '');
  const [error, setError] = useState(false);
  const callback = useRef(onPlayingChange);
  callback.current = onPlayingChange;
  useEffect(() => {
    if (item.kind !== 'video') return;
    const controller = new AbortController();
    let objectUrl: string | undefined;
    // Fetch the complete cached file, then play a Blob URL. The browser handles
    // byte ranges locally, including when the PWA is completely offline.
    void fetch(item.src, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error('Media unavailable');
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(new Blob([blob], { type: item.mimeType }));
      setSrc(objectUrl);
    }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); callback.current?.(false); };
  }, [item.src, item.kind, item.mimeType]);
  useEffect(() => { if (!active) video.current?.pause(); }, [active]);
  useEffect(() => {
    const details = video.current?.closest('details');
    const pauseClosedReview = () => { if (!details?.open) video.current?.pause(); };
    details?.addEventListener('toggle', pauseClosedReview);
    return () => details?.removeEventListener('toggle', pauseClosedReview);
  }, [src]);
  useEffect(() => {
    const pause = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  if (error) return <div className="question-media__error" role="alert"><strong>Media couldn’t load.</strong><p>{item.description ?? item.alt}</p><small>You can still use the question and its hint.</small></div>;
  if (item.kind === 'image') return <button type="button" className="question-media__image" aria-label="Enlarge question image" disabled={!active} onClick={onEnlarge}><img src={src} alt={item.alt} onError={() => setError(true)} /><span>Enlarge image</span></button>;
  return src ? <video ref={video} className="question-media__video" src={src} controls playsInline preload="metadata" muted={muted} tabIndex={0} aria-label={item.alt}
    onPlay={() => { if (!active) video.current?.pause(); else callback.current?.(true); }}
    onPause={() => callback.current?.(false)} onEnded={() => callback.current?.(false)}
    onVolumeChange={() => { if (muted && video.current) video.current.muted = true; }}
    onError={() => { setError(true); callback.current?.(false); }} /> : <p role="status">Loading video…</p>;
}
