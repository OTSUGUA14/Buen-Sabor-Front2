import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { UserProvider } from './cliente/components/UserContext';


function App() {
  return (


    <UserProvider>
      <BrowserRouter>

        <div className='bg-gray-100'>

          <AppRouter />


        </div>

      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
