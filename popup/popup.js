const config = {
    url: null,
    key: null,
};

const baseLi = document.querySelector("li").cloneNode(true);

function debounce(func, timeout = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

function getSearchInputValue() {
    const input = document.querySelector("input");
    return input.value;
}

function getUrl() {
    const value = getSearchInputValue();
    if (!value) return;
    if (isNaN(value))
        return `${config.url}/issues/?jql=text%20~%20%${value}%22`;
    return `${config.url}/browse/${config.key}-${value}`;
}

function onGoClick(e) {
    e.preventDefault();
    window.open(getUrl(), "_blank");
}

function processHistory(visitItems) {
    const urlBank = {};
    visitItems.forEach((item) => {
        urlBank[item.url] = item.title;
    });
    updateList(urlBank);
}

function updateList(urlBank) {
    const list = document.querySelector("ul");
    list.innerHTML = "";
    Object.keys(urlBank).forEach((url) => {
        const li = baseLi.cloneNode(true);
        const a = li.children[0];
        a.href = url;
        a.textContent = urlBank[url];
        list.appendChild(li);
    });
}

function updateRecentList(searchValue = "") {
    chrome.history.search(
        {
            text: `"${config.url}/browse/${config.key}-" ${searchValue}`,
            maxResults: 50,
        },
        processHistory
    );
}

function updateSearch() {
    const value = getSearchInputValue();
    if (!value || value.length < 3) updateRecentList();
    else updateRecentList(value);
}


document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.sync.get(
        { url: null, key: null },
        function ({ url, key}) {
            config.url = url;
            config.key = key;
            if (!url || !key) chrome.runtime.openOptionsPage();
            else updateRecentList()
        }
    );
});

const form = document.querySelector("form");
form.addEventListener("submit", onGoClick);

const searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", updateSearch);
searchInput.focus();
