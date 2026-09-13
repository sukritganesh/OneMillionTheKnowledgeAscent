import { Icon } from '../components/Icon';
import type { ProfileRecord } from '../data/types';
import type { GameRunState } from '../game';
import { BrandMark } from '../components/BrandMark';
import { formatMoney, formatRelativeDate } from '../utils/format';

interface TitleScreenProps {
  profiles: readonly ProfileRecord[];
  savedRun: GameRunState | null;
  saveOwnerName: string | null;
  offlineReady: boolean;
  online: boolean;
  onSelectProfile: (profile: ProfileRecord) => void;
  onGuest: () => void;
  onCreateProfile: () => void;
  onDeleteProfile: (profile: ProfileRecord) => void;
  onSettings: () => void;
  onHelp: () => void;
  onContent: () => void;
  onFullscreen: () => void;
}

export function TitleScreen(props: TitleScreenProps) {
  const atLimit = props.profiles.length >= 20;
  return (
    <main className="screen title-screen" aria-labelledby="title-heading">
      <header className="utility-bar">
        <div className="utility-status"><i className={`status-dot ${props.online ? '' : 'status-dot--offline'}`} />{props.offlineReady ? 'Offline ready' : props.online ? 'Playing in your browser' : 'Offline mode unavailable'}</div>
        <div className="utility-bar__spacer" />
        <button className="icon-button" type="button" aria-label="Question packs" title="Question packs" onClick={props.onContent}><Icon name="packs" /></button>
        <button className="icon-button" type="button" aria-label="Enter fullscreen" title="Fullscreen" onClick={props.onFullscreen}><Icon name="expand" /></button>
        <button className="icon-button" type="button" aria-label="Settings" title="Settings" onClick={props.onSettings}><Icon name="settings" /></button>
        <button className="icon-button" type="button" aria-label="Help" title="Help" onClick={props.onHelp}><Icon name="help" /></button>
      </header>
      <div className="title-screen__body">
        <section className="title-hero">
          <BrandMark />
          <h1 id="title-heading" className="sr-only">One Million — The Knowledge Ascent</h1>
          <p>15 questions. How far can you go?</p>
          {props.savedRun && (
            <div className="save-beacon">
              <span className="save-beacon__pulse" aria-hidden="true" />
              <div><strong>Saved game</strong><span>{props.saveOwnerName ?? 'Guest'} · Question {props.savedRun.currentQuestionIndex + 1} · {formatMoney(props.savedRun.currentWinnings)}</span></div>
            </div>
          )}
        </section>
        <section className="profile-rack" aria-labelledby="select-player-title">
          <div className="profile-rack__heading">
            <div><h2 id="select-player-title">Who's playing?</h2></div>
            {atLimit && <span>20 profiles</span>}
          </div>
          <div className="profile-grid">
            {props.profiles.map((profile, index) => {
              const ownsSave = props.savedRun?.owner.kind === 'profile' && props.savedRun.owner.profileId === profile.id;
              return (
                <article className={`profile-card ${ownsSave ? 'profile-card--saved' : ''}`} key={profile.id}>
                  <button className="profile-card__select" type="button" onClick={() => props.onSelectProfile(profile)} aria-label={`Play as ${profile.displayName}`}>
                    <span className="profile-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="profile-card__avatar">{profile.displayName.trim().charAt(0).toUpperCase()}</span>
                    <span className="profile-card__name">{profile.displayName}</span>
                    <span className="profile-card__meta">Best {formatMoney(profile.statistics.highestPrize)} · {profile.statistics.gamesPlayed} run{profile.statistics.gamesPlayed === 1 ? '' : 's'}</span>
                    <span className="profile-card__date">{formatRelativeDate(profile.lastPlayedAt)}</span>
                    {ownsSave && <span className="profile-card__badge">Saved run</span>}
                  </button>
                  <button className="profile-card__delete" type="button" onClick={() => props.onDeleteProfile(profile)} aria-label={`Delete ${profile.displayName}`} title="Delete profile">×</button>
                </article>
              );
            })}
            {!atLimit && <button className="profile-add" type="button" onClick={props.onCreateProfile}><Icon name="add" /><strong>Create profile</strong><small>Keep your scores and past games</small></button>}
            <button className="profile-add profile-add--guest" type="button" onClick={props.onGuest}><Icon name="user" /><strong>Play as guest</strong><small>No profile needed</small></button>
          </div>
          {atLimit && <p className="profile-limit">You have 20 profiles. Remove one to add another, or play as a guest.</p>}
        </section>
      </div>
      <footer className="title-footer"><span>Progress is saved in this browser.</span><span>525 questions · 15 sets</span></footer>
    </main>
  );
}
