import React from "react";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import { useMutation } from "urql";
import * as yup from "yup";
import {
  AddTodoMutationResult,
  AddTodoMutationVariables,
  addTodoMutation,
} from "./graphql";
const validationSchema = yup.object({
  title: yup.string().min(3),
  description: yup.string().min(3),
});
export function AddTodoForm() {
  const [{ error }, add] = useMutation<
    AddTodoMutationResult,
    AddTodoMutationVariables
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
