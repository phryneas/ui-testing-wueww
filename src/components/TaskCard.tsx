import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { useMutation } from "urql";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {
  Task,
  DeleteTodoVariables,
  UpdateTodoStatusVariables,
  deleteTodoMutation,
  refetchTasksCtx,
  updateTodoStatusMutation,
} from "./graphql";

export function TaskCard(props: { task: Task }) {
  const { id, title, description, done } = props.task;
  const [{ error: toggleDoneError }, updateTodo] = useMutation<
    {},
    UpdateTodoStatusVariables
  >(updateTodoStatusMutation);
  const [{ error: deleteError }, deleteTodo] = useMutation<
    {},
    DeleteTodoVariables
  >(deleteTodoMutation);

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
            onClick={() => deleteTodo({ id }, refetchTasksCtx)}
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
