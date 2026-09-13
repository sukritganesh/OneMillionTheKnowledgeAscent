import { useRef } from 'react';
import type { AudioPreferences } from '../audio/types';
import { SettingsPanel } from '../components/SettingsPanel';

interface SettingsScreenProps {
  settings: AudioPreferences;
  voices: readonly SpeechSynthesisVoice[];
  playerIsProfile: boolean;
  offlineReady: boolean;
  online: boolean;
  updateAvailable: boolean;
  storageMessage: string | null;
  onChange: (settings: AudioPreferences) => void;
  onBack: () => void;
  onFullscreen: () => void;
  onApplyUpdate: () => void;
  onExportBackup: () => void;
  onRestoreBackup: (file: File) => void;
  onExportProfile: () => void;
  onImportProfile: (file: File) => void;
  onResetAll: () => void;
}

export function SettingsScreen(props: SettingsScreenProps) {
  const restoreRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);
  return (
    <main className="screen settings-screen" aria-labelledby="settings-title">
      <header className="utility-bar"><div><div className="utility-label">One Million</div><div className="utility-value">Settings</div></div><div className="utility-bar__spacer" /><button type="button" className="quiet-button" onClick={props.onBack}>← Back</button></header>
      <div className="settings-body screen-scroll">

        <h1 id="settings-title">Settings</h1>
        <p className="hero-subtitle">Choose your sound and display preferences. These apply to everyone playing in this browser.</p>
        <SettingsPanel settings={props.settings} voices={props.voices} onChange={props.onChange} />
        <section className="settings-data panel">
          <div className="settings-data__intro"><span className="kicker">Your saved data</span><h2>Backups and profiles</h2><p>Download a backup to keep a copy of your profiles, past games, settings, saved game, and question packs.</p></div>
          <div className="data-actions">
            <button type="button" onClick={props.onExportBackup}><span>⇩</span><strong>Export full backup</strong><small>Everything saved in this browser</small></button>
            <button type="button" onClick={() => restoreRef.current?.click()}><span>⇧</span><strong>Restore full backup</strong><small>Replace your data from a backup</small></button>
            <button type="button" onClick={props.onExportProfile} disabled={!props.playerIsProfile}><span>◉</span><strong>Export profile</strong><small>One player's stats and past games</small></button>
            <button type="button" onClick={() => profileRef.current?.click()}><span>⊕</span><strong>Import profile</strong><small>Add a player from a file</small></button>
            <button type="button" onClick={props.onFullscreen}><span>⛶</span><strong>Toggle fullscreen</strong><small>Switch between windowed and fullscreen</small></button>
            <button type="button" className="data-action--danger" onClick={props.onResetAll}><span>×</span><strong>Reset local data</strong><small>Delete everything in this browser</small></button>
          </div>
          <input ref={restoreRef} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.onRestoreBackup(file); event.currentTarget.value = ''; }} />
          <input ref={profileRef} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.onImportProfile(file); event.currentTarget.value = ''; }} />
        </section>
        <section className="system-status panel">
          <div><span className={`status-dot ${props.online ? '' : 'status-dot--offline'}`} /><p><strong>{props.online ? 'Connected' : 'Working offline'}</strong><small>Your progress stays in this browser.</small></p></div>
          <div><span className={`status-dot ${props.offlineReady ? '' : 'status-dot--offline'}`} /><p><strong>{props.offlineReady ? 'Ready to play offline' : 'Offline mode unavailable'}</strong><small>{props.offlineReady ? 'The game and built-in questions are saved for offline play.' : 'Offline play becomes available after the installed game finishes downloading.'}</small></p></div>
          <div><span className={`status-dot ${props.updateAvailable ? 'status-dot--offline' : ''}`} /><p><strong>{props.updateAvailable ? 'Update available' : 'Up to date'}</strong><small>{props.updateAvailable ? 'Restart the game to apply the update.' : 'You’re running the current version.'}</small></p>{props.updateAvailable && <button className="secondary-button" type="button" onClick={props.onApplyUpdate}>Apply Update</button>}</div>
        </section>
        {props.storageMessage && <div className="notice notice--info" role="status"><span>◇</span><div>{props.storageMessage}</div></div>}
        <p className="privacy-note">Your data stays in this browser. Clearing browser data removes it, so keep a backup of anything you want to save.</p>
      </div>
    </main>
  );
}
