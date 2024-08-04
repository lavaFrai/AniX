import dynamic from "next/dynamic";
import { LoginPage } from "#/pages/Login";

export const metadata = {
  title: "Авторизация",
  description: "Вход в аккаунт anixart",
}

const LoginDynamic = dynamic(() => Promise.resolve(LoginPage), {
  ssr: false,
});
export default function Login() {
  return <LoginDynamic />;
}
