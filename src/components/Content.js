import { Grid, InputLabel, ListItem, MenuItem, Select, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from "react";

function Content({ item, update }) {

    const [value, setValue] = useState(null);

    useEffect(() => {
        if (item.dbColumn === 'introductiondate' && item.data != null) {

            setValue(new Date(item.data));
        }
        else if (item.dbColumn === 'introductiondate' && (item.data === null || item.data === '')) {
            setValue(null);
        }
    }, [item.data]);



    const theme = createTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        // palette: {
        //     primary: {
        //       main: purple[500],
        //     },
        //     secondary: {
        //       main: blueGrey[400],
        //     },
        //   },

    });

    const handleChangeInput = (e) => {
        console.log(e.target.value);
        // const copyItem = item;
        // copyItem.data = e.target.value;
        item.data = e.target.value;
        console.log(item)
        update(item);
    };

    console.log(`${item.dbColumn} ${value} 리랜더링`);
    const color = "#399939";

    return (
        <ListItem
            sx={{
                height: 31
            }}
        >

            <Grid container spacing={1} alignItems="center" textAlign='right'>
                <ThemeProvider theme={theme}>
                    <Grid item xs={3}>
                        <Typography
                            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        >
                            {item.columnName}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        {item.req === 'y' ?
                            item.dbColumn === 'idasset' ?
                                <TextField
                                    // placeholder={item.value}
                                    fullWidth
                                    id="standard-read-only-input"
                                    // label={item.columnName}
                                    InputProps={{
                                        // readOnly: true,
                                        style: { height: '1rem', fontSize: '0.9rem', fontWeight: 600 }
                                    }}
                                    defaultValue={''}
                                    variant="standard"
                                    value={item.data}
                                    size="small"
                                    color="secondary"
                                    onChange={handleChangeInput}
                                    focused
                                />
                                :
                                item.dbColumn === 'introductiondate' ?
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker value={value} inputFormat={"YYYY-MM-DD"} showToolbar
                                            onChange={(newValue) => {
                                                setValue(newValue);

                                                if (newValue != null) {
                                                    item.data = newValue.format("YYYY-MM-DD");
                                                    update(item);
                                                    console.log(newValue);
                                                }
                                                else
                                                    item.data = null;
                                            }}
                                            renderInput={(params) => <TextField size="small" {...params}
                                                sx={{
                                                    width: 1,
                                                    "& .MuiInputBase-root": {
                                                        height: '1.6rem', fontSize: '0.7rem'
                                                    }
                                                }}
                                            />}
                                        />
                                    </LocalizationProvider>
                                    :
                                    <TextField
                                        fullWidth
                                        requierd='true'
                                        id="outlined-required"
                                        //label={item.columnName}
                                        inputProps={{ style: { height: 9, fontSize: '1rem', fontWeight: 400 } }}
                                        defaultValue=''
                                        value={item.data}
                                        onChange={handleChangeInput}
                                        size="small"
                                    />
                            :
                            item.dbColumn == 'uptake' ?
                            <>
                            
                                <Select
                                    defaultValue=''
                                    value={item.data|| ''}
                                    onChange={handleChangeInput}                             
                                    sx={{width: 1, height: '1.6rem', fontSize: '0.7rem', textAlign:'left'}}
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"사용"}>사용</MenuItem>
                                    <MenuItem value={"미사용"}>미사용</MenuItem>
                                    <MenuItem value={"매각대기"}>매각대기</MenuItem>
                                    <MenuItem value={"매각"}>매각</MenuItem>
                                </Select>
                            </>  
                            :
                            item.dbColumn == 'area' ?
                            <>
                            
                                <Select
                                    defaultValue=''
                                    value={item.data|| ''}
                                    onChange={handleChangeInput}                             
                                    sx={{width: 1, height: '1.6rem', fontSize: '0.7rem', textAlign:'left'}}
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"남양"}>남양</MenuItem>
                                    <MenuItem value={"마북"}>마북</MenuItem>
                                    <MenuItem value={"의왕"}>의왕</MenuItem>
                                    <MenuItem value={"광명"}>광명</MenuItem>
                                    <MenuItem value={"화성"}>화성</MenuItem>
                                    <MenuItem value={"광주"}>광주</MenuItem>
                                    <MenuItem value={"전주"}>전주</MenuItem>
                                    <MenuItem value={"울산"}>울산</MenuItem>
                                    <MenuItem value={"아산"}>아산</MenuItem>
                                    <MenuItem value={"본사"}>본사</MenuItem>
                                    <MenuItem value={"대치"}>대치</MenuItem>
                                    <MenuItem value={"삼성"}>삼성</MenuItem>
                                    <MenuItem value={"판교"}>판교</MenuItem>
                                    <MenuItem value={"원효로"}>원효로</MenuItem>
                                    <MenuItem value={"대방"}>대방</MenuItem>
                                    <MenuItem value={"기타"}>기타</MenuItem>
                                </Select>
                            </>                              :                           
                            <TextField
                                //placeholder={item.value}
                                fullWidth
                                id="standard-basic"
                                inputProps={{ style: { height: 9, fontSize: '0.7rem', fontWeight: 400 } }}
                                //label={item.columnName}
                                defaultValue=''
                                value={item.data}
                                onChange={handleChangeInput}
                                sx={{
                                    width: 1,
                                    "& .MuiInputBase-root": {
                                        height: '1.6rem'
                                    }
                                }}
                            />}
                    </Grid>
                </ThemeProvider>
            </Grid>
        </ListItem>
    );
}

export default Content;