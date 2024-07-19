import { ProfilePage } from "@/app/pages/Profile";
import { fetchDataViaGet } from "@/app/api/utils";
import { ENDPOINTS } from "@/app/api/config";

export async function generateMetadata({ params }) {
  const id = params.id
  const profile = await fetchDataViaGet(`${ENDPOINTS.user.profile}/${id}`);

  return {
    title: "Профиль " + profile.profile.login,
  };
}

export default async function Search({ params }) {
  const id = params.id
  return <ProfilePage id={id} />;
}
