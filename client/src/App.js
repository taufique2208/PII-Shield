import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./pages/User";
import Company from "./pages/Company";
import HomePage from "./pages/HomePage";
import UserHome from "./pages/UserHome";
import "./index.css";
import { Outlet } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "PIIShield",
  projectId: "597257af73d4d0b4e52c1659fc2c6eed",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<UserHome/>} />
              <Route path="/user" element={<User />} />

              <Route element={<HomePage />}>
                <Route path="/company/:id" element={<Company />} />
              </Route>
            </Routes>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
