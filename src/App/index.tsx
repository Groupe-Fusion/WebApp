import { Outlet, ScrollRestoration } from "react-router-dom";
import Layout from "./Layout";

function App() {
  return (
    <Layout>
      <Outlet />
      <ScrollRestoration />
    </Layout>
  );
}

export default App;
