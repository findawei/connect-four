import { makeStyles } from "@mui/styles";
import { Paper } from "@mui/material";

const useStyles = makeStyles({
  cellItem: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "white",
  },
  red: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "red",
  },
  yellow: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "yellow",
  },
});

export const Row = ({ row, play, player1Color }) => {
  return (
    <tr>
      {row.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          columnIndex={i}
          play={play}
          player1Color={player1Color}
        />
      ))}
    </tr>
  );
};

export const Cell = ({ value, columnIndex, play, player1Color }) => {
  const classes = useStyles();

  let color = "white";
  if (value === 1) {
    color = player1Color;
  } else if (value === 2) {
    color = player1Color === "red" ? "yellow" : "red";
  }

  return (
    <td>
      <Paper
        className={classes.cellItem}
        elevation={10}
        onClick={() => {
          play(columnIndex);
        }}
        justify="center"
        align="center"
      >
        <div className={classes[color]}></div>
      </Paper>
    </td>
  );
};
