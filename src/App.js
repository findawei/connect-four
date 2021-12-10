import * as React from "react";
import Board from "./components/Board";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Typography variant="h3" textAlign="center" gutterBottom>
          <b>Connect 4</b>
        </Typography>
        <Board />
      </Container>
    </React.Fragment>
  );
}

export default App;
