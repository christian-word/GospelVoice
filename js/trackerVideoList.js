const BIN_ID = "67e43b7f8561e97a50f3668e";  
const API_KEY = "$2a$10$foT8lIkBZ.MYNt758MsuJuBvxxI750/hg4QyQXX.Q7b2vu/G0/irm";  
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

        console.log("Отправка запроса в JSONBin...");
        console.log("API URL:", API_WRITE_URL);
        console.log("API Key:", API_KEY);
        console.log("Запрос на обновление данных:", JSON.stringify(data));

        let updateResponse = await fetch(API_WRITE_URL, {
            method: "PUT",
            headers: {
                "X-Master-Key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let updateResult = await updateResponse.json();
        console.log("Ответ от JSONBin:", updateResult);

    } catch (error) {
        console.error("Ошибка сбора данных:", error);
    }
}

sendVisitDat
