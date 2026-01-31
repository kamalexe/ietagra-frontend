import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import { getAccounts, switchAccount, removeAccount, removeToken, registerAccount } from '../../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';

const AccountSwitcher = ({ currentUser }) => {
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchAccounts = () => {
        const accs = getAccounts();
        console.log("AccountSwitcher: fetched accounts:", accs);
        setAccounts(accs);
    };

    useEffect(() => {
        fetchAccounts();
        window.addEventListener('storage', fetchAccounts);
        window.addEventListener('accounts-updated', fetchAccounts);
        return () => {
            window.removeEventListener('storage', fetchAccounts);
            window.removeEventListener('accounts-updated', fetchAccounts);
        };
    }, []);

    // Self-healing: if currentUser is loaded but not in accounts list, trigger a sync
    useEffect(() => {
        if (currentUser && currentUser.email && accounts.length > 0) {
            const found = accounts.find(a => a.email === currentUser.email);
            if (!found) {
                console.log("AccountSwitcher: Current user missing from list, triggering registration check in parent");
                // We can't easily get the token here, so we rely on parent. 
                // But we can force a fetch in case it just updated.
                fetchAccounts();
            }
        }
    }, [currentUser, accounts.length]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSwitch = (email) => {
        if (email === currentUser?.email) {
            handleClose();
            return;
        }
        const success = switchAccount(email);
        if (success) {
            window.location.reload();
        }
    };

    const handleAddAccount = () => {
        removeToken();
        navigate('/login');
    };

    const handleRemoveAccount = (email, e) => {
        e.stopPropagation();
        removeAccount(email);
        // fetchAccounts is called by event listener
        if (email === currentUser?.email) {
            removeToken();
            navigate('/login');
        }
    };

    const otherAccounts = accounts.filter(acc => acc.email !== currentUser?.email);

    return (
        <Box className="px-4 py-2 border-t border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md mb-2">
            <div
                role="button"
                onClick={handleClick}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer w-full"
            >
                <Avatar
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '1rem' }}
                    alt={currentUser?.name}
                >
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                </Avatar>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                    <Typography variant="subtitle2" className="font-bold truncate text-gray-900 dark:text-white capitalize">
                        {currentUser?.name || "User"}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400 truncate block">
                        {currentUser?.user_type === 1 ? 'Admin' : currentUser?.user_type === 2 ? 'Student' : currentUser?.user_type === 3 ? 'Teacher' : 'Staff'}
                    </Typography>
                </div>
                <SwapHorizIcon fontSize="small" className="text-gray-500" />
            </div>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        width: 280,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 0,
                            left: 20,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
                {currentUser && (
                    <>
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Current Account
                        </div>
                        <MenuItem selected>
                            <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.9rem', bgcolor: 'primary.main' }}>
                                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-semibold truncate capitalize">{currentUser?.name}</span>
                                <span className="text-xs text-gray-500 truncate">{currentUser?.email}</span>
                            </div>
                            <CheckIcon fontSize="small" color="primary" />
                        </MenuItem>
                        <Divider sx={{ my: 1 }} />
                    </>
                )}

                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Other Accounts
                </div>

                {otherAccounts.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-400 italic">
                        No other accounts logged in
                    </div>
                ) : (
                    otherAccounts.map((acc) => (
                        <MenuItem
                            key={acc.email}
                            onClick={() => handleSwitch(acc.email)}
                            sx={{ justifyContent: 'space-between', py: 1 }}
                        >
                            <div className="flex items-center flex-1 overflow-hidden">
                                <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.9rem' }}>
                                    {acc.name ? acc.name.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium truncate capitalize">{acc.name}</span>
                                    <span className="text-xs text-gray-500 truncate">{acc.email}</span>
                                </div>
                            </div>
                            <Tooltip title="Remove account">
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleRemoveAccount(acc.email, e)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </MenuItem>
                    ))
                )}

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleAddAccount} sx={{ py: 1.5, color: 'primary.main' }}>
                    <AddIcon fontSize="small" className="mr-2" />
                    <span className="font-medium">Add another account</span>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AccountSwitcher;
