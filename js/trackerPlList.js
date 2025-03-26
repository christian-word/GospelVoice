<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сбор сведений</title>
  
</head>
<body>
    <h1>Сбор сведений</h1>
  <script>
 const BIN_ID = "67e438968561e97a50f364f7";
 const API_KEY = "$2a$10$foT8lIkBZ.MYNt758MsuJuBvxxI750/hg4QyQXX.Q7b2vu/G0/irm";

async function sendVisitData() {
    try {
        // 1. Получаем IP и геолокацию
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip || "Неизвестно";

        // Геоданные (используем бесплатный ipapi.co)
        let geoData = { country: "Неизвестно", city: "Неизвестно" };
        try {
            const geoResponse = await fetch(`https://ipapi.co/${userIP}/json/`);
            geoData = await geoResponse.json();
        } catch (e) {
            console.log("Не удалось получить геоданные:", e);
        }

        // 10. Отслеживаем уникальные визиты (через localStorage)
        const isNewVisit = !localStorage.getItem('hasVisited');
        if (isNewVisit) {
            localStorage.setItem('hasVisited', 'true');
        }

        // 4. Собираем расширенные данные о сессии
        const userInfo = {
            ip: userIP,
            time: new Date().toISOString(), // Формат 2025-03-26T21:18:56Z
            country: geoData.country || "Неизвестно",
            city: geoData.city || "Неизвестно",
            referrer: document.referrer || "Прямой заход",
            browser: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            pageUrl: window.location.href, // Полный URL
            isNewVisit: isNewVisit, // true/false
            device: /Mobile|Android/i.test(navigator.userAgent) ? "Мобильное" : "Десктоп"
        };

        // Отправка в JSONBin (как у тебя было)
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const json = await response.json();
        const data = json.record || { visits: 0, users: [] };

        data.visits++;
        data.users.push(userInfo);

        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: "PUT",
            headers: {
                "X-Master-Key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

    } catch (error) {
        console.error("Ошибка:", error);
    }
}

sendVisitData();
</script>

</body>
</html>
