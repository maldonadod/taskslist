import React from "react";
import { merge, BehaviorSubject, combineLatest } from "rxjs";
import { tap, map, switchMap, debounceTime, mapTo } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import './App.css';

const ns = new BehaviorSubject(3)

const effectiveNs = ns
  .pipe(
    debounceTime(250),
  )

const tasks = effectiveNs
  .pipe(
    switchMap(tasksToGenerateValue => {
      return ajax.getJSON("http://localhost:8085/tasks?length=" + tasksToGenerateValue)
    })
  )
const fetchEnds = tasks
  .pipe(
    mapTo(false)
  )
const fetchStarts = effectiveNs
  .pipe(
    mapTo(true)
  )
const loadings = merge(fetchEnds, fetchStarts)
    .pipe(
      tap(isLoading => console.log("isLoading", isLoading))
    )

const states = combineLatest([ns, tasks, loadings])
  .pipe(
    map(combinados => {
      const [tasksToGenerateValue, tasks, isLoading] = combinados
      return {
        tasksToGenerateValue,
        tasks,
        isLoading,
      }
    })
  )

function App() {

  const [state, setState] = React.useState(null)
  
  React.useEffect(() => {
    const subscription = states.subscribe(setState)
    return () => subscription.unsubscribe()
  }, [])

  if (!state || state && state.isLoading) {
    return "loading..."
  }
  if (state.tasks.length === 0) {
    return "no tasks today, hurray!"
  }

  function changeInputValue(e) {
    ns.next(e.target.value)
  }

  function renderTask(task) {
    return (
      <Task
        key={task.id}
        {...task}
      />
    )
  }

  return (
    <div className="App">

      <TasksRequestInput
        value={state.tasksToGenerateValue}
        onChange={changeInputValue}
      />

      {state.tasks.map(renderTask)}
    </div>
  );
}

function TasksRequestInput({ onChange, value }) {
  return (
    <input
      autoFocus
      onChange={onChange}
      value={value}
    />
  )
}

function Task({ title, id }) {
  return (
    <div>Task #{id} / {title}</div>
  )
}

export default App;
