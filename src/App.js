import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import React from "react"
import Header from "./components/Header"

function App() {
  const title = "something new"
  console.log("demo")
  return (
    <Box>
      <Header />
      <Typography color="primary">{title}</Typography>
    </Box>
  )
}

export default App
