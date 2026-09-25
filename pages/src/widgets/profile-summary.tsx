import { Avatar, CardDescription, CardTitle } from '@sypra-ui/ui';
import type { Profile } from './settings-types';
export function ProfileSummary({
  profile,
  showAvatar = true,
}: {
  profile: Profile;
  showAvatar?: boolean;
}) {
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="mb-5 flex items-center gap-3">
      {showAvatar && <Avatar src={profile.avatar} alt={fullName} />}
      <div className="min-w-0">
        <CardTitle>{fullName || 'Your profile'}</CardTitle>
        <CardDescription>{profile.email}</CardDescription>
      </div>
    </div>
  );
}
