function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get(
        {
            url: null,
            key: null,
        },
        function ({ url, key }) {
            document.getElementById("url").value = url;
            document.getElementById("key").value = key;
        }
    );
}

function save_options(e) {
    e.preventDefault();
    var url = document.getElementById("url").value;
    var key = document.getElementById("key").value;
    console.log(url, key)
    chrome.storage.sync.set(
        {
            url,
            key,
        },
        function () {
            // Update status to let user know options were saved.
            var status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(function () {
                status.textContent = "";
            }, 750);
        }
    );
}

document.addEventListener("DOMContentLoaded", restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);
document.getElementById('save').addEventListener('click',
    save_options);
