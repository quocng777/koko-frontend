import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './app/store';

function App() {

  return (
    <Provider store={store}>
      <div className='min-h-screen'>
      <RouterProvider router={router} />
      </div>
    </Provider>
  )
}

export default App
