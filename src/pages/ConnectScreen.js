import { Row, Col, Typography, message } from "antd";
import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import connectors from "../utils/connector";
import "./connectScreen.scss";
import { assets } from "../constant/assets";
import { useSelector, useDispatch } from "react-redux";
import { setUnstoppableAuth } from "../store/actions/auth-action";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import axios from "axios";

const ConnectScreen = () => {
  const discordCode = useSelector((x) => x.auth.discordCode);
  const accountAddress = useSelector((x) => x.auth.accountAddress);
  const github = useSelector((x) => x.auth.github);
  const authorization = useSelector((x) => x.auth.authorization);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onDiscordAuth = () => {
    if (!discordCode) {
      window.location.replace(
        `https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.members.read`
      );
    }
  };

  const { active, account, activate, deactivate } = useWeb3React();

  const onWalletConnect = (connectorId) => {
    if (!accountAddress) {
      return async () => {
        try {
          const connector = connectors[connectorId];

          // Taken from https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-817631654
          if (
            connector instanceof WalletConnectConnector &&
            connector.walletConnectProvider
          ) {
            connector.walletConnectProvider = undefined;
          }
          await activate(connector);
        } catch (error) {
          console.error(error);
        }
      };
    }
  };
  if (active && !authorization) {
    const username = JSON.parse(localStorage.getItem("username"));
    const authorization = JSON.parse(
      localStorage.getItem(
        `authorization?clientID=316afdd4-8b6f-4e6c-8891-c1d22ce96112&scope=openid+wallet&username=${username.value}`
      )
    );
    dispatch(setUnstoppableAuth(account, authorization));
    console.log(authorization);
  }
  async function handleDisconnect() {
    try {
      deactivate();
    } catch (error) {
      console.error(error);
    }
  }

  async function signInWithGithub() {
    await supabase.auth.signIn(
      {
        provider: "github",
      },
      {
        redirectTo: "http://localhost:3000/twitter/fallback?",
      }
    );
  }

  const createUser = async () => {
    // try {
    //   const res = await axios.post(
    //     "https://841d-106-206-4-13.in.ngrok.io/createUser",
    //     {
    //       name: "eth-jashan",
    //       addr: accountAddress,
    //       discordId: discordCode,
    //       twitterId: `https://github.com/eth-jashan`,
    //     },
    //     {
    //       headers: {
    //         Authorization: `${authorization.value.idToken.__raw}`,
    //       },
    //     }
    //   );
    //   console.log("ress", res, github);
    //   return true;
    // } catch (error) {
    //   console.log("error", error.toString());
    //   return false;
    // }
    // return true;
    // console.log("user", a);
    console.log(authorization.value.idToken.__raw);
  };

  const joinToCommunity = async () => {
    try {
      const res = await axios.post(
        "https://f543-115-110-248-75.in.ngrok.io/createUser",
        {
          name: "eth-jashan",
          addr: accountAddress,
          discordId: discordCode,
          twitterId: `https://github.com/eth-jashan`,
        },
        {
          headers: {
            Authorization: `${authorization.value.idToken.__raw}`,
          },
        }
      );
      console.log("ress", res, github);
      return true;
    } catch (error) {
      console.log("error", error.toString());
      return false;
    }
    // return true;
    // console.log("user", a);
  };

  useEffect(async () => {
    if (discordCode && authorization && github) {
      const res = await createUser();
      if (res) {
        // fetch user info
        navigate("/dashboard");
      } else {
        message.error("error on authenticate");
      }
    }
  });

  return (
    <div className="connect-socials-screen-container">
      <div className="socials-screen-left">
        <div className="socials-left-header">
          <div className="project-name">dambo</div>
          <div className="twitter-link">twitter</div>
        </div>
        <div className="socials-gm">gm gm</div>
        <div className="socials-dao-info">
          DamboDAO is first of its kind disposable DAO. 20% of our winnings from
          the hackathon will go to DAO treasury and all members will vote on how
          to spend it(Some Drinks maybe!!)
        </div>
      </div>
      <div className="socials-screen-right">
        <div className="socials-right-heading">Get started</div>
        <div className="social-connect-btns">
          <div></div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            {Object.keys(connectors).map((v, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  marginTop: 50,
                  padding: "1rem 1.5rem",
                  background: "#734BFF",
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 32,
                  fontSize: 16,
                  alignItems: "center",
                }}
                onClick={onWalletConnect(v)}
              >
                <div
                  style={{
                    fontFamily: "books",
                    color: "white",
                  }}
                >
                  {!accountAddress ? "Connect Wallet" : "Connected"}
                </div>
                {!accountAddress && (
                  <img
                    alt=""
                    style={{ height: 24, width: 24 }}
                    src={assets.icons.chevronRightWhite}
                  />
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              width: "100%",
              marginTop: 20,
              padding: "1rem 1.5rem",
              background: "#5665F3",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 32,
              fontSize: 16,
              alignItems: "center",
            }}
            onClick={() => onDiscordAuth()}
          >
            <div
              style={{
                fontFamily: "books",
                color: "white",
              }}
            >
              {discordCode ? "Connected" : "Connect Discord"}
            </div>
            {!discordCode && (
              <img
                alt=""
                style={{ height: 24, width: 24 }}
                src={assets.icons.chevronRightWhite}
              />
            )}
          </div>

          <div
            style={{
              width: "100%",
              marginTop: 20,
              padding: "1rem 1.5rem",
              background: "black",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 32,
              fontSize: 16,
              alignItems: "center",
            }}
            onClick={() => signInWithGithub()}
          >
            <div
              style={{
                fontFamily: "books",
                color: "white",
              }}
            >
              {github ? "Connected" : "Connect Github"}
            </div>
            {!github && (
              <img
                alt=""
                style={{ height: 24, width: 24 }}
                src={assets.icons.chevronRightWhite}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectScreen;
