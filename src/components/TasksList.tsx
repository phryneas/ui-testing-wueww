import React from "react";
import { useQuery } from "urql";
import { AllTasksQueryResult, allTasksQuery, refetchTasksCtx } from "./graphql";
import { TaskCard } from "./TaskCard";

export function TasksList() {
  const [res] = useQuery<AllTasksQueryResult>({
    query: allTasksQuery,
    context: refetchTasksCtx,
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
