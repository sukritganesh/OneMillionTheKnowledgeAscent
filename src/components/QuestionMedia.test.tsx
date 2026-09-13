import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { QuestionMedia } from './QuestionMedia';
import type { QuestionMedia as Media } from '../media/questionMedia';

const first: Media = { kind: 'image', src: `/question-media/${'a'.repeat(64)}.png`, mimeType: 'image/png', alt: 'A blue curve', credit: 'Hidden answer title', sourceUrl: 'https://example.org/source', license: 'CC0' };

describe('question media presentation', () => {
  afterEach(cleanup);
  it('hides credits until reveal and supports image navigation and enlargement', () => {
    const { rerender } = render(<QuestionMedia media={[first, { ...first, alt: 'A red curve', src: `/question-media/${'b'.repeat(64)}.png` }]} />);
    expect(screen.queryByText(/Hidden answer title/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge question image' }));
    expect(within(screen.getByRole('dialog')).getByAltText('A blue curve')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByAltText('A red curve')).toBeVisible();
    rerender(<QuestionMedia media={[first]} showCredits />);
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('rel', 'noopener noreferrer');
  });
  it('offers readable failure text without hiding the question', () => {
    render(<QuestionMedia media={[first]} />);
    fireEvent.error(screen.getByAltText(first.alt));
    expect(screen.getByRole('alert')).toHaveTextContent('Media couldn’t load');
    expect(screen.getByRole('alert')).toHaveTextContent(first.alt);
  });
});
