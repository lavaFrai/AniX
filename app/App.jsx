import { Navbar } from "./components/Navbar/Navbar";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export const App = (props) => {
  return (
    <body className={`${inter.className} overflow-x-hidden`}>
      <Navbar />
      {props.children}
    </body>
  );
}
