import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import { getItem } from "./utils/storage";
import NotFound from "./pages/NotFound";

function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function UsuarioLogado({ redirectTo }) {
  const isAuthenticated = getItem("token");

  return isAuthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
}
export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<UsuarioLogado redirectTo="home" />}>
        <Route path="/" element={<Header logado={false} />}>
          <Route path="" element={<Login />} />
        </Route>
        <Route path="/cadastro" element={<Header logado={false} />}>
          <Route path="" element={<Cadastro />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes redirectTo="/" />}>
        <Route path="/home" element={<Header logado={true} />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
