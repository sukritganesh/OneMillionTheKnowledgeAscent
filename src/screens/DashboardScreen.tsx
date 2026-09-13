import { Icon } from '../components/Icon';
import type { ActiveIdentity } from '../app/types';
import type { GameRunState } from '../game';
import { BrandMark } from '../components/BrandMark';
import { formatMoney, formatRelativeDate } from '../utils/format';

interface DashboardScreenProps {
  questionCount: number;
  identity: ActiveIdentity;
  savedRun: GameRunState | null;
  saveOwnerName: string | null;
  ownsSave: boolean;
  runCount: number;
  setWins: number;
  uniqueSeen: number;
  onContinue: () => void;
  onNewGame: () => void;
  onStatistics: () => void;
  onHistory: () => void;
  onSets: () => void;
  onContent: () => void;
  onSettings: () => void;
  onHelp: () => void;
  onSwitchProfile: () => void;
  onFullscreen: () => void;
}

export function DashboardScreen(props: DashboardScreenProps) {
  const name = props.identity.kind === 'profile' ? props.identity.profile.displayName : 'Guest';
  const stats = props.identity.kind === 'profile' ? props.identity.profile.statistics : null;
  return (
    <main className="screen dashboard-screen" aria-labelledby="dashboard-heading">
      <header className="utility-bar">
        <BrandMark compact />
        <div className="utility-divider" />
        <div><div className="utility-label">Active player</div><div className="utility-value">{name}</div></div>
        <div className="utility-bar__spacer" />
        <button className="icon-button" onClick={props.onFullscreen} type="button" aria-label="Toggle fullscreen"><Icon name="expand" /></button>
        <button className="icon-button" onClick={props.onSettings} type="button" aria-label="Settings"><Icon name="settings" /></button>
        <button className="icon-button" onClick={props.onHelp} type="button" aria-label="Help"><Icon name="help" /></button>
      </header>
      <div className="dashboard-body">
        <section className="dashboard-welcome">

          <h1 id="dashboard-heading">{props.identity.kind === 'guest' ? 'Ready to play?' : `Welcome back, ${name}.`}</h1>
          <p>{props.identity.kind === 'guest' ? 'Playing as guest. Create a profile from the player screen to keep your own stats.' : '15 questions stand between you and a million.'}</p>
          {props.ownsSave && props.savedRun ? (
            <button className="continue-panel" type="button" onClick={props.onContinue}>
              <span className="continue-panel__signal" aria-hidden="true" />
              <span className="continue-panel__copy"><small>Saved game</small><strong>Question {props.savedRun.currentQuestionIndex + 1} of 15</strong><span>{props.savedRun.mode.kind === 'fresh-mix' ? 'Fresh Mix' : props.savedRun.mode.setTitle} · {formatMoney(props.savedRun.currentWinnings)} in current winnings · started {formatRelativeDate(props.savedRun.createdAtMs)}</span></span>
              <span className="continue-panel__action">Continue →</span>
            </button>
          ) : (
            <button className="new-run-panel" type="button" onClick={props.onNewGame}>
              <span><small>15 questions · two lifelines</small><strong>New game</strong><em>Mix things up or choose a question set.</em></span><b>→</b>
            </button>
          )}
          {!props.ownsSave && props.savedRun && <div className="notice"><span>◇</span><div><strong>{props.saveOwnerName ?? 'Another player'} has a saved game.</strong><br />Beginning a new game will replace their question {props.savedRun.currentQuestionIndex + 1} game.</div></div>}
          {props.ownsSave && <button type="button" className="secondary-button dashboard-new-button" onClick={props.onNewGame}>Start a different game</button>}
        </section>
        <aside className="dashboard-stats panel">
          <div className="dashboard-stats__heading"><span className="kicker">Your stats</span><strong>{props.identity.kind === 'guest' ? 'Guest' : 'All time'}</strong></div>
          <div className="dashboard-stat"><span>Personal best</span><strong>{formatMoney(stats?.highestPrize ?? 0)}</strong></div>
          <div className="dashboard-stat"><span>Games played</span><strong>{props.runCount}</strong></div>
          <div className="dashboard-stat"><span>Million-dollar wins</span><strong>{stats?.millionaireWins ?? props.setWins}</strong></div>
          <div className="dashboard-stat"><span>Questions seen</span><strong>{props.uniqueSeen}<small> / {props.questionCount}</small></strong></div>
        </aside>
        <nav className="dashboard-nav" aria-label="Dashboard destinations">
          <button type="button" onClick={props.onStatistics}><Icon name="stats" /><strong>Statistics</strong><small>Scores and accuracy</small></button>
          <button type="button" onClick={props.onHistory}><Icon name="history" /><strong>Past games</strong><small>Review your answers</small></button>
          <button type="button" onClick={props.onSets}><Icon name="packs" /><strong>Set library</strong><small>Browse and organize sets</small></button>
          <button type="button" onClick={props.onContent}><Icon name="packs" /><strong>Question packs</strong><small>Add and manage questions</small></button>
          <button type="button" onClick={props.onSettings}><Icon name="settings" /><strong>Settings</strong><small>Sound, display, and backups</small></button>
          <button type="button" onClick={props.onSwitchProfile}><Icon name="switch" /><strong>Switch player</strong><small>Choose a different player</small></button>
        </nav>
      </div>
    </main>
  );
}
