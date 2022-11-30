/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Box, useMediaQuery, Skeleton } from "@mui/material";
import { ethers, BigNumber } from "ethers";
import {
  AiOutlineCalculator,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import styled from "styled-components";

import { SSL_LOCK } from "../../abis/address";
import Button from "../../components/Button";
import ROIModal from "../../components/ROIModal";
import StakingModal from "../../components/StakingModal";
import { useAddress } from "../../context/web3Context";
import { useWeb3Context } from "../../context/web3Context";
import useLockInfo from "../../hooks/useLockInfo";
import useTokenInfo from "../../hooks/useTokenInfo";
import { getLockContract, getTokenContract } from "../../utils/contracts";
import { figureError } from "../../utils/functions";
import { numberWithCommas } from "../../utils/functions";
import { FaExternalLinkAlt } from "react-icons/fa";
import ConnectMenu from "../../components/TopBar/ConnectMenu";
import { useEffect } from "react";
import { fontSize } from "@mui/system";

const Home = ({ setNotification }) => {
  const teamList = {
    Ecuador: { id: 0, name: "Ecuador", rank: 44, flag: "/flags/0.png" },
    Netherlands: { id: 1, name: "Netherlands", rank: 8, flag: "/flags/1.png" },
    Qatar: { id: 2, name: "Qatar", rank: 50, flag: "/flags/2.png" },
    Senegal: { id: 3, name: "Senegal", rank: 18, flag: "/flags/3.png" },

    England: { id: 4, name: "England", rank: 5, flag: "/flags/4.png" },
    Iran: { id: 5, name: "Iran", rank: 20, flag: "/flags/5.png" },
    USA: { id: 6, name: "USA", rank: 16, flag: "/flags/6.png" },
    Wales: { id: 7, name: "Wales", rank: 19, flag: "/flags/7.png" },

    Argentina: { id: 8, name: "Argentina", rank: 3, flag: "/flags/8.png" },
    Mexico: { id: 9, name: "Mexico", rank: 13, flag: "/flags/9.png" },
    Poland: { id: 10, name: "Poland", rank: 26, flag: "/flags/10.png" },
    "Saudi Arabia": {
      id: 11,
      name: "Saudi Arabia",
      rank: 51,
      flag: "/flags/11.png",
    },

    Australia: { id: 12, name: "Australia", rank: 38, flag: "/flags/12.png" },
    Denmark: { id: 13, name: "Denmark", rank: 10, flag: "/flags/13.png" },
    France: { id: 14, name: "France", rank: 4, flag: "/flags/14.png" },
    Tunisia: { id: 15, name: "Tunisia", rank: 30, flag: "/flags/15.png" },

    "Costa Rica": {
      id: 16,
      name: "Costa Rica",
      rank: 31,
      flag: "/flags/16.png",
    },
    Germany: { id: 17, name: "Germany", rank: 11, flag: "/flags/17.png" },
    Japan: { id: 18, name: "Japan", rank: 24, flag: "/flags/18.png" },
    Spain: { id: 19, name: "Spain", rank: 7, flag: "/flags/19.png" },

    Belgium: { id: 20, name: "Belgium", rank: 2, flag: "/flags/20.png" },
    Canada: { id: 21, name: "Canada", rank: 41, flag: "/flags/21.png" },
    Croatia: { id: 22, name: "Croatia", rank: 12, flag: "/flags/22.png" },
    Morocco: { id: 23, name: "Morocco", rank: 22, flag: "/flags/23.png" },

    Brazil: { id: 24, name: "Brazil", rank: 1, flag: "/flags/24.png" },
    Cameroon: { id: 25, name: "Cameroon", rank: 21, flag: "/flags/25.png" },
    Serbia: { id: 26, name: "Serbia", rank: 21, flag: "/flags/26.png" },
    Switzerland: {
      id: 27,
      name: "Switzerland",
      rank: 15,
      flag: "/flags/27.png",
    },

    Ghana: { id: 28, name: "Ghana", rank: 61, flag: "/flags/28.png" },
    "South Korea": {
      id: 29,
      name: "South Korea",
      rank: 28,
      flag: "/flags/29.png",
    },
    Portugal: { id: 30, name: "Portugal", rank: 9, flag: "/flags/30.png" },
    Uruguay: { id: 31, name: "Uruguay", rank: 14, flag: "/flags/31.png" },
  };

  // const matchInfos = [0, 1, 2, 3, 4, 5].map((i) => {
  //   return {
  //     team1: "Portugal",
  //     team2: "England",
  //     time: 1669858282,
  //     level: "Semi Final",

  //     choiceCounters: [0, 50, 50, 50],
  //     result: i % 4,

  //     betAmount: 0,
  //     awardAmount: 0,

  //     team1AwardRate: 150,
  //     team2AwardRate: 150,
  //     drawAwardRate: 150,
  //   };
  // });

  const {
    lockinfo,
    lockallow,
    accountlockinfo,
    accounthistory,
    fetchAccountLockData,
    fetchLockData,
    fetchAllowance,
    fetchAccountHistory,
  } = useLockInfo();

  const { price, balance, fetchAccountTokenInfo } = useTokenInfo();

  const { connect, provider, chainID } = useWeb3Context();

  const account = useAddress();

  const [pending, setPending] = useState(false);
  const [maxpressed, setMaxPressed] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [choice, setChoice] = useState(0);

  const [betIndex, setBetIndex] = useState(-1);

  const [activeDay, setActiveDay] = useState(0);

  const [claimable, setClaimable] = useState(0);

  const [nowInSeconds, setNowInSeconds] = useState(
    Math.round(Date.now() / 1000)
  );

  // let timer = 0;

  useEffect(() => {
    console.log("accountlockinfo :>> ", accountlockinfo);
    setTimeout(() => {
      setNowInSeconds(Math.round(Date.now() / 1000));
    }, 300);
    setTimeout(() => {
      setNowInSeconds(Math.round(Date.now() / 1000));
    }, 600);
    setTimeout(() => {
      setNowInSeconds(Math.round(Date.now() / 1000));
    }, 900);
    setTimeout(() => {
      setNowInSeconds(Math.round(Date.now() / 1000));
    }, 1200);
  }, [nowInSeconds]);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const onClaim = async (matchIndex) => {
    setPending(true);
    try {
      let harvestTx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());
        let i = 0;
        estimateGas = await LockContract.estimateGas.claim(matchIndex);
        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        harvestTx = await LockContract.claim(matchIndex, tx);
      }
      await harvestTx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
    setClaimable(0);
    accountlockinfo.depositDate = Date.now() + 30000;
  };

  const onApproveContract = async (type, address) => {
    setPending(true);
    try {
      const tokenContract = getTokenContract(chainID, provider.getSigner());
      const estimateGas = await tokenContract.estimateGas.approve(
        SSL_LOCK[chainID],
        maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18)
      );
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approvetx = await tokenContract.approve(
        SSL_LOCK[chainID],
        maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18),
        tx
      );
      await approvetx.wait();
      fetchAllowance();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onDeposit = async () => {
    if (choice === 0) {
      setNotification({
        type: "info",
        detail: "Please select winner or draw.",
      });
      return;
    }
    setPending(true);
    try {
      let ttx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());

        const estimateGas = await LockContract.estimateGas.bet(
          betIndex,
          choice,
          maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18)
        );
        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await LockContract.bet(
          betIndex,
          choice,
          maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18),
          tx
        );
      }

      await ttx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onWithdraw = async () => {
    setPending(true);
    console.log(accountlockinfo);
    try {
      let ttx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());

        estimateGas = await LockContract.estimateGas.withdraw(
          maxpressed
            ? accountlockinfo.balance
            : ethers.utils.parseUnits(withdrawAmount, 18)
        );

        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await LockContract.withdraw(
          maxpressed
            ? accountlockinfo.balance
            : ethers.utils.parseUnits(withdrawAmount, 18),
          tx
        );
      }

      await ttx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const sm = useMediaQuery("(max-width : 500px)");
  const xs = useMediaQuery("(max-width : 450px)");
  const mw950 = useMediaQuery("(max-width : 950px)");
  const mw650 = useMediaQuery("(max-width : 650px)");
  const mw1150 = useMediaQuery("(max-width : 1150px)");
  const mw2000 = useMediaQuery("(max-width : 2000px)");

  return (
    <StyledContainer>
      <Background position={"fixed"}></Background>
      {/* <HomeTopBar position={"relative"}>
        <Box display={"flex"} alignItems={"center"}>
          <LogoSVG />
          <Box
            ml={mw950 ? "0px" : mw1150 ? "10px" : "20px"}
            fontSize={mw650 ? "20px" : mw950 ? "28px" : "36px"}
            fontWeight="800"
            textAlign={"center"}
            width={mw950 ? "min-content" : "fit-content"}
          >
            WORLD CUP BET
          </Box>
        </Box>
        <ConnectMenu setNotification={setNotification} />
      </HomeTopBar> */}
      <Box height={"100px"}></Box>
      <Mainpage
        fontFamily={"Montserrat,sans-serif"}
        position={"relative"}
        display={"flex"}
        flexWrap={"wrap"}
        width={"100%"}
      >
        <RowLayout alignItems={"unset"}>
          <Panel>
            <Box fontSize={"20px"} color={"#fff"} fontWeight={"600"}>
              Total Matches registered
            </Box>
            <RowLayout
              fontSize={"32px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              {!lockinfo || lockinfo.matchCount === undefined ? (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              ) : (
                <Box>{lockinfo.matchCount.toString()}</Box>
              )}
            </RowLayout>
          </Panel>
          <Panel>
            <Box fontSize={"20px"} color={"#fff"} fontWeight={"600"}>
              Total $WCB Bet Amount
            </Box>
            <RowLayout
              fontSize={"32px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              {!lockinfo ? (
                "0.000000"
              ) : lockinfo.totalBetAmount !== undefined ? (
                (lockinfo.totalBetAmount / Math.pow(10, 18)).toFixed(6)
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </RowLayout>
          </Panel>
          <Panel>
            <Box fontSize={"20px"} color={"#fff"} fontWeight={"600"}>
              Total $WCB Award Amount
            </Box>
            <RowLayout
              fontSize={"32px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              {!lockinfo ? (
                "0.000000"
              ) : lockinfo.totalAwardAmount !== undefined ? (
                (lockinfo.totalAwardAmount / Math.pow(10, 18)).toFixed(6)
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </RowLayout>
          </Panel>
        </RowLayout>
        <RowLayout alignItems={"unset"}>
          <Panel>
            <Box
              fontSize={"20px"}
              color={"#fff"}
              fontWeight={"600"}
              mb={"20px"}
            >
              My Bet Status
            </Box>

            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"20px"}>Bets</Box>
              {account ? (
                <Box fontSize={"15px"}>
                  {accountlockinfo.totalBetCount !== undefined ? (
                    Number(accountlockinfo.totalBetCount.toString())
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"100px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              ) : (
                "NaN"
              )}
            </RowLayout>
            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"20px"}>Total Bet Amount</Box>
              <Box fontSize={"15px"}>
                {account ? (
                  <RowLayout>
                    <Box mr={"10px"}>{"$WCB"}</Box>
                    {accountlockinfo.totalAward !== undefined ? (
                      (accountlockinfo.totalAward / Math.pow(10, 18)).toFixed(6)
                    ) : (
                      <Skeleton
                        variant={"text"}
                        width={"100px"}
                        style={{ transform: "unset" }}
                      />
                    )}
                  </RowLayout>
                ) : (
                  "NaN"
                )}
              </Box>
            </RowLayout>
            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"20px"}>Total Award Amount</Box>
              <Box fontSize={"15px"}>
                {account ? (
                  <RowLayout>
                    <Box mr={"10px"}>{"$WCB"}</Box>
                    {accountlockinfo.totalBet !== undefined ? (
                      (accountlockinfo.totalBet / Math.pow(10, 18)).toFixed(6)
                    ) : (
                      <Skeleton
                        variant={"text"}
                        width={"100px"}
                        style={{ transform: "unset" }}
                      />
                    )}
                  </RowLayout>
                ) : (
                  "NaN"
                )}
              </Box>
            </RowLayout>

            <RowLayout justifyContent={"space-between"} mt={"20px"}>
              <Box fontSize={"20px"}>Current Balance</Box>
              <Box fontSize={"15px"}>
                {account ? (
                  <RowLayout>
                    <Box mr={"10px"}>{"$WCB"}</Box>
                    {balance !== undefined ? (
                      (balance / Math.pow(10, 18)).toFixed(6)
                    ) : (
                      <Skeleton
                        variant={"text"}
                        width={"100px"}
                        style={{ transform: "unset" }}
                      />
                    )}
                  </RowLayout>
                ) : (
                  <Button
                    type={"primary"}
                    width={"120px"}
                    height={"50px"}
                    disabled={pending}
                    onClick={() => {
                      !account ? onConnect() : onApproveContract();
                    }}
                  >
                    {!account ? "Connect" : "Approve"}
                  </Button>
                )}
              </Box>
            </RowLayout>
          </Panel>
          <Trophy></Trophy>
          <Panel
            color={"#EEE"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <Box
              fontSize={"20px"}
              color={"#fff"}
              fontWeight={"600"}
              mb={"20px"}
            >
              Smart Contracts
            </Box>
            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"20px"}>$WCB</Box>
              <Box fontSize={"15px"}>
                <a href="https://goerli.etherscan.io/address/0x929E9E7af59b6061f7CE94d7313393dBFee85BCe">
                  <RowLayout>
                    View on Etherscan
                    <FaExternalLinkAlt></FaExternalLinkAlt>
                  </RowLayout>
                </a>
              </Box>
            </RowLayout>
            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"20px"}>World Cup Bet</Box>
              <Box fontSize={"15px"}>
                <a href="https://goerli.etherscan.io/address/0x63274c9d186154245bC92ca203ec65F3C1724d5F">
                  <RowLayout>
                    View on Etherscan
                    <FaExternalLinkAlt></FaExternalLinkAlt>
                  </RowLayout>
                </a>
              </Box>
            </RowLayout>
            {/* <Box fontSize={"20px"} fontWeight={"800"}>
              <RowLayout justifyContent={"space-between"}>
                <Box>$TWC APR</Box>
                <Box
                  fontSize={"18px"}
                  color={"#00FF31"}
                  // border={"1px #eaaf0e solid"}
                  // borderBottom={"0"}
                  borderRadius={"10px"}
                  boxShadow={
                    "#eaaf0e 0px -1px 0px, #eaaf0e -1px -2px 0px, #eaaf0e 1px -2px 0px"
                  }
                  padding={"4px"}
                >
                  {!lockinfo ? (
                    "0.00%"
                  ) : lockinfo.totalStaked !== undefined ? (
                    (lockinfo.interest / Math.pow(10, 16)).toFixed(2) + "%"
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"70px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              </RowLayout>
            </Box> */}
          </Panel>
        </RowLayout>
        <ColumnLayout>
          <WinText>BET NOW TO EARN!</WinText>
        </ColumnLayout>
        {lockinfo.matchInfos === undefined
          ? [
              ...Array(
                lockinfo.matchCount === undefined
                  ? 16
                  : Number(lockinfo.matchCount.toString())
              ).keys(),
            ].map((skelIdx) => (
              <RowLayout
                key={"skel" + skelIdx}
                justifyContent={"center !important"}
              >
                <Panel flex={"1 0 0"}>
                  <RowLayout
                    justifyContent={"space-between"}
                    fontSize={28 - mw2000 * 16 + "px"}
                  >
                    <Box color={"#CCC"} mt={"-20px"}>
                      #{skelIdx + 1}
                    </Box>
                    <Box color={"#CCC"} mt={"-20px"}>
                      <Skeleton
                        variant={"text"}
                        width={200 - mw2000 * 100 + "px"}
                        style={{ transform: "unset" }}
                      />
                    </Box>
                  </RowLayout>
                  <RowLayout my={40 - mw2000 * 20 + "px"}>
                    <Box
                      fontSize={40 - mw2000 * 24 + "px"}
                      fontWeight={"800"}
                      color={"#CCC"}
                      mt={"-20px"}
                    >
                      <Skeleton
                        variant={"text"}
                        width={500 - mw2000 * 250 + "px"}
                        style={{ transform: "unset" }}
                      />
                    </Box>
                  </RowLayout>
                  <RowLayout
                    justifyContent={"space-around"}
                    flexDirection={mw650 ? "column" : "row"}
                  >
                    <RowLayout
                      mr={mw650 ? "" : "20px"}
                      mb={mw650 ? "20px" : ""}
                    >
                      <ColumnLayout>
                        <Skeleton
                          variant={"text"}
                          width={120 - mw2000 * 60 + "px"}
                          height={72 - mw2000 * 36 + "px"}
                          style={{ transform: "unset" }}
                        />
                        <Box fontSize={40 - mw2000 * 20 + "px"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                        <Box fontSize={24 - mw2000 * 12 + "px"} color={"#CCC"}>
                          <Skeleton
                            variant={"text"}
                            width={"60px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                      </ColumnLayout>
                      <ColumnLayout mx={40 - mw2000 * 20 + "px"}>
                        <Box fontSize={40 - mw2000 * 20 + "px"} color={"#FFF"}>
                          VS
                        </Box>
                      </ColumnLayout>
                      <ColumnLayout>
                        <Skeleton
                          variant={"text"}
                          width={120 - mw2000 * 60 + "px"}
                          height={72 - mw2000 * 36 + "px"}
                          style={{ transform: "unset" }}
                        />
                        <Box fontSize={40 - mw2000 * 20 + "px"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                        <Box fontSize={24 - mw2000 * 12 + "px"} color={"#FFF"}>
                          <Skeleton
                            variant={"text"}
                            width={"60px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                      </ColumnLayout>
                    </RowLayout>
                    <ColumnLayout
                      alignItems={"flex-start"}
                      fontSize={24 - mw2000 * 8 + "px"}
                    >
                      <RowLayout>
                        <Box color={"#AAA"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                        <Box ml={"10px"}>{": 0.00%"}</Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Draw:</Box>
                        <Box ml={"10px"}>0.00%</Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                        <Box ml={"10px"}>{": 0.00%"}</Box>
                      </RowLayout>
                      <RowLayout my={20 - mw2000 * 10 + "px"}>
                        <Box color={"#AAA"}>Time until match:</Box>
                        <Box
                          ml={"10px"}
                          // width={"180px"}
                          fontFamily={
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;"
                          }
                          fontWeight={"200"}
                        >
                          {"00 Day(s) 00:00:00"}
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Total bet:</Box>
                        <Box ml={"10px"} width={"140px"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Total award:</Box>
                        <Box ml={"10px"} width={"140px"}>
                          <Skeleton
                            variant={"text"}
                            width={"100px"}
                            style={{ transform: "unset" }}
                          />
                        </Box>
                      </RowLayout>
                    </ColumnLayout>
                  </RowLayout>
                </Panel>
              </RowLayout>
            ))
          : lockinfo.matchInfos.map((match, matchIndex) => (
              <RowLayout
                width={"100%"}
                key={"row" + matchIndex}
                justifyContent={"center !important"}
              >
                <Panel flex={"1 0 0"}>
                  <RowLayout
                    justifyContent={"space-between"}
                    fontSize={28 - mw2000 * 16 + "px"}
                  >
                    <Box color={"#CCC"} mt={"-20px"}>
                      #{matchIndex + 1}
                    </Box>
                    <Box color={"#CCC"} mt={"-20px"}>
                      {new Date(match?.time * 1000).toLocaleString()}
                    </Box>
                  </RowLayout>
                  <RowLayout my={40 - mw2000 * 20 + "px"}>
                    <Box
                      fontSize={40 - mw2000 * 24 + "px"}
                      fontWeight={"800"}
                      color={"#CCC"}
                      mt={"-20px"}
                    >
                      {match?.level}
                    </Box>
                  </RowLayout>
                  <RowLayout
                    justifyContent={"space-around"}
                    flexDirection={mw650 ? "column" : "row"}
                  >
                    <RowLayout
                      mr={mw650 ? "" : "20px"}
                      mb={mw650 ? "20px" : ""}
                    >
                      <ColumnLayout
                        boxShadow={
                          lockinfo.matchInfos[matchIndex]?.result == 1
                            ? "0 0 5px 1px #4ADE80"
                            : ""
                        }
                      >
                        <Flag
                          style={{
                            backgroundImage: `url('${
                              teamList[match?.team1]?.flag
                            }')`,
                          }}
                        ></Flag>
                        <Box></Box>
                        <Box
                          fontSize={40 - mw2000 * 20 + "px"}
                          color={
                            lockinfo.matchInfos[matchIndex]?.result == 1
                              ? "#4ADE80"
                              : "#FFF"
                          }
                          whiteSpace={"nowrap"}
                        >
                          {match?.team1}
                        </Box>
                        <Box fontSize={24 - mw2000 * 12 + "px"} color={"#CCC"}>
                          {`Rank: ${teamList[match?.team1]?.rank}`}
                        </Box>
                      </ColumnLayout>
                      <ColumnLayout
                        mx={40 - mw2000 * 20 + "px"}
                        position={"relative"}
                      >
                        <Box fontSize={40 - mw2000 * 20 + "px"} color={"#FFF"}>
                          VS
                        </Box>
                        {/* <Box
                        style={{
                          background:
                            "no-repeat center/100% url('/ball2022.png')",
                          zIndex: "0",
                        }}
                        position={"absolute"}
                        width={"80px"}
                        height={"80px"}
                      ></Box> */}
                        <Box
                          fontSize={24 - mw2000 * 8 + "px"}
                          color={"#4ADE80"}
                          mt={"10px"}
                          boxShadow={
                            lockinfo.matchInfos[matchIndex]?.result == 3
                              ? "0 0 5px 1px #4ADE80"
                              : ""
                          }
                        >
                          {lockinfo.matchInfos[matchIndex]?.result == 3
                            ? "DRAW"
                            : ""}
                        </Box>
                      </ColumnLayout>
                      <ColumnLayout
                        boxShadow={
                          lockinfo.matchInfos[matchIndex]?.result == 2
                            ? "0 0 5px 1px #4ADE80"
                            : ""
                        }
                      >
                        <Flag
                          style={{
                            backgroundImage: `url('${
                              teamList[match?.team2]?.flag
                            }')`,
                          }}
                        ></Flag>
                        <Box
                          fontSize={40 - mw2000 * 20 + "px"}
                          color={
                            lockinfo.matchInfos[matchIndex]?.result == 2
                              ? "#4ADE80"
                              : "#FFF"
                          }
                          whiteSpace={"nowrap"}
                        >
                          {match?.team2}
                        </Box>
                        <Box fontSize={24 - mw2000 * 12 + "px"} color={"#FFF"}>
                          {`Rank: ${teamList[match?.team2]?.rank}`}
                        </Box>
                      </ColumnLayout>
                    </RowLayout>
                    <ColumnLayout
                      alignItems={"flex-start"}
                      fontSize={24 - mw2000 * 8 + "px"}
                    >
                      <RowLayout>
                        <Box color={"#AAA"}>{match?.team1}:</Box>
                        <Box ml={"10px"}>
                          {(
                            lockinfo.matchInfos[matchIndex]?.team1AwardRate /
                            Math.pow(10, 16)
                          ).toFixed(2)}
                          %
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Draw:</Box>
                        <Box ml={"10px"}>
                          {(
                            lockinfo.matchInfos[matchIndex]?.drawAwardRate /
                            Math.pow(10, 16)
                          ).toFixed(2)}
                          %
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>{match?.team2}:</Box>
                        <Box ml={"10px"}>
                          {(
                            lockinfo.matchInfos[matchIndex]?.team2AwardRate /
                            Math.pow(10, 16)
                          ).toFixed(2)}
                          %
                        </Box>
                      </RowLayout>
                      <RowLayout my={20 - mw2000 * 10 + "px"}>
                        <Box color={"#AAA"}>Time until match:</Box>
                        <Box
                          ml={"10px"}
                          // width={"180px"}
                          fontFamily={
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;"
                          }
                          fontWeight={"200"}
                        >
                          {nowInSeconds > match?.time
                            ? "00 Day(s) 00:00:00"
                            : `${Math.floor(
                                (match?.time - nowInSeconds) / 86400
                              )
                                .toString()
                                .padStart(2, "0")} Day(s) ${Math.floor(
                                ((match?.time - nowInSeconds) % 86400) / 3600
                              )
                                .toString()
                                .padStart(2, "0")}:${Math.floor(
                                ((match?.time - nowInSeconds) % 3600) / 60
                              )
                                .toString()
                                .padStart(2, "0")}:${Math.floor(
                                (match?.time - nowInSeconds) % 60
                              )
                                .toString()
                                .padStart(2, "0")}`}
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Total bet:</Box>
                        <Box ml={"10px"} width={"140px"}>
                          {(
                            lockinfo.matchInfos[matchIndex]?.betAmount /
                            Math.pow(10, 18)
                          ).toFixed(6)}
                        </Box>
                      </RowLayout>
                      <RowLayout>
                        <Box color={"#AAA"}>Total award:</Box>
                        <Box ml={"10px"} width={"140px"}>
                          {(
                            lockinfo.matchInfos[matchIndex]?.awardAmount /
                            Math.pow(10, 18)
                          ).toFixed(6)}
                        </Box>
                      </RowLayout>
                      {/* <Box fontSize={"25px"} fontWeight={"800"}>
                  {!account ? (
                    "0.000000"
                  ) : accountlockinfo.balance !== undefined ? (
                    (accountlockinfo.balance / Math.pow(10, 18)).toFixed(10)
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"100px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
                <Box fontSize={"12px"} color={"#CCC"}>
                  {!account ? (
                    "USDT Value: $0.00"
                  ) : accountlockinfo.balance !== undefined ? (
                    `USDT Value: $${(
                      (accountlockinfo.balance / Math.pow(10, 18)) *
                      price
                    ).toFixed(2)}`
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"80px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box> */}
                    </ColumnLayout>
                  </RowLayout>
                  {Object.keys(accountlockinfo).length === 0 ? (
                    ""
                  ) : (
                    <>
                      <Box
                        mt={"20px"}
                        width={"100%"}
                        overflow={"hidden"}
                        display={"flex"}
                        alignItems={"center"}
                      >
                        <Button
                          type={"secondary"}
                          width={betIndex === matchIndex ? "120px" : "100%"}
                          height={"50px"}
                          disabled={pending || match?.time < nowInSeconds}
                          position={"relative"}
                          transform={"width 0.5s ease-out"}
                          fontSize={24 - mw2000 * 8 + "px"}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                          onClick={() => {
                            setChoice(0);
                            setBetIndex(
                              betIndex !== matchIndex ? matchIndex : -1
                            );
                          }}
                        >
                          {betIndex === matchIndex
                            ? "CANCEL"
                            : accountlockinfo.betInfos[matchIndex]?.betAmount > 0
                            ? `BET ${(
                                accountlockinfo.betInfos[matchIndex]?.betAmount /
                                Math.pow(10, 18)
                              ).toFixed(6)} $WCB TO ` +
                              (accountlockinfo.betInfos[matchIndex]?.choice == 3
                                ? "DRAW"
                                : (accountlockinfo.betInfos[matchIndex]
                                    .choice == 1
                                    ? match?.team1
                                    : match?.team2
                                  ).toUpperCase())
                            : match?.time > nowInSeconds
                            ? "PLACE BET"
                            : "FINISHED"}
                        </Button>
                        <ColumnLayout width={"calc(100% - 120px)"} ml={"20px"}>
                          <RowLayout>
                            <Flag
                              style={{
                                backgroundImage: `url('${
                                  teamList[match?.team1]?.flag
                                }')`,
                                animation:
                                  choice === 1 ? "pulse 0.5s infinite" : "",
                                cursor: "pointer",
                                transition: "all 0.5s ease-out",
                              }}
                              width={80 - mw2000 * 40 + "px"}
                              height={48 - mw2000 * 24 + "px"}
                              boxShadow={
                                choice === 1
                                  ? "0px 1px 3px white, 0px -1px 3px black"
                                  : ""
                              }
                              onClick={() => {
                                setChoice(1);
                              }}
                            ></Flag>
                            <Flag
                              style={{
                                userSelect: "none",
                                animation:
                                  choice === 3 ? "pulse 0.5s infinite" : "",
                                cursor: "pointer",
                                transition: "all 0.5s ease-out",
                              }}
                              backgroundColor={"#CCC"}
                              width={80 - mw2000 * 40 + "px"}
                              height={48 - mw2000 * 24 + "px"}
                              display={"flex"}
                              justifyContent={"center"}
                              boxShadow={
                                choice === 3
                                  ? "0px 1px 3px white, 0px -1px 3px black"
                                  : ""
                              }
                              onClick={() => {
                                setChoice(3);
                              }}
                              fontSize={28 - mw2000 * 14 + "px"}
                              color={"#333"}
                            >
                              Draw
                            </Flag>
                            <Flag
                              style={{
                                backgroundImage: `url('${
                                  teamList[match?.team2]?.flag
                                }')`,
                                animation:
                                  choice === 2 ? "pulse 0.5s infinite" : "",
                                cursor: "pointer",
                                transition: "all 0.5s ease-out",
                              }}
                              width={80 - mw2000 * 40 + "px"}
                              height={48 - mw2000 * 24 + "px"}
                              boxShadow={
                                choice === 2
                                  ? "0px 1px 3px white, 0px -1px 3px black"
                                  : ""
                              }
                              onClick={() => {
                                setChoice(2);
                              }}
                            ></Flag>
                          </RowLayout>
                          <InputPanel>
                            <InputField>
                              <input
                                type={"text"}
                                placeholder={"0.00"}
                                value={depositAmount}
                                disabled={betIndex !== matchIndex}
                                onChange={(e) => {
                                  setMaxPressed(false);
                                  setDepositAmount(e.target.value);
                                }}
                              />
                              <Button
                                type={"max"}
                                width={"64px"}
                                height={"46px"}
                                disabled={betIndex !== matchIndex}
                                onClick={() => {
                                  setDepositAmount(
                                    (balance / Math.pow(10, 18)).toFixed(6)
                                  );
                                  setMaxPressed(true);
                                }}
                              >
                                Max
                              </Button>
                            </InputField>
                            {lockallow ? (
                              <Button
                                type={"primary"}
                                width={sm ? "100%" : "143px"}
                                height={"50px"}
                                disabled={
                                  pending ||
                                  !Number(balance) ||
                                  !Number(depositAmount)
                                }
                                onClick={() => onDeposit()}
                              >
                                BET
                              </Button>
                            ) : (
                              <Button
                                type={"primary"}
                                width={sm ? "100%" : "100px"}
                                height={"50px"}
                                disabled={pending}
                                onClick={() => {
                                  !account ? onConnect() : onApproveContract();
                                }}
                              >
                                {!account ? "Connect" : "Approve"}
                              </Button>
                            )}
                          </InputPanel>
                        </ColumnLayout>
                      </Box>
                      {accountlockinfo.betInfos[matchIndex]?.betAmount > 0 ? (
                        <Button
                          type={"secondary"}
                          width={"100%"}
                          height={"50px"}
                          fontSize={24 - mw2000 * 8 + "px"}
                          disabled={
                            pending ||
                            lockinfo.matchInfos[matchIndex]?.result -
                              accountlockinfo.betInfos[matchIndex]?.choice !=
                              0 ||
                            accountlockinfo.betInfos[matchIndex]?.awardAmount > 0
                          }
                          onClick={() => onClaim(matchIndex)}
                        >
                          {lockinfo.matchInfos[matchIndex]?.result > 0 ? (
                            lockinfo.matchInfos[matchIndex]?.result.eq(
                              accountlockinfo.betInfos[matchIndex]?.choice
                            ) ? (
                              <Box
                                style={{
                                  animation:
                                    accountlockinfo.betInfos[matchIndex]
                                      .awardAmount > 0
                                      ? ""
                                      : "claimable 1s infinite",
                                  transition: "color 0.2s ease-out",
                                }}
                              >
                                {accountlockinfo.betInfos[matchIndex]
                                  .awardAmount > 0 ? (
                                  `EARNED ${(
                                    accountlockinfo.betInfos[matchIndex]
                                      .awardAmount / Math.pow(10, 18)
                                  ).toFixed(6)}
                                    $WCB`
                                ) : (
                                  <Glow>"CLAIM AWARD"</Glow>
                                )}
                              </Box>
                            ) : (
                              "YOU FAILED TO WIN THE BET"
                            )
                          ) : (
                            "RESULT NOT READY"
                          )}
                        </Button>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Panel>
              </RowLayout>
            ))}
      </Mainpage>
    </StyledContainer>
  );
};

const HomeTopBar = styled(Box)`
  padding: 36px 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 1150px) {
    padding: 36px 60px;
  }
  @media screen and (max-width: 950px) {
    padding: 36px 20px;
  }
  @media screen and (max-width: 450px) {
    padding: 36px 10px;
  }
`;

const GTableHead = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #741e47;
  backdrop-filter: blur(3.5px);
  border-radius: 10px;
  width: 100%;
  justify-content: space-between;
  padding: 17.5px 19px;
  position: relative;
  z-index: 3;
  margin-bottom: 5px;
`;
const GTableHeadItem = styled(Box)`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.103232px;
  color: #92929d;
`;

const GTableRow = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  /* background: rgba(11, 11, 16, 0.72); */
  /* background: rgba(21, 21, 33, 0.74); */
  //?background: #16182d;
  background: #ffffff0d;
  backdrop-filter: blur(3.5px);
  border-radius: 10px;
  padding: 16.5px 19px;
  position: relative;
  z-index: 3;
  width: 100%;
  justify-content: space-between;
  margin: 5.5px 0;
  > div:last-child {
    margin: 0 !important;
  }
`;
const GTableRowItem = styled(Box)`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 162%;
  letter-spacing: 0.103232px;
  color: #b5b5be;
  margin: 0 20px 0 0;
  /* padding: 0 20px; */
  ${(props) => {
    if (props.dotafter === "red")
      return "::after { content: ''; background-color: #ff5050; width: 10px; height: 10px; border: 0; border-radius: 10px; display: inline-block; margin-left: 10px; }";
    if (props.dotafter === "blue")
      return "::after { content: ''; background-color: #50b5ff; width: 10px; height: 10px; border: 0; border-radius: 10px; display: inline-block; margin-left: 10px; }";
  }}
`;

const Label = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 30px;

  color: #e5e5e5;
  margin: 0 0 37px 0;
  @media screen and (max-width: 700px) {
    margin-bottom: 20px;
  }
`;

const LogoSVG = styled(Box)`
  background: url("/logo.png");
  background-size: 100% 100%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 650px) {
    background: url("/logo.png");
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
  }
  filter: drop-shadow(0px 0px 1px rgba(255, 255, 255, 1));
`;

const Flag = styled(Box)`
  background-size: 100% 100%;
  margin: 5px;
  width: 120px;
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 1150px) {
    background-size: 100% 100%;
    width: 60px;
    height: 36px;
  }
`;

const RewardPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #9ca0d2;
`;

const InputField = styled(Box)`
  display: flex;
  > input {
    background: transparent;
    border: none;
    width: calc(100% - 64px);
    font-family: "Poppins";
    padding: 11px 16px;
  }
  border: 2px solid #9ca0d2;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 384px;
  margin-right: 16px;
  height: 50px;
  :focus-within {
    border-color: white;
  }
`;

const InputPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    > div {
      max-width: 100%;
      margin: 0;
    }
    > button {
      margin-top: 8px;
      width: 100%;
    }
  }
`;

const InfoPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #9ca0d2;
  > div:nth-child(1) > div {
    display: flex;
    margin: 0.5rem 0;
    font-size: 16px;
  }
  @media screen and (max-width: 550px) {
    flex-direction: column;
    align-items: unset;
    > div:nth-child(2) {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      > div:nth-child(2) {
        margin-right: 16px;
      }
    }
  }
`;

const ButtonGroup = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 24px 0;
  > button {
    margin: 0.25rem 0.5rem 0.25rem 0;
    font-size: 15px;
    font-weight: 500;
    background-color: #2c2f4c;
    color: white !important;
    border: 0;import { BigNumber } from 'ethers';
import { BigNumber } from 'ethers';


    border-radius: 10px;
    :hover:not([disabled]) {
      background: #0047ffb2;
    }
    transition: all 0.3s;
    padding: 12px 24px;
  }
  > button:nth-child(${({ active }) => active}) {
    background: #0047ff;
    :hover {
      :hover:not([disabled]) {
        background: #0047ff;
      }
    }
  }
`;

const RowLayout = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ColumnLayout = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Mainpage = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    width: 100%;
    max-width: 1150px;
    justify-content: space-between;
    @media screen and (max-width: 1150px) {
      flex-direction: column;
      align-items: center;
      > div:nth-child(1) {
        /* margin-bottom: 24px; */
      }
      > div {
        max-width: 650px;
      }
    }
  }
`;

const StyledContainer = styled(Box)`
  min-height: 100vh;
  width: 100vw;
  text-shadow: #741e47 0 0 6px;
`;

const Background = styled(Box)`
  width: 100vw;
  min-height: 100vh;
  /* background-image: url("/background.png"); */
  /* background-image: url("/background2.png"); */
  background-image: url("/form-1.jpg");
  /* background-image: url("/single-column-leaderboard.jpg"); */
  /* background-image: url("/Stadium2.webp"); */
  /* background-image: url("/Stadium3.jpg");  */
  /* background-image: url("/world-clocks.jpg"); */
  /* filter: blur(4px) grayscale(0); */
  /* filter: brightness(0.9); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Panel = styled(Box)`
  padding: 3rem;
  border-radius: 2rem;
  border: 1px solid white;
  //background: #16182ddd;
  /* background: #11364CD0; */
  //background: #56182dcc;
  background: #00000030;
  /* box-shadow: 0 -4px 0 0 #eee, 0 4px 0 0 #111; */
  /* box-shadow:0 0 10px 4px #0000FF , 0 0 20px 30px #008000, 30px 0 20px 30px #FF1493, -30px -30px 20px 30px #FF4500; */
  width: 100%;
  @media screen and (max-width: 615px) {
    padding: 2rem 1.5rem;
  }
  margin: 20px;
  &:hover {
    /* transform: scale(1.05); */
    /* transform: translate(0px, -20px); */
    /* animation-play-state: paused; */
  }
  transition: all 0.2s ease-out;
`;

const WinText = styled.span`
  margin: 100px 0;
  background: linear-gradient(
    80deg,
    #4c249f -50%,
    #17e1fd 20%,
    #ff77e1 40%,
    #0047ff 70%,
    #77ffb0 90%,
    #fff177
  );
  -webkit-background-clip: text;
  background-size: 200% auto;
  animation: cycleBackgroundPos 2s steps(100) infinite;
  -webkit-text-fill-color: transparent;
  font-size: 44px;
  @media screen and (max-width: 950px) {
    font-size: 36px;
  }
  @media screen and (max-width: 550px) {
    font-size: 30px;
  }
  @media screen and (max-width: 450px) {
    font-size: 24px;
  }
  font-weight: 800;
  display: flex;
  justify-content: center;
  @keyframes cycleBackgroundPos {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;

const Glow = styled(Box)`
  animation: glow 0.5s ease-in-out infinite alternate;
  @keyframes glow {
    from {
      text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #e60073, 0 0 8px #e60073,
        0 0 10px #e60073, 0 0 12px #e60073, 0 0 14px #e60073;
    }
    to {
      text-shadow: 0 0 4px #fff, 0 0 6px #ff4da6, 0 0 8px #ff4da6,
        0 0 10px #ff4da6, 0 0 12px #ff4da6, 0 0 14px #ff4da6, 0 0 16px #ff4da6;
    }
  }
`;

const Trophy = styled(Box)`
  background-image: url(/trophy.png);
  background-position: center;
  width: 100px;
  height: 100px;
  align-self: center;
`;
const Ball = styled(Box)`
  background-image: url(/ball2022.png);
  background-position: center;
  background-size: 100%;
  width: 100px;
  height: 100px;
  align-self: center;
`;

export default Home;
