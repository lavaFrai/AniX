import dynamic from "next/dynamic";
import { LoginPage } from "#/pages/Login";

const LoginDynamic = dynamic(() => Promise.resolve(LoginPage), {
  ssr: false,
});
export default function Login() {
  return <LoginDynamic />;
}
