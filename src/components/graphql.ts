export interface Task {
  __typename?: "Task";
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export const refetchTasksCtx = { additionalTypenames: ["Task"] };

export type AllTasksQueryResult = { allTasks: { nodes: Task[] } };

export const allTasksQuery = `
query AllTasks {
  allTasks {
    nodes { done, description, id, title }
  }  
}
`;

export const addTaskMutation = `
mutation AddTask ($title: String!, $description: String!) {
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
export type AddTaskMutationResult = { task: Task };
export type AddTaskMutationVariables = Pick<Task, "title" | "description">;

export const updateTaskStatusMutation = `
mutation UpdateDone ($id: Int!, $done: Boolean!) { 
  updateTaskById(input: {taskPatch: {done: $done}, id: $id}) {
  task {
    id
    done
  }
}}`;

export type UpdateTaskStatusVariables = { id: number; done: boolean };

export const deleteTaskMutation = `
mutation DeleteTask ($id: Int!) { 
  deleteTaskById(input: { id: $id } ) {
    deletedTaskId
  }
}`;

export type DeleteTasksVariables = { id: number };
