const token = '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';  // Замініть на ваш токен GitHub
const gistId = '41455a1e1bd25df1b1a76656a058f3b7';  // ID вашого Gist
const gistUrl = `https://api.github.com/gists/${gistId}`;

// Функція для отримання даних про відвідування
function getVisitData() {
    const referer = document.referrer || 'Пряме відвідування';
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();

    return {
        timestamp,
        referer,
        userAgent
    };
}

// Функція для завантаження поточного вмісту файлу з Gist
async function fetchFile() {
    try {
        const response = await fetch(gistUrl, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!response.ok) throw new Error('Помилка при завантаженні файлу');

        const data = await response.json();
        return data.files['visits.log'].content || '';
    } catch (error) {
        console.error('Помилка при завантаженні файлу:', error);
        return '';
    }
}

// Функція для оновлення вмісту файлу в Gist
async function updateFile(content) {
    try {
        const response = await fetch(gistUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'visits.log': {
                        content: content
                    }
                }
            })
        });

        if (!response.ok) throw new Error('Помилка при оновленні файлу');

        console.log('Файл успішно оновлено!');
    } catch (error) {
        console.error('Помилка при оновленні файлу:', error);
    }
}

// Основна функція для логування відвідування
async function logVisit() {
    // Отримуємо дані про відвідування
    const visitData = getVisitData();
    const logEntry = `Timestamp: ${visitData.timestamp}, Referer: ${visitData.referer}, User-Agent: ${visitData.userAgent}\n`;

    // Завантажуємо поточний вміст файлу
    const currentContent = await fetchFile();

    // Додаємо новий запис до вмісту файлу
    const newContent = currentContent + logEntry;

    // Оновлюємо файл у Gist
    await updateFile(newContent);
}

// Викликаємо функцію логування при завантаженні сторінки
logVisit();
