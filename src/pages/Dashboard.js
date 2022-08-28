import React, { useEffect, useState } from "react";
import { assets } from "../constant/assets";
import damboBadge from "../assets/dambo-membership.svg";
import { supabase } from "../utils/supabase";
import Leaderboard from "../components/Leaderboard";
import "./style.scss";
import Governance from "../components/Governance";
import { getIssuesForRepo, tweetLookup } from "../utils/githiubChecks";
import TaskCard from "../components/TaskCard";
import { Modal } from "antd";
import ProfileScreen from "./ProfileScreen";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/DashboardHeader";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { task } from "../utils/task";

const DashboardScreen = () => {
  const [route, setRoute] = useState("profile");

  // const [route, setRoute] = useState("home");
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
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

  const [devTask, setDevTask] = useState([]);
  const [marketingTask, setMarketingTask] = useState(task);
  const address = useSelector((x) => x.auth.accountAddress);

  useEffect(async () => {
    const issues = await getIssuesForRepo("eth-jashan", "dambo-member-repo");

    const issuesOnly = issues.data.filter(
      (x) => x.pull_request === null || x.pull_request === undefined
    );
    console.log("Issues", issuesOnly);
    setDevTask(issuesOnly);
  }, []);

  const renderHeader = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "1rem 0rem",
        alignItems: "center",
        borderBottom: "1px solid #E1E1E0",
      }}
    >
      <div style={{ fontFamily: "bold", fontSize: "1rem" }}>dambo</div>
      <div
        style={{
          fontFamily: "bold",
          fontSize: "1rem",
          color: "#734BFF",
        }}
      >
        {`${address?.slice(0, 4)}...${address?.slice(-4)}`}
      </div>
    </div>
  );

  const renderSnackBar = () => (
    <div
      style={{
        display: "flex",
        padding: "1rem 0rem 1rem 0rem",
        borderBottom: "1px solid #E1E1E0",
        alignItems: "center",
      }}
    >
      <div
        onClick={() => setRoute("profile")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: route === "profile" ? "bolder" : "books",
          fontSize: "1rem",
        }}
      >
        profile
      </div>
      <div
        onClick={() => setRoute("task")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: route === "task" ? "bolder" : "books",
          fontSize: "1rem",
          marginLeft: "2rem",
        }}
      >
        task
      </div>
      <div
        onClick={() => setRoute("leaderboard")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: route === "leaderboard" ? "bolder" : "books",
          fontSize: "1rem",
          marginLeft: "2rem",
        }}
      >
        leaderboard
      </div>
      <div
        onClick={() => setRoute("governance")}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: route === "governance" ? "bolder" : "books",
          marginLeft: "2rem",
          fontSize: "1rem",
        }}
      >
        governance
      </div>
    </div>
  );

  const mintMembershipBadge = () => (
    <div
      style={{
        width: "100%",
        background: "#734BFF",
        padding: "2rem 1.25rem 2rem",
        borderRadius: 20,
        marginTop: 24,
        flexDirection: "row",
        position: "relative",
      }}
    >
      <div>
        <div
          style={{
            color: "white",
            fontFamily: "bolder",
            fontSize: 20,
          }}
        >
          Join damboDAO
        </div>
        <div
          style={{
            color: "white",
            fontFamily: "bolder",
            fontSize: 32,
            marginTop: 24,
          }}
        >
          Spread the news about
          <br />
          dambo to claim membership
          <br /> badge
        </div>
        {showInput ? (
          <div className="twitter-claim-input-row">
            <input
              placeholder="Enter the twitter id"
              style={{ outline: "none" }}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={async () => {
                const res = await tweetLookup(inputText);
                if (res === "gm 🔆👀  @dambo_live") {
                  console.log("claim membership");
                }
              }}
            >
              <IoMdCheckmark />
            </button>
            <button onClick={() => setShowInput(false)}>
              <IoClose />
            </button>
          </div>
        ) : (
          <div
            style={{
              width: "30%",
              padding: "12px 16px",
              background: "white",
              marginTop: 32,
              borderRadius: "24px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              onClick={async () => {
                // setShowInput(true);
                // window.open(
                //   `https://twitter.com/intent/tweet?text=gm 🔆👀  @dambo_live`
                // );
                await getMembership(
                  "0xD7B74ECD61aD3a68d306094C345c587F86B3547c",
                  "0x565CBd65Cb3e65445AfD14169003A528C985e9C7"
                );
              }}
              style={{
                color: "#734BFF",
                fontFamily: "bold",
                fontSize: "16px",
              }}
            >
              Share Dambo on Tweeter
            </div>

            <img
              alt=""
              style={{ height: 24, width: 24 }}
              src={assets.icons.chevronRightPurple}
            />
          </div>
        )}
      </div>
      <img
        alt=""
        style={{ position: "absolute", bottom: 0, right: 20 }}
        src={damboBadge}
      />
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
      className="dashboard-container"
    >
      <div className="dashboard-main">
        <DashboardHeader />
        {renderSnackBar()}
        <div className="scrollDiv">
          {route === "leaderboard" ? (
            <Leaderboard />
          ) : route === "governance" ? (
            <Governance />
          ) : route === "task" ? (
            <>
              {mintMembershipBadge()}
              <div
                style={{
                  width: "100%",
                  border: "1px solid #E1E1E0",
                  margin: "12px 0px",
                }}
              />
              <div
                style={{
                  flexDirection: "row",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    width: "48%",
                  }}
                >
                  {marketingTask.map((x, i) => (
                    <TaskCard item={x} guildName={"marketing guild"} />
                  ))}
                </div>
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    width: "48%",
                  }}
                >
                  {devTask.map((x, i) => (
                    <TaskCard guildName={"developer guild"} item={x} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <ProfileScreen />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
