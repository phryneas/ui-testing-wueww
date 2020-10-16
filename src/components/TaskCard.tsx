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
  DeleteTasksVariables,
  UpdateTaskStatusVariables,
  deleteTaskMutation,
  refetchTasksCtx,
  updateTaskStatusMutation,
} from "./graphql";

export function TaskCard(props: { task: Task }) {
  const { id, title, description, done } = props.task;
  const [{ error: toggleDoneError }, updateTodo] = useMutation<
    {},
    UpdateTaskStatusVariables
  >(updateTaskStatusMutation);
  const [{ error: deleteError }, deleteTodo] = useMutation<
    {},
    DeleteTasksVariables
  >(deleteTaskMutation);

  return (
    <Card /* component="section" */>
      <CardHeader
        title={title}
        avatar={
          <Button
            // role="checkbox"
            // aria-checked={done}
            startIcon={done ? <CheckCircleOutlineIcon /> : <CircleUnchecked />}
            size="small"
            color="primary"
            onClick={() => updateTodo({ id, done: !done })}
          />
        }
        action={
          <Button
            startIcon={<HighlightOffIcon />}
            // aria-label="Task löschen"
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
