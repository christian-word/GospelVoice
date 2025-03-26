<script>
    const BIN_ID = "67e333528960c979a5786adb";
    const API_KEY = "$2a$10$mDDT3WulGYrn5/gO1Alh1ebqf17XN/YTDPO3xAwVt3qAqxoEaK1Uq";
    const API_WRITE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    async function sendVisitData() {
        try {
            let ipResponse = await fetch("https://api64.ipify.org?format=json");
            let ipData = await ipResponse.json();
            let userIP = ipData.ip || "Не удалось получить IP";

            let userInfo = {
                ip: userIP,
                browser: navigator.userAgent,
                time: new Date().toLocaleString(),
                referrer: document.referrer || "Прямой заход",
                screen: `${screen.width}x${screen.height}`
            };

            let response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: { "X-Master-Key": API_KEY }
            });

            let json = await response.json();
            let data = json.record || { visits: 0, users: [] };

            data.visits++;
            data.users.push(userInfo);

            await fetch(API_WRITE_URL, {
                method: "PUT",
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Ошибка сбора данных:", error);
        }
    }

    sendVisitData();
</script>
