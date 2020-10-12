import { Grid } from '@material-ui/core'
import React from 'react'
import { useQuery } from 'urql'
import { AllTasksQueryResult, allTasksQuery, refetchTasksCtx } from './graphql'
import { TaskCard } from './TaskCard'

export function TasksList() {
  const [res] = useQuery<AllTasksQueryResult>({
    query: allTasksQuery,
    context: refetchTasksCtx,
  })
  if (res.fetching) return <p>Loading...</p>
  if (res.error) return <p>Errored!</p>
  return (
    <Grid container spacing={1} data-testid="TaskList">
      {res.data?.allTasks.nodes.map((task) => (
        <Grid key={task.id} item xs={12}>
          <TaskCard task={task} />
        </Grid>
      ))}
    </Grid>
  )
}
