/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

function TopBar({ setNotification }) {
  const menus = [
    /*"Dashboard", "Staking", "History"*/
  ];

  const sm = useMediaQuery("(max-width : 500px)");
  const xs = useMediaQuery("(max-width : 450px)");
  const mw650 = useMediaQuery("(max-width : 650px)");
  const mw950 = useMediaQuery("(max-width : 950px)");
  const mw1150 = useMediaQuery("(max-width : 1150px)");

  return (
    <>
      <StyledContainer>
        <Box>
          <Box display={"flex"} flex-direction={"row"}>
            <LogoSVG
              style={{
                filter: "drop-shadow(0px 0px 1px rgba(255, 255, 255, 1))",
              }}
            ></LogoSVG>
            <Box
              ml={mw950 ? "0px" : mw1150 ? "10px" : "20px"}
              fontSize={mw650 ? "20px" : mw950 ? "24px" : "36px"}
              fontWeight="800"
              textAlign={"center"}
              width={mw950 ? "min-content" : "fit-content"}
              whiteSpace={"nowrap"}
              display={"flex"}
              alignItems={"center"}
            >
              WORLD CUP BET
            </Box>
          </Box>
          <Menus>
            {menus.map((data, i) => {
              return (
                <Link key={i} to={`/${data.toLowerCase()}`}>
                  {data}
                </Link>
              );
            })}
            {/* <ConnectMenu setNotification={setNotification} /> */}
          </Menus>
          <ConnectMenu setNotification={setNotification} />
        </Box>
      </StyledContainer>
    </>
  );
}

const Menus = styled(Box)`
  display: flex;
  align-items: center;
  > a {
    color: white;
    transition: all 0.3s;
    :hover {
      color: #2c64f7;
    }
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
  }
  width: 100%;
  max-width: 500px;
  justify-content: space-between;
  @media screen and (max-width: 500px) {
    max-width: 270px;
    > a {
      font-size: 15px;
    }
  }
`;

const LogoSVG = styled(Box)`
  background: url("/logo.png");
  background-size: 100% 100%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 650px) {
    background: url("/logo.png");
    background-size: 100% 100%;
    width: 50px;
    height: 50px;
  }
`;

const StyledContainer = styled(Box)`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    display: flex;
    justify-content: space-between;
    max-width: 1800px;
    width: 100%;
    padding: 0 12px;
    align-items: center;
  }
  width: 100%;
  position: fixed;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 5px rgb(0 0 0 / 11%);
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

export default TopBar;
