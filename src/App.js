import React, { useEffect } from "react";
import Header from "./components/Header";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function App() {
	const title = "something new";
	return (
		<Box>
			<Header />
			<Typography color="primary">{title}</Typography>
		</Box>
	);
}

export default App;
