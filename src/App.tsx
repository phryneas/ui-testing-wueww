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
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { useQuery, useMutation } from "urql";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import * as yup from "yup";

const addTodoMutation = `
mutation ($title: String!, $description: String!) {
  createTask(input: {task: {title: $title, description: $description}}) {
    task {
      id
      title
      done
      description
    }
  }
}
`;
type AddTodoMutationResult = { task: Task };
type AddTodoMutationArgs = Pick<Task, "title" | "description">;

const validationSchema = yup.object({
  title: yup.string().min(3),
  description: yup.string().min(3),
});

function AddTodoSpace() {
  const [{ error }, add] = useMutation<
    AddTodoMutationResult,
    AddTodoMutationArgs
  >(addTodoMutation);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema,
    async onSubmit(values, helpers) {
      console.log(values);
      const result = await add(values);
      if (!result.error) {
        helpers.resetForm();
      }
    },
  });

  return (
    <Paper>
      {error && (
        <Alert severity="error">
          Something went horribly wrong! Please try again later.
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid>
          <TextField
            inputProps={formik.getFieldProps("title")}
            error={!!formik.errors["title"]}
            helperText={formik.errors["title"]}
            label="Titel"
            fullWidth
          />
          <TextField
            inputProps={formik.getFieldProps("description")}
            error={!!formik.errors["description"]}
            helperText={formik.errors["description"]}
            label="Beschreibung"
            fullWidth
          />
          <Button color="primary" fullWidth variant="outlined" type="submit">
            Hinzufügen
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}

const refetchTodosCtx = { additionalTypenames: ["Task"] };

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

type AllTasksQueryResult = { allTasks: { nodes: Task[] } };

const allTasksQuery = `
query {
  allTasks {
    nodes { done, description, id, title }
  }  
}
`;

function ListTodoSpace() {
  const [res] = useQuery<AllTasksQueryResult>({
    query: allTasksQuery,
    context: refetchTodosCtx,
  });
  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;
  return (
    <>
      {res.data?.allTasks.nodes.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </>
  );
}

const updateTodoStatusMutation = `
mutation  ($id: Int!, $done: Boolean!) { 
  updateTaskById(input: {taskPatch: {done: $done}, id: $id}) {
  task {
    id
    done
  }
}}`;

type UpdateTodoStatusArgs = { id: number; done: boolean };

const deleteTodoMutation = `
mutation  ($id: Int!) { 
  deleteTaskById(input: { id: $id } ) {
    deletedTaskId
  }
}`;

type DeleteTodoArgs = { id: number };

function TaskCard(props: { task: Task }) {
  const { id, title, description, done } = props.task;
  const [{ error: toggleDoneError }, updateTodo] = useMutation<
    {},
    UpdateTodoStatusArgs
  >(updateTodoStatusMutation);
  const [{ error: deleteError }, deleteTodo] = useMutation<{}, DeleteTodoArgs>(
    deleteTodoMutation
  );

  return (
    <Card raised>
      <CardHeader
        title={title}
        avatar={
          <Button
            startIcon={done ? <CheckCircleOutlineIcon /> : <CircleUnchecked />}
            size="small"
            color="primary"
            onClick={() => updateTodo({ id, done: !done })}
          />
        }
        action={
          <Button
            startIcon={<HighlightOffIcon />}
            size="small"
            color="primary"
            onClick={() => deleteTodo({ id }, refetchTodosCtx)}
          />
        }
      />
      <CardContent>{description}</CardContent>
      <CardActions>
        {(toggleDoneError || deleteError) && (
          <Alert severity="error">
            Something went horribly wrong! Please try again later.
          </Alert>
        )}
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
