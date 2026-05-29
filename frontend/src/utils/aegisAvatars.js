export const AEGIS_DEFAULT_USER_AVATAR = '/aegis-avatar-user.png'
export const AEGIS_DEFAULT_GROUP_AVATAR = '/aegis-avatar-group.png'

export const AEGIS_AVATAR_PRESETS = [
  { id: 'warden', label: '圣殿守卫', value: AEGIS_DEFAULT_USER_AVATAR },
  { id: 'sword', label: '银刃骑士', value: '/aegis-avatar-sword.png' },
  { id: 'templar', label: '圣殿誓约', value: '/aegis-avatar-templar.png' },
  { id: 'ranger', label: '月林游侠', value: '/aegis-avatar-ranger.svg' },
]

export function resolveAegisAvatar(value, fallback = AEGIS_DEFAULT_USER_AVATAR) {
  if (!value || value === '/default-avatar.png') return fallback
  return value
}
