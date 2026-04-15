import type { Poll } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '../..';
import { parseDiscordEmoji } from '../../../utils/utils';

export default async function DiscordPoll({ poll, context }: { poll: Poll; context: RenderMessageContext }) {
  if (!poll) return null;

  const totalVotes = poll.answers.reduce((acc, answer) => acc + (answer.voteCount || 0), 0);
  const isFinalized = poll.resultsFinalized;
  const answers = await Promise.all(
    Array.from(poll.answers.values()).map(async (answer) => ({
      ...answer,
      emoji: answer.emoji,
      emojiUrl: answer.emoji?.id
        ? ((await context.callbacks.resolveTranscriptAssetUrl({
            kind: 'emoji',
            url: parseDiscordEmoji({
              id: answer.emoji.id,
              name: answer.emoji.name ?? '',
              animated: answer.emoji.animated ?? false,
            }),
          })) ??
          parseDiscordEmoji({
            id: answer.emoji.id,
            name: answer.emoji.name ?? '',
            animated: answer.emoji.animated ?? false,
          }))
        : undefined,
    }))
  );

  // Calculate time remaining
  const getTimeLeft = () => {
    if (!poll.expiresAt) return null;
    const now = new Date();
    const diff = poll.expiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Poll ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d left`;
    return `${hours}h left`;
  };

  const timeLeft = getTimeLeft();

  return (
    <div className="discord-poll" slot="attachments">
      {/* Header */}
      <div className="discord-poll-header">
        <div className="discord-poll-question">
          <strong>{poll.question.text}</strong>
        </div>
        <div className="discord-poll-subtitle">
          {poll.allowMultiselect ? 'Select one or more answers' : 'Select one answer'}
        </div>
      </div>

      {/* Answers */}
      <div className="discord-poll-answers">
        {answers.map((answer, i) => {
          const voteCount = answer.voteCount || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

          return (
            <div className={`discord-poll-answer ${isFinalized ? 'finalized' : ''}`} key={i}>
              {isFinalized && <div className="discord-poll-bar" style={{ width: `${percentage}%` }}></div>}
              <div className="discord-poll-content">
                {answer.emoji ? (
                  <span className="discord-poll-emoji">
                    {answer.emojiUrl ? <img src={answer.emojiUrl} alt={answer.emoji.name ?? ''} /> : answer.emoji.name}
                  </span>
                ) : null}
                <span className="discord-poll-text">{answer.text}</span>
                {isFinalized ? (
                  <span className="discord-poll-votes">
                    {percentage}% ({voteCount})
                  </span>
                ) : (
                  <span className="discord-poll-radio">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8.5" fill="none" stroke="#4f545c" strokeWidth="2" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="discord-poll-footer">
        <span className="discord-poll-footer-left">
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          {timeLeft ? ` • ${timeLeft}` : ''}
        </span>
        <span className="discord-poll-footer-right">
          {!isFinalized && (
            <>
              <span className="discord-poll-show-results">Show results</span>
              <span className="discord-poll-vote-btn">Vote</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
