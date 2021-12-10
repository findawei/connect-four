import { useEffect, useReducer, useState } from "react";
import { Row } from "./Row";
import {
  Grid,
  Button,
  Typography,
  Box,
  Modal,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { checkForWin, deepCloneBoard, generateNewBoard } from "../utils";

import CircleIcon from "@mui/icons-material/Circle";
import { yellow } from "@mui/material/colors";

const gameReducer = (state, action) => {
  switch (action.type) {
    case "resetGame":
      return {
        ...initialGameState,
        board: action.board,
      };
    case "newGame":
      return {
        ...state,
        gameOver: false,
        message: "",
        board: action.board,
      };
    case "setPlayers":
      return {
        ...initialGameState,
        player1: action.player1,
        player2: action.player2,
        side: action.side,
      };
    case "togglePlayer":
      return {
        ...state,
        currentPlayer: action.nextPlayer,
        board: action.board,
      };
    case "endGame":
      return {
        ...state,
        gameOver: true,
        message: action.message,
        board: action.board,
        player1: action.player1,
        player2: action.player2,
      };
    case "updateMessage":
      return {
        ...state,
        message: action.message,
      };
    default:
      throw Error(`Action "${action.type}" is not a valid action.`);
  }
};
const initialGameState = {
  player1: "",
  player2: "",
  currentPlayer: 1,
  board: [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ],
  gameOver: false,
  message: "",
  side: "",
};

const Board = () => {
  const [gameState, dispatchGameState] = useReducer(
    gameReducer,
    initialGameState
  );

  const tossCoin = () => {
    const landedOn = Math.round(Math.random());

    let player1;
    let player2;
    let side = landedOn;

    if (landedOn === 1) {
      player1 = 1;
      player2 = 2;
    } else {
      player1 = 2;
      player2 = 1;
    }
    dispatchGameState({
      type: "setPlayers",
      player1,
      player2,
      side,
    });
  };

  const [player1Color, setPickColor] = useState("red");

  const handleColor = (event, newColor) => {
    setPickColor(newColor);
  };

  // triggered when a user clicks a cell
  const play = (c) => {
    if (!gameState.gameOver) {
      let board = deepCloneBoard(gameState.board);
      //check if cell is taken by starting at the bottom row and working up
      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = gameState.currentPlayer;
          break;
        }
      }

      // Check status of board
      let result = checkForWin(board);
      if (result === gameState.player1) {
        let player1 = 2;
        let player2 = 1;
        dispatchGameState({
          type: "endGame",
          message: "Player 1 wins! 🎉",
          board,
          player1,
          player2,
        });
      } else if (result === gameState.player2) {
        let player1 = 1;
        let player2 = 2;
        dispatchGameState({
          type: "endGame",
          message: "Player 2 wins! 🎉",
          board,
          player1,
          player2,
        });
      } else if (result === "draw") {
        dispatchGameState({
          type: "endGame",
          message: "Draw Game!",
          board,
        });
      } else {
        const nextPlayer =
          gameState.currentPlayer === gameState.player1
            ? gameState.player2
            : gameState.player1;
        dispatchGameState({
          type: "togglePlayer",
          nextPlayer,
          board,
        });
      }
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  function BasicModal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
      if (gameState.gameOver === true) {
        handleOpen();
      }
    }, []);

    return (
      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
              gutterBottom
            >
              {gameState.message}
            </Typography>
            <Box textAlign="center">
              <Button
                variant="contained"
                style={{ justifyContent: "center" }}
                onClick={() => {
                  dispatchGameState({
                    type: "newGame",
                    board: generateNewBoard(),
                  });
                }}
              >
                Play again
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <BasicModal />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Card sx={{ minWidth: 450 }} elevation={5}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Decide who goes first
              </Typography>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  onClick={tossCoin}
                  disabled={gameState.side !== ""}
                >
                  Flip Coin
                </Button>
              </Box>
              <br />
              <div>
                {gameState.player1 === "" ? (
                  <Typography gutterBottom align="center">
                    <b>Player ? goes first</b>
                  </Typography>
                ) : (
                  <div>
                    <Typography gutterBottom align="center">
                      <b>
                        Player {gameState.player1 === 1 ? "1" : "2"} goes first
                      </b>
                    </Typography>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ minWidth: 450 }} elevation={5}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Pick your color
              </Typography>
              <Box textAlign="center">
                <ToggleButtonGroup
                  value={player1Color}
                  exclusive
                  onChange={handleColor}
                  aria-label="text alignment"
                >
                  <ToggleButton value="red" aria-label="red">
                    <CircleIcon color="error" />
                  </ToggleButton>
                  <ToggleButton value="yellow" aria-label="yellow">
                    <CircleIcon sx={{ color: yellow[500] }} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <table>
            <tbody>
              {gameState.board.map((row, i) => (
                <Row
                  key={i}
                  row={row}
                  play={play}
                  player1Color={player1Color}
                />
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={6}>
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              dispatchGameState({
                type: "resetGame",
                board: generateNewBoard(),
              });
            }}
          >
            Reset Game
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Board;
