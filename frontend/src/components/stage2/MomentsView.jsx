import { useEffect, useState } from 'react'

function MomentAvatar({ avatar, name, className = '' }) {
  const label = (name || 'A').slice(0, 1).toUpperCase()
  const isImage = typeof avatar === 'string' && (avatar.startsWith('data:image') || avatar.startsWith('/'))
  if (isImage) {
    return <div className={`moment-avatar ${className}`} style={{ backgroundImage: `url(${avatar})` }} />
  }
  return <div className={`moment-avatar ${className}`}>{label}</div>
}

function formatMomentTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function MomentsView({
  currentUser,
  moments,
  loading,
  draft,
  setDraft,
  commentDrafts,
  setCommentDrafts,
  onRefresh,
  onCreate,
  onToggleLike,
  onComment,
}) {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    onRefresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const submitPost = async () => {
    await onCreate(draft, imageUrl)
    setImageUrl('')
  }

  const updateComment = (postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }))
  }

  return (
    <section className="moments-view">
      <header className="moments-hero">
        <div>
          <p>回响庭院</p>
          <h2>把今日的见闻留给同行者</h2>
        </div>
        <button type="button" onClick={onRefresh} disabled={loading}>
          {loading ? '巡查中' : '刷新'}
        </button>
      </header>

      <div className="moment-composer-card">
        <div className="moment-composer-top">
          <MomentAvatar avatar={currentUser?.avatar} name={currentUser?.nickname || currentUser?.username} />
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="写下这一刻的誓约、巡夜见闻或想让好友看见的话"
            maxLength={1000}
          />
        </div>
        <div className="moment-composer-tools">
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="可选：图片链接"
          />
          <span>{draft.trim().length}/1000</span>
          <button type="button" onClick={submitPost} disabled={!draft.trim()}>
            发布
          </button>
        </div>
      </div>

      <div className="moments-feed">
        {loading && moments.length === 0 ? (
          <div className="moments-empty">正在整理庭院回响...</div>
        ) : moments.length === 0 ? (
          <div className="moments-empty">还没有回响，先留下第一条见闻吧</div>
        ) : (
          moments.map((post) => {
            const commentText = commentDrafts[post.id] || ''
            return (
              <article key={post.id} className="moment-post">
                <MomentAvatar avatar={post.author.avatar} name={post.author.name} />
                <div className="moment-post-body">
                  <div className="moment-post-head">
                    <strong>{post.author.name}</strong>
                    <time>{formatMomentTime(post.createdAt)}</time>
                  </div>
                  <p className="moment-content">{post.content}</p>
                  {post.imageUrl && <img className="moment-image" src={post.imageUrl} alt="" />}
                  <div className="moment-actions">
                    <button type="button" className={post.likedByMe ? 'active' : ''} onClick={() => onToggleLike(post.id)}>
                      {post.likedByMe ? '已共鸣' : '共鸣'} {post.likes.length > 0 ? post.likes.length : ''}
                    </button>
                  </div>
                  {(post.likes.length > 0 || post.comments.length > 0) && (
                    <div className="moment-social">
                      {post.likes.length > 0 && (
                        <div className="moment-likes">
                          <span>共鸣</span>
                          {post.likes.map((like) => like.name).join('、')}
                        </div>
                      )}
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="moment-comment">
                          <strong>{comment.author.name}</strong>
                          <span>{comment.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="moment-comment-box">
                    <input
                      value={commentText}
                      onChange={(event) => updateComment(post.id, event.target.value)}
                      placeholder="回应一句"
                      maxLength={500}
                    />
                    <button type="button" onClick={() => onComment(post.id, commentText)} disabled={!commentText.trim()}>
                      回应
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default MomentsView
