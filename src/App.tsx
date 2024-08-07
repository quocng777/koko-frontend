import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Provider } from 'react-redux'
import { AuthLoader } from './app/context/auth-loader';
import { store } from './app/api/store';

function App() {

  return (
    <Provider store={store}>
      <AuthLoader>
        <RouterProvider router={router} />
      </AuthLoader>
    </Provider>
  )
}

export default App
