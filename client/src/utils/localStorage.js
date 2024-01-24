export const saveUserDataToLocalStorage = (userData) => {
    try {
        const serializedUserData = JSON.stringify(userData);
        localStorage.setItem('userData', serializedUserData);
    } catch (error) {
        console.log(error);
    }
};

export const loadUserDataFromLocalStorage = () => {
    try {
        const serializedUserData = localStorage.getItem('userData');
        if (serializedUserData === null) {
            return undefined;
        }
        return JSON.parse(serializedUserData);
    } catch (err) {
        return undefined;
    }
};
