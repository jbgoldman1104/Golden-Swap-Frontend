import "../styles/components/homeBody.scss";
import Box from '@mui/material/Box';

import { Grid, Icon, IconButton, Input, Stack } from '@mui/material';
import logo from '../assets/logos/logo.png';
import Card from '@mui/material/Card';
import { TextField } from '@mui/material';
import { borderRadius, fontSize, margin, textAlign } from '@mui/system';
import { Button } from "@mui/material";

import { TokenList } from '../utils/constants';

import PayoutList from "./payoutList";

import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { unatomic, lemonToBNB, BNBToUSD } from "../utils/util";
import { useEffect, useState } from "react";


export default function HomeBody(props) {

    const [rate, setRate] = useState(0);

    const { library } = useWeb3React();
    const web3 = new Web3(library);

    const USDToLemon = async() => {
        let lemon, bnb, bnb1, busd
  
        let Token = new web3.eth.Contract(lemonToBNB.abi, lemonToBNB.pairAddress);
        // console.log("lemon - BNB", await Token.methods.getReserves().call());
        let result = await Token.methods.getReserves().call();
        lemon = web3.utils.toBN(result._reserve0);
        bnb = web3.utils.toBN(result._reserve1);

        if (lemon.toNumber() === 0)
            return 0; //web3.utils.toBN(0);            
  
        Token =  new web3.eth.Contract(BNBToUSD.abi, BNBToUSD.pairAddress);
        // console.log("BNB - BUSD", await Token.methods.getReserves().call());
        result = await Token.methods.getReserves().call();
        bnb1 = web3.utils.toBN(result._reserve0);
        busd = web3.utils.toBN(result._reserve1);

        if (bnb1.eq(0))
            return 0; //web3.utils.toBN(0);
        
        //lemon - usd
        // const rate = (bnb * busd) / (lemon * bnb1); //(bnb / lemon) * (busd / bnb1);
        // const rate = bnb.mul(busd).div(lemon).div(bnb1);

        // usd - lemon
        const ret = lemon.mul(bnb1).div(bnb).div(busd);
        return ret.toNumber();//rate;
    }

    useEffect(async() => {
        const val = await USDToLemon();
        setRate(val);
    }, []);

    const buttonInfoList = [
        {title:"BNB", address:"0x0000000000000000000000000000000000000000"},
        {title:"BTCB", address:"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"},
        {title:"BUSD", address:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"},
        {title:"CAKE", address:"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"},
        {title:"SHIB", address:"0x2859e4544C4bB03966803b044A93563Bd2D0DD4D"},

    ]
    
    
    
    return (
        <Stack 
            className='stack'
            spacing={2} sx={{my:3}}
        >

            <Card container="true" variant="outlined" 
                // sx={{bgcolor:'#f0f0f0'}}
                // sx={{bgcolor:'#fef400E0'}}
                style={{boxShadow: 2, 
                    // background: "linear-gradient(120deg, #a7d322F0 3.48%, #f3f5ea80 50.65%, #5c9716B0 100% )"
                    backgroundColor: '#FFFE',
                    padding: "12px 6px"
                }}
            >
                <Grid container={true} 
                    spacing={{sm : 2}}
                    columns={{xs : 6, sm : 12}}
                    justifyContent="center"
                    alignItems="top"
                    >
                    <Grid 
                        item sm={6} 
                        style={{
                            display:'flex', 
                            flexDirection:'column', // alignItems: 'center'
                            alignItems:'center',
                            minWidth: '50%'}}
                        >
                        <div
                            style={{
                            margin:'auto',
                            fontSize:'32px',
                            width:'100%'
                            }}>
                            <div style={{textAlign:"center"}}>Your Wallet</div>
                            {
                            TokenList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div 
                                        style={{
                                            display: 'flex',
                                            margin: '2px 0px'
                                        }}
                                        
                                        >
                                            <div style={{
                                                flex: "50%",
                                                fontSize: '24px',
                                                textAlign: 'right',
                                            }}>{props.walletInfo[index]}

                                            </div>
                                            <div style={{ flex: "50%", display: "flex", alignItems: "center" }}>
                                                <img src={item.logo} style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    padding: '4px',
                                                    background: '#10c005',
                                                    borderRadius: '12px',
                                                    marginLeft: '12px',
                                                }} />

                                            </div>
                                        </div>
                                        <div style={{
                                            flex: "50%",
                                            fontSize: '24px',
                                            textAlign: 'center',
                                        }}>
                                            { rate === 0 ? "$0.00" : "$" + (Number(props.walletInfo[index])/rate).toFixed(2)}
                                        </div>
                                    </div>
                                    
                                )
                            })
                            }
                        </div>

                        {/* <div style={{
                            borderTop:"1px solid #888",
                            margin:"0 24px"
                            }} /> */}

                        <div
                            style={{
                                margin:'auto',
                                fontSize:'32px',
                            }}>
                                <div style={{textAlign:'center'}}>Total Earned</div>
                                <div style={{display:'flex',
                                    margin:'2px 0px'}}>
                                    <div 
                                        style={{flex:"50%",
                                            fontSize:'24px',
                                            textAlign:'right'
                                            }}>
                                        {props.totalEarned}
                                    </div>
                                    <div style={{flex:"50%", display:"flex", alignItems:"center"}}>
                                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" style={{
                                            width:"32px",
                                            height:"32px",
                                            padding:'4px',
                                            background:'#10c005',
                                            borderRadius: '12px',
                                            marginLeft:'12px',                                               
                                            }}/>
                                    </div>
                                    
                                </div>
                                <div 
                                    style={{
                                        flex: "50%",
                                        fontSize: '24px',
                                        textAlign: 'center',}}
                                >
                                    { rate === 0 ? "$0.00" : "$" + (Number(props.totalEarned)/rate).toFixed(2)}
                                </div>
                        </div>
                        
                    </Grid>
                    
                    <Grid item sm={6} 
                        style={{
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            minWidth: '50%'}}>
                        <div style={{
                            // margin:'auto',
                            fontSize:'32px',
                            textAlign:'center'
                            }}>
                            <div>Reward Not Claimed</div>
                        </div>

                        <div style={{display:'flex',
                            margin:'2px 0px'}}>
                            <div style={{flex:"50%",
                                fontSize:'24px',
                                textAlign:'right'
                                }}>
                                {props.withdrawable}
                            </div>
                            <div style={{flex:"50%", display:"flex", alignItems:"center"}}>
                                <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" style={{
                                    width:"32px",
                                    height:"32px",
                                    padding:'4px',
                                    background:'#10c005',
                                    borderRadius: '12px',
                                    marginLeft:'12px',                                               
                                    }}/>
                            </div>
                        </div>
                        <div 
                            style={{
                                flex: "50%",
                                fontSize: '24px',
                                textAlign: 'center',
                            }}>
                            { rate === 0 ? "$0.00" : "$" + (Number(props.withdrawable)/rate).toFixed(2)}
                        </div>
                        {
                            buttonInfoList.map((item, index) => {
                                return (
                                    <Button 
                                        key = {"Button_" + index}
                                        variant="contained" color="success"
                                        style={{margin:"8px auto", width:"210px"}}
                                        onClick={() => props.claimHandler(item.address)}
                                    >
                                        {"Claim " + item.title + " Manually"}
                                    </Button>
                                );
                            })
                        }

                        {/* <Button variant="contained" color="success"
                            style={{margin:"8px auto"}}
                            onClick={() => props.claimHandler('0x0000000000000000000000000000000000000000')}
                        >
                            Claim BNB Manually
                        </Button>
                        <Button variant="contained" color="success"
                            style={{margin:"8px auto"}}
                            onClick={() => props.claimHandler('0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c')}
                        >
                            Claim BTCB Manually
                        </Button>
                        <Button variant="contained" color="success"
                            style={{margin:"8px auto"}}
                            onClick={() => props.claimHandler('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')}
                        >
                            Claim BUSD Manually
                        </Button>
                        <Button variant="contained" color="success"
                            style={{margin:"8px auto"}}
                            onClick={() => props.claimHandler('0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')}
                        >
                            Claim CAKE Manually
                        </Button>
                        <Button variant="contained" color="success"
                            style={{margin:"8px auto"}}
                            onClick={() => props.claimHandler('0x2859e4544C4bB03966803b044A93563Bd2D0DD4D')}
                        >
                            Claim SHIB Manually
                        </Button> */}
                        <div style={{padding:"8px", textAlign:'justify', padding:'0 16px'}}>
                            Rewards are automatically sent every 60 minutes. It can, however, take longer depending on your holdings and trading volume. Rewards will be triggered once they are big enough to cover the gas fees. If you are a smaller holder it may take from a couple hours to a few days for rewards to appear in your wallet. You can also manually claim unclaimed rewards, but you will need to pay the gas fees.
                        </div>
                        
                        {/* <div class='title'>Reward Not Claimed</div> */}
                        
                    </Grid>
                </Grid>
            </Card>

            <Card container="true" variant="outlined"
                style={{boxShadow: 2, 
                    // background: "linear-gradient(120deg, #a7d322F0 3.48%, #f3f5ea80 50.65%, #5c9716B0 100% )"
                    backgroundColor: '#FFFE',
                    padding: "12px 6px"
                }}
            >
                <Grid container={true} spacing={2}>
                    <Grid item xs={12} style={{
                        display:'flex', 
                        flexDirection:'column',
                        // alignItems: 'center'
                         }}>
                        <div style={{
                            margin:'auto',
                            fontSize:'32px',
                            }}>
                            <div style={{textAlign:"center", padding:"16px"}}
                            >Reward Distributed To Holders</div>
                            <div style={{display:'flex',
                                alignItems:"center",
                                justifyContent:"center",
                                margin:'2px 0px'}}>
                                <div style={{
                                    fontSize:'24px',
                                    textAlign:'right'
                                    }}>{props.totalDividend}</div>
                                <div style={{display:"flex", alignItems:"center"}}>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" style={{
                                        width:"32px",
                                        height:"32px",
                                        padding:'4px',
                                        background:'#10c005',
                                        borderRadius: '12px',
                                        marginLeft:'12px',                                               
                                        }}/>
                                </div>
                                
                            </div>
                            <div 
                                style={{
                                    flex: "50%",
                                    fontSize: '24px',
                                    textAlign: 'center',
                                }}>
                                { rate === 0 ? "$0.00" : "$" + (Number(props.totalDividend)/rate).toFixed(2)}
                            </div>
                        </div>                                          
                    </Grid>
                </Grid>
            </Card>
        </Stack>
    );
}
