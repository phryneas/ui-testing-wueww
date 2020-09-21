import React from "react";
import "./App.css";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

function AddTodoSpace() {
  return (
    <Paper>
      <TextField label="Titel" fullWidth />
      <TextField label="Beschreibung" fullWidth />
      <Button color="primary" fullWidth variant="outlined">
        Hinzufügen
      </Button>
    </Paper>
  );
}

function ListTodoSpace() {
  return (
    <Card raised>
      <CardHeader title="Do That" />
      <CardContent>What Todo</CardContent>
      <CardActions>
        <Button
          startIcon={<CheckCircleOutlineIcon />}
          size="small"
          color="primary"
        />
      </CardActions>
    </Card>
  );
}

function App() {
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Typography>Todo hinzufügen</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AddTodoSpace />
        </Grid>
        <Grid item xs={12}>
          <Typography>Todos</Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ListTodoSpace />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
