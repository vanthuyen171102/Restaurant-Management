import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Tables from './pages/Tables'
import TableOrdering from './pages/TableOrdering'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="san-pham" element={<Products />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ban-an" element={<Tables />} />
                    <Route path="/ban-an/:id" element={<TableOrdering />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
