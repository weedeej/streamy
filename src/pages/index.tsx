import { useTheme } from "@mui/material"


export default function Home() {
  const theme = useTheme();
  console.log(theme);
  return <>home</>
}