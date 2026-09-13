import type { NewGameConfig } from '../app/types';
import type { GameRunState } from '../game';
import { PRIZE_LADDER } from '../game';
import { BrandMark } from '../components/BrandMark';
import { formatMoney } from '../utils/format';

interface PreGameScreenProps {
  playerName: string;
  config: NewGameConfig;
  modeTitle: string;
  freshness: number;
  audioLabel: string;
  existingSave: GameRunState | null;
  existingSaveOwner: string | null;
  busy: boolean;
  error: string | null;
  onBegin: () => void;
  onBack: () => void;
}

export function PreGameScreen(props: PreGameScreenProps) {
  return (
    <main className="screen pregame-screen" aria-labelledby="pregame-heading">
      <header className="utility-bar"><BrandMark compact /><div className="utility-divider" /><div><div className="utility-label">Final review</div><div className="utility-value">New game</div></div><div className="utility-bar__spacer" /><button type="button" className="quiet-button" onClick={props.onBack} disabled={props.busy}>← Edit options</button></header>
      <div className="pregame-layout">
        <section className="pregame-brief">

          <h1 id="pregame-heading">Ready to play?</h1>
          <p>15 questions, two lifelines, and $1,000,000 at the top.</p>
          <div className="pregame-facts">
            <div><span>Player</span><strong>{props.playerName}</strong></div>
            <div><span>Mode</span><strong>{props.modeTitle}</strong></div>
            <div><span>Questions</span><strong>{props.config.mode === 'fresh-mix' ? `${props.freshness} new questions` : 'A set of 15 questions'}</strong></div>
            <div><span>Audio</span><strong>{props.audioLabel}</strong></div>
          </div>
          <div className="rules-strip">
            <article><span>◇</span><div><strong>Hint</strong><p>Reveal a clue. You can use it once per game.</p></div></article>
            <article><span>◷</span><div><strong>Phone a Friend</strong><p>Take 60 seconds to call someone you know.</p></div></article>
            <article><span>↗</span><div><strong>Walk Away</strong><p>Keep the full value of your last correct answer.</p></div></article>
          </div>
          {props.existingSave && <div className="notice notice--error"><span>⚠</span><div><strong>This will replace {props.existingSaveOwner ?? 'Guest'}’s saved game.</strong><br />Their game at question {props.existingSave.currentQuestionIndex + 1}, with {formatMoney(props.existingSave.currentWinnings)} in current winnings, will be lost when you begin.</div></div>}
          {props.error && <div className="notice notice--error" role="alert"><span>!</span><div><strong>Couldn't start the game</strong><br />{props.error} Your saved game is still available.</div></div>}
          <div className="button-row"><button type="button" className="primary-button begin-button" onClick={props.onBegin} disabled={props.busy}>{props.busy ? 'Preparing your game…' : props.existingSave ? 'Replace save and begin' : 'Begin game'}</button><button type="button" className="secondary-button" onClick={props.onBack} disabled={props.busy}>Edit options</button></div>
        </section>
        <aside className="pregame-ladder panel">
          <span className="kicker">Prize ladder</span>
          <ol>{[...PRIZE_LADDER].reverse().map((prize, reverseIndex) => { const level = 15 - reverseIndex; const checkpoint = level === 5 || level === 10; return <li key={level} className={`${checkpoint ? 'checkpoint' : ''} ${level === 15 ? 'million' : ''}`}><span>{String(level).padStart(2, '0')}</span><strong>{formatMoney(prize)}</strong>{checkpoint && <em>Guaranteed</em>}</li>; })}</ol>
          <p>Answer question 5 correctly to guarantee $1,000, or question 10 to guarantee $32,000.</p>
        </aside>
      </div>
    </main>
  );
}
