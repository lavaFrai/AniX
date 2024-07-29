import { ProfilePage } from "#/pages/Profile";
import { fetchDataViaGet } from "#/api/utils";

export async function generateMetadata({ params }) {
  const id:string = params.id;
  const profile: any = await fetchDataViaGet(`https://api.anixart.tv/profile/${id}`);

  return {
    title: "Профиль " + profile.profile.login,
  };
}

export default async function Profile({ params }) {
  const id: string = params.id;
  return <ProfilePage id={id} />;
}
