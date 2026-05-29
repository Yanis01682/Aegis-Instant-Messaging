const terminalStatuses = new Set(['x_win', 'o_win', 'draw', 'cancelled'])

function getGameTitle(game, currentUserId) {
  if (!game) return '井字棋'
  if (game.status === 'pending') {
    return currentUserId === game.inviterId ? '等待好友应战' : '好友邀请你对弈'
  }
  if (game.status === 'active') {
    return game.turnUserId === currentUserId ? '轮到你落子' : '等待对方落子'
  }
  if (game.status === 'draw') return '平局'
  if (game.status === 'cancelled') return '棋局已取消'
  return game.winnerUserId === currentUserId ? '你赢了' : '对方获胜'
}

function getResultText(game, currentUserId) {
  if (!game) return ''
  if (game.status === 'draw') return '双方平局，棋盘已封存。'
  if (game.status === 'cancelled') return '这局对弈已取消。'
  const winnerName = game.winnerUserId === game.xUserId ? game.xName : game.oName
  const loserName = game.winnerUserId === game.xUserId ? game.oName : game.xName
  if (game.winnerUserId === currentUserId) return `结算：你击败了 ${loserName || '对方'}。`
  return `结算：${winnerName || '对方'} 获胜，${loserName || '你'} 落败。`
}

function TicTacToeModal({
  game,
  currentUserId,
  visible,
  onClose,
  onAccept,
  onMove,
  onResign,
  onInviteAgain,
}) {
  if (!visible || !game) return null

  const currentMark = currentUserId === game.xUserId ? 'X' : 'O'
  const isInvitee = currentUserId === game.inviteeId
  const canAccept = game.status === 'pending' && isInvitee
  const canMove = game.status === 'active' && game.turnUserId === currentUserId
  const isTerminal = terminalStatuses.has(game.status)
  const board = game.board || Array(9).fill('.')

  const handleBackdropClick = () => {
    if (!isTerminal) onClose()
  }

  return (
    <div className="ttt-overlay" onClick={handleBackdropClick}>
      <div className="ttt-modal" onClick={(event) => event.stopPropagation()}>
        <div className="ttt-header">
          <div>
            <p className="ttt-kicker">Aegis 井字棋</p>
            <h3>{getGameTitle(game, currentUserId)}</h3>
          </div>
          <button className="ttt-close" type="button" onClick={onClose}>×</button>
        </div>

        <div className="ttt-players">
          <div className={`ttt-player ${currentMark === 'X' ? 'self' : ''}`}>
            <span className="ttt-mark">X</span>
            <span>{game.xName}</span>
          </div>
          <div className={`ttt-player ${currentMark === 'O' ? 'self' : ''}`}>
            <span className="ttt-mark">O</span>
            <span>{game.oName}</span>
          </div>
        </div>

        <div className="ttt-board" aria-label="井字棋棋盘">
          {board.map((cell, index) => (
            <button
              key={index}
              type="button"
              className={`ttt-cell ${cell !== '.' ? 'filled' : ''}`}
              disabled={!canMove || cell !== '.'}
              onClick={() => onMove(game.id, index)}
            >
              {cell === '.' ? '' : cell}
            </button>
          ))}
        </div>

        {isTerminal && (
          <div className="ttt-result">
            <strong>{getGameTitle(game, currentUserId)}</strong>
            <span>{getResultText(game, currentUserId)}</span>
          </div>
        )}

        <div className="ttt-footer">
          {game.status === 'pending' && !canAccept && <span>邀请已发出，对方同意后开局。</span>}
          {game.status === 'active' && <span>你执 {currentMark}，{canMove ? '选择一格落子。' : '请等对方行动。'}</span>}
          {isTerminal && <span>结算已生成，确认后可退出棋局。</span>}
          <div className="ttt-actions">
            {canAccept && <button type="button" className="ttt-primary" onClick={() => onAccept(game.id)}>接受对局</button>}
            {isTerminal && <button type="button" className="ttt-primary" onClick={onInviteAgain}>再邀请</button>}
            {isTerminal && <button type="button" className="ttt-secondary" onClick={onClose}>退出</button>}
            {!isTerminal && <button type="button" className="ttt-danger" onClick={() => onResign(game.id)}>{game.status === 'pending' ? '取消' : '退出棋局'}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicTacToeModal
