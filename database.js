// Initialize empty user database if not exists
(function(){
    const USERS_KEY = 'pictorgram_users';
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
})();
