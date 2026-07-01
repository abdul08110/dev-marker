import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ProfileCard } from '@/components/ProfileCard';
import { useFluidPx } from '@/hooks/useFluidPx';

interface ProfilePictureProps {
  isDoubles: boolean;
  isTournament: boolean;
  profilePhoto: string | null;
  profilePhoto2?: string | null;
  frontPhoto?: string | null;
  backPhoto?: string | null;
}

export function ProfilePicture({
  isDoubles,
  isTournament,
  profilePhoto,
  profilePhoto2,
  frontPhoto,
  backPhoto,
}: ProfilePictureProps) {
  const profileSizeSingle = useFluidPx(0.17); // ≈119px at 1080p
  const profileSizeDoubles = useFluidPx(0.1); // ≈108px at 1080p

  if (isDoubles && profilePhoto2 !== undefined) {
    return (
      <div className="relative shrink-0 size-[min(16vh,16vw)]">
        <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
          <ProfileCard imageUrl={backPhoto ?? '/images/user-dummy-pic.jpg'} size={profileSizeDoubles} />
        </div>
        <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
          <ProfileCard imageUrl={frontPhoto ?? '/images/user-dummy-pic.jpg'} size={profileSizeDoubles} />
        </div>
      </div>
    );
  }

  if (isTournament) {
    return (
      <div className="rounded-full overflow-hidden">
        <ImageWithFallback
          className="object-cover size-[min(19vh,19vw)]"
          fallback="/images/user-dummy-pic.jpg"
          src={profilePhoto ?? ''}
        />
      </div>
    );
  }

  return <ProfileCard imageUrl={profilePhoto ?? '/images/user-dummy-pic.jpg'} size={profileSizeSingle} />;
}
