import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { TextField } from '@mui/material';

import { TokenList } from '../utils/constants';
import { useEffect } from 'react';

export default function PayoutList(props) {
    const [payoutToken, setPayoutToken] = React.useState(0);
  
    const handleChange = (event) => {
      // setPayoutToken(event.target.value);
      const index = event.target.value;
      const tokenAddress = TokenList[index].address;
      props.updatePayoutToken(tokenAddress);
    };

    // const res = TokenList.filter((item) => {
    //   item.address?.toLocaleLowerCase() === props.payoutTokenAddress?.toLocaleLowerCase()
    // })
    // if (res.length > 0) {
    //   setPayoutToken(TokenList.indexOf())
    // }

    useEffect(() => {
      console.log("[AL] PayoutList : Current Payout = ", props.payoutTokenAddress);

      const resIndex = TokenList.findIndex((item) => {
        return item.address?.toLocaleLowerCase() === props.payoutTokenAddress?.toLocaleLowerCase()
      });

      if (resIndex > -1) {
        setPayoutToken(resIndex);
      }
    }, []);
  
    return (
      <Box sx={{ minWidth: 160 }}>
        <FormControl fullWidth>
          {/* <InputLabel id="demo-simple-select-label">Token</InputLabel> */}
          <TextField select variant={"outlined"} style={{width: "100%"}} value={payoutToken}
            onChange={handleChange}
          >
              {
                  TokenList.map((item, index) => {
                      return (
                          <MenuItem key={index} value={index} >
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <img src={item.logo} style={{width:"24px", marginRight:"12px"}}/>
                                <div>{item.name}</div>
                            </div>
                          </MenuItem>
                      );
                  })
              }
          </TextField>
          {/* <Select
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
              {
                  TokenList.map((item, index) => {
                      return (
                          <MenuItem value={index} >
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <img src={item.logo} style={{width:"24px", marginRight:"12px"}}/>
                                <div>{item.name}</div>
                            </div>
                          </MenuItem>
                      );
                  })
              }
          </Select> */}
        </FormControl>
      </Box>
    );
  }
  