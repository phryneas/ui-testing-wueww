import React from "react";
import { Button, Grid, makeStyles, Paper, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import { useMutation } from "urql";
import * as yup from "yup";
import {
  AddTaskMutationResult,
  AddTaskMutationVariables,
  addTaskMutation,
} from "./graphql";

const validationSchema = yup.object({
  title: yup.string().min(3).required(),
  description: yup.string().min(3).required(),
});

const useStyle = makeStyles((theme) => ({
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export function AddTodoForm() {
  const [{ error }, add] = useMutation<
    AddTaskMutationResult,
    AddTaskMutationVariables
  >(addTaskMutation);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema,
    async onSubmit(values, helpers) {
      const result = await add(values);
      if (!result.error) {
        helpers.resetForm();
      }
    },
  });

  const classes = useStyle();

  return (
    <Paper elevation={1}>
      {error && (
        <Alert severity="error">
          Something went horribly wrong! Please try again later.
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid className={classes.padding} container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="newTask-title"
              inputProps={formik.getFieldProps("title")}
              error={formik.touched["title"] && !!formik.errors["title"]}
              helperText={formik.errors["title"]}
              label="Titel"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="newTask-description"
              inputProps={formik.getFieldProps("description")}
              error={
                formik.touched["description"] && !!formik.errors["description"]
              }
              helperText={formik.errors["description"]}
              label="Beschreibung"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
            >
              Hinzufügen
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
