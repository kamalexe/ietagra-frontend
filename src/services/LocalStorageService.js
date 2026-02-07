const ACCOUNT_LIST_KEY = 'iet_accounts';
const DEVICE_ID_KEY = 'iet_device_id';

const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

const storeToken = (value) => {
  if (value) {
    // console.log("Store Token", value)
    if (typeof value === 'string') {
      localStorage.setItem('access_token', value)
    } else {
      const access = value.access || value.access_token
      const refresh = value.refresh || value.refresh_token
      if (access) localStorage.setItem('access_token', access)
      if (refresh) localStorage.setItem('refresh_token', refresh)
    }
  }
}

const getToken = () => {
  let access_token = localStorage.getItem('access_token')
  let refresh_token = localStorage.getItem('refresh_token')
  return { access_token, refresh_token }
}

const removeToken = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// --- Account Switching Logic ---

const getAccounts = () => {
  try {
    const accounts = localStorage.getItem(ACCOUNT_LIST_KEY);
    return accounts ? JSON.parse(accounts) : [];
  } catch (e) {
    return [];
  }
};

const registerAccount = (token, userData) => {
  if (!token || !userData || !userData.email) return;

  // Ensure we have a valid access token
  const accessToken = typeof token === 'string' ? token : (token.access_token || token.access);
  if (!accessToken) return;

  const accounts = getAccounts();
  const existingIndex = accounts.findIndex(acc => acc.email === userData.email);

  const newAccount = {
    email: userData.email,
    name: userData.name,
    user_type: userData.user_type,
    token: token, // Store the full token object or string
    last_active: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    accounts[existingIndex] = newAccount;
  } else {
    accounts.push(newAccount);
  }

  localStorage.setItem(ACCOUNT_LIST_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event('accounts-updated'));
};

const switchAccount = (email) => {
  const accounts = getAccounts();
  const targetAccount = accounts.find(acc => acc.email === email);

  if (targetAccount) {
    storeToken(targetAccount.token);
    return true;
  }
  return false;
};

const removeAccount = (email) => {
  // Remove from list
  const accounts = getAccounts().filter(acc => acc.email !== email);
  localStorage.setItem(ACCOUNT_LIST_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event('accounts-updated'));
};

export { storeToken, getToken, removeToken, getAccounts, registerAccount, switchAccount, removeAccount, getDeviceId }