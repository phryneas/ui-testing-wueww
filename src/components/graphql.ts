export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export const refetchTasksCtx = { additionalTypenames: ["Task"] };

export type AllTasksQueryResult = { allTasks: { nodes: Task[] } };

export const allTasksQuery = `
query {
  allTasks {
    nodes { done, description, id, title }
  }  
}
`;

export const addTodoMutation = `
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
export type AddTodoMutationResult = { task: Task };
export type AddTodoMutationVariables = Pick<Task, "title" | "description">;

export const updateTodoStatusMutation = `
mutation  ($id: Int!, $done: Boolean!) { 
  updateTaskById(input: {taskPatch: {done: $done}, id: $id}) {
  task {
    id
    done
  }
}}`;

export type UpdateTodoStatusVariables = { id: number; done: boolean };

export const deleteTodoMutation = `
mutation  ($id: Int!) { 
  deleteTaskById(input: { id: $id } ) {
    deletedTaskId
  }
}`;

export type DeleteTodoVariables = { id: number };
