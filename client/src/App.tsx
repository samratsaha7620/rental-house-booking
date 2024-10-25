import './App.css';
import { Route ,Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ListingClientWithSuspense from './pages/ListingPage';
import TripsPage from './pages/TripsPage';
import FavoritesPage from './pages/FavoritesPage';
import PropertiesPage from './pages/PropertiesPage';
import ReservationsPage from './pages/ReservationsPage';
import { ListingsParams } from './types';
import q from "query-string";


function App() {
  const location = useLocation();
  const searchParams: ListingsParams = q.parse(location.search);
  return (  
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage searchParams ={searchParams}/>}/> 

        <Route path="listings/:id" element={<ListingClientWithSuspense />} />

        <Route path="favorites" element={<FavoritesPage />} /> 

        <Route path="properties" element={<PropertiesPage />} /> 
        <Route path='trips' element={<TripsPage/>} /> 

        <Route  path='reservations' element={<ReservationsPage/>}/>
      </Route>
    </Routes>
  )
}

export default App;
