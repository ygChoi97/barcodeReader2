import React, { useState } from 'react'
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material'

const useConfirm = () => {
    const [openYN, setOpenYN] = useState(false);
    const [openOK, setOpenOK] = useState(false);
    const [resolver, setResolver] = useState({ resolver: null })
    const [label, setLabel] = useState('')

    const createPromise = () => {
        let resolver;
        return [new Promise((resolve, reject) => {

            resolver = resolve
        }), resolver]
    }
    const getConfirmationYN = async (text) => {
        setLabel(text);
        setOpenYN(true);
        const [promise, resolve] = await createPromise()
        setResolver({ resolve })
        return promise;
    }

    const getConfirmationOK = async (text) => {
        setLabel(text);
        setOpenOK(true);
        const [promise, resolve] = await createPromise()
        setResolver({ resolve })
        return promise;
    }

    const onClickYN = async (status) => {
        setOpenYN(false);
        resolver.resolve(status)
    }

    const onClickOK = async (status) => {
        setOpenOK(false);
        resolver.resolve(status)
    }

    const ConfirmationYN = () => (
        <Dialog open={openYN}>
            <DialogContent>
                {label}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClickYN(true)}> 예 </Button>
                <Button onClick={() => onClickYN(false)}> 아니오 </Button>
            </DialogActions>
        </Dialog>
    )

    const ConfirmationOK = () => (
        <Dialog open={openOK}>
            <DialogContent>
                {label}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClickOK(true)}> 확인 </Button>
            </DialogActions>
        </Dialog>
    )

    return [getConfirmationYN, ConfirmationYN, getConfirmationOK, ConfirmationOK]

}

export default useConfirm;