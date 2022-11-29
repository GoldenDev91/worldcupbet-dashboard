/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

import { SSL_ADDR, SSL_LOCK } from "../abis/address";
import TokenABI from "../abis/GroveToken.json";
import LockABI from "../abis/LockABI.json";
import { useAddress, useWeb3Context } from "../context/web3Context";
import { multicall } from "../utils/contracts";
import { WORKING_NETWORK_ID } from "./../abis/address";

const defaultVal = {
  lockinfo: {},
  lockallow: false,
  accountlockinfo: {},
  accounthistory: [],
  fetchLockData: () => {},
  fetchAccountLockData: () => {},
  fetchAccountHistory: () => {},
  fetchAllowance: () => {},
};

export const LockInfoContext = React.createContext(defaultVal);

export default function useLockInfo() {
  return React.useContext(LockInfoContext);
}
let timerid = null,
  // historyTimer = null,
  lockid = null;
export function LockInfoProvider({ children }) {
  const account = useAddress();
  const [lockinfo, setLockInfo] = useState({});
  const [accountlockinfo, setAccountLockInfo] = useState({});
  const [accounthistory, setAccountHistory] = useState({});
  const [lockallow, setLockAllow] = useState(false);

  const { chainID } = useWeb3Context();

  async function fetchLockData() {
    try {
      let calls = [
        {
          address: SSL_LOCK[chainID],
          name: "matchCount",
          params: [],
        },
        {
          address: SSL_LOCK[chainID],
          name: "totalBetAmount",
          params: [],
        },
        {
          address: SSL_LOCK[chainID],
          name: "totalAwardAmount",
          params: [],
        },
      ];
      const result = await multicall(LockABI, calls, chainID);
      console.log("globalResult", result);
      calls = [];
      for (let i = 0; i < result[0][0]; i++) {
        calls.push({
          address: SSL_LOCK[chainID],
          name: "matchInfos",
          params: [i],
        });
        calls.push({
          address: SSL_LOCK[chainID],
          name: "getChoiceCounts",
          params: [i],
        });
      }
      const result1 = await multicall(LockABI, calls, chainID);
      console.log(result1);
      let matchInfos = [];
      for (let i = 0; i < result[0][0]; i++) {
        const info = {
          team1: result1[i * 2][0],
          team2: result1[i * 2][1],
          time: result1[i * 2][2],
          level: result1[i * 2][3],
          result: result1[i * 2][4],
          betAmount: result1[i * 2][5],
          awardAmount: result1[i * 2][6],
          team1AwardRate: result1[i * 2][7],
          team2AwardRate: result1[i * 2][8],
          drawAwardRate: result1[i * 2][9],
        };
        matchInfos.push({
          ...info,
          choiceCounts: [
            result1[i * 2 + 1][0],
            result1[i * 2 + 1][1],
            result1[i * 2 + 1][2],
            result1[i * 2 + 1][3],
          ],
        });
      }
      console.log(matchInfos);
      const temp = {
        matchCount: result[0][0],
        totalBetAmount: result[1][0],
        totalAwardAmount: result[2][0],
        matchInfos: matchInfos,
      };
      console.log("temp :>> ", temp);

      setLockInfo(temp);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAccountLockData() {
    if (Object.keys(lockinfo).length === 0) return;
    try {
      let calls = [];
      for (let i = 0; i < lockinfo.matchCount; i++) {
        calls.push({
          address: SSL_LOCK[chainID],
          name: "getChoice",
          params: [i, account],
        });
        calls.push({
          address: SSL_LOCK[chainID],
          name: "getBetAmount",
          params: [i, account],
        });
        calls.push({
          address: SSL_LOCK[chainID],
          name: "getAwardAmount",
          params: [i, account],
        });
      }

      const result = await multicall(LockABI, calls, chainID);
      console.log(result);
      let betInfos = [];
      let totalBet = BigNumber.from("0");
      let totalAward = BigNumber.from("0");
      for (let i = 0; i < lockinfo.matchCount; i++) {
        const info = {
          choice: result[i * 3][0],
          betAmount: result[i * 3 + 1][0],
          awardAmount: result[i * 3 + 2][0],
        };
        totalBet += info.betAmount;
        totalAward += info.awardAmount;
        betInfos.push(info);
      }
      const temp = {
        totalBet: totalBet,
        totalAward: totalAward,
        betInfos: betInfos,
      };
      console.log("acountlockinfo", temp);
      setAccountLockInfo(temp);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAccountHistory() {
    try {
      if (accountlockinfo.maxId === 0) return;
      let calls = [];
      for (let i = 0; i < accountlockinfo.maxId; i++) {
        calls[i] = {
          address: SSL_LOCK[chainID],
          name: "stakeInfos",
          params: [account, i],
        };
      }

      const result = await multicall(LockABI, calls, chainID);
      const tmp = [];
      for (let i = 0; i < accountlockinfo.maxId; i++) {
        tmp[i] = {
          amount: result[i][0],
          timestamp: result[i][1],
          isDeposit: result[i][2],
        };
      }
      console.log("accounthistory", tmp);
      setAccountHistory(tmp);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAllowance() {
    try {
      let calls = [
        {
          name: "allowance",
          address: SSL_ADDR[chainID],
          params: [account, SSL_LOCK[chainID]],
        },
      ];
      const result = await multicall(TokenABI, calls, chainID);
      setLockAllow(result[0][0] > ethers.utils.parseUnits("10000", 4));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (chainID !== WORKING_NETWORK_ID) return;
    fetchLockData();
    if (lockid) clearInterval(lockid);
    lockid = setInterval(() => {
      fetchLockData();
    }, 20000);
  }, [chainID]);

  useEffect(() => {
    if (chainID !== WORKING_NETWORK_ID) return;
    if (!account) return;
    fetchAccountLockData();
    fetchAllowance();
    if (timerid) clearInterval(timerid);
    timerid = setInterval(() => {
      fetchAccountLockData();
      fetchAllowance();
    }, 20000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainID, lockinfo.matchCount]);

  // useEffect(() => {
  //   if (chainID !== WORKING_NETWORK_ID) return;
  //   if (!account) return;
  //   fetchAccountHistory();
  //   if (historyTimer) clearInterval(historyTimer);
  //   historyTimer = setInterval(() => {
  //     fetchAccountHistory();
  //   }, 20000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account, accountlockinfo.maxId]);

  return (
    <LockInfoContext.Provider
      value={{
        lockinfo: lockinfo,
        lockallow,
        accountlockinfo: accountlockinfo,
        accounthistory: accounthistory,
        fetchLockData,
        fetchAccountLockData,
        fetchAccountHistory,
        fetchAllowance,
      }}
      children={children}
    />
  );
}
