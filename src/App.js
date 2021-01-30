import { Switch, Route } from 'react-router-dom'
import { routes } from 'configs'

function App() {
  return (
    <Switch>
      {routes.map((config, index) => (
        <Route key={index} exact {...config} />
      ))}
    </Switch>
  )
}

export default App
