
const AccountSwitcher = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        setAccounts(getAccounts());
    }, []);

    const handleSwitch = (email) => {
        if (switchAccount(email)) {
            window.location.reload();
        }
    };

    if (accounts.length === 0) return <p className="text-xs text-gray-400 px-3 py-1">No other accounts</p>;

    return (
        <div className="space-y-1 mt-1">
            {accounts.map((acc, idx) => (
                <button
                    key={idx}
                    onClick={() => handleSwitch(acc.email)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {acc.name ? acc.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 leading-none">{acc.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{acc.email}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};
