import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";

import Modal from "./patterns/modal";

import { useEagerConnect } from "./utils/hooks";

import BackToTop from "./pages/home";

const App = () => {
  const [isWrongNetwork, setIsWrongNetwork] = useState();

  useEagerConnect();
  const { chainId, active } = useWeb3React();
  const context = useWeb3React();

  useEffect(() => {
    console.log(context);
    console.log(chainId);
    if (active) {
      if (chainId !== 56) 
      // if (chainId !== 97) //BSC Test net
      {
        console.error("Wrong ChainID");
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    }
  }, [chainId]);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {/* <Dashboard /> */}
          <BackToTop />
          {isWrongNetwork && (
            <Modal
              variant="wrongNetwork"
              title="Wrong network"
              description="You are on wrong network. Please connect to BSC Mainnet to continue"
              buttonText="Connect now"
            />
          )}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
