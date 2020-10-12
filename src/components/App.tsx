import React from "react";
import { Container, CssBaseline, Grid, Typography } from "@material-ui/core";
import { AddTodoForm } from "./AddTodoForm";
import { TasksList } from "./TasksList";

function App() {
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Todo hinzufügen</Typography>
        </Grid>
        <Grid item xs={12}>
          <AddTodoForm />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Todos</Typography>
        </Grid>
        <Grid item xs={12}>
          <TasksList />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
