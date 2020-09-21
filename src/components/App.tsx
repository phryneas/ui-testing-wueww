import React from "react";
import { Container, CssBaseline, Grid, Typography } from "@material-ui/core";
import { AddTodoForm } from "./AddTodoForm";
import { TasksList } from "./TasksList";

function App() {
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Typography>Todo hinzufügen</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AddTodoForm />
        </Grid>
        <Grid item xs={12}>
          <Typography>Todos</Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TasksList />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
