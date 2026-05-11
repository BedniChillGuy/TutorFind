// Ключ для хранения избранного в Local Storage
const FAVORITES_KEY = 'tutor_favorites';
const COURSE_FAVORITES_KEY = 'tutor_course_favorites';

// Получить список избранного
function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

// Сохранить список избранного
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoriteCount();
}

// Добавить в избранное
function addToFavorite(tutorId) {
    const favorites = getFavorites();
    if (!favorites.includes(tutorId)) {
        favorites.push(tutorId);
        saveFavorites(favorites);
    }
}

// Удалить из избранного
function removeFromFavorite(tutorId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(tutorId);
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
    }
}

// Проверить, в избранном ли репетитор
function isFavorite(tutorId) {
    const favorites = getFavorites();
    return favorites.includes(tutorId);
}

function getCourseFavorites() {
    try {
        const raw = localStorage.getItem(COURSE_FAVORITES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCourseFavorites(ids) {
    localStorage.setItem(COURSE_FAVORITES_KEY, JSON.stringify(ids));
    updateFavoriteCount();
}

function addCourseFavorite(courseId) {
    const list = getCourseFavorites();
    if (!list.includes(courseId)) {
        list.push(courseId);
        saveCourseFavorites(list);
    }
}

function removeCourseFavorite(courseId) {
    const list = getCourseFavorites().filter((id) => id !== courseId);
    saveCourseFavorites(list);
}

function isCourseFavorite(courseId) {
    return getCourseFavorites().includes(courseId);
}

function toggleCourseFavorite(courseId, button) {
    if (isCourseFavorite(courseId)) {
        removeCourseFavorite(courseId);
        button.classList.remove('active');
        button.textContent = 'В избранное';
    } else {
        addCourseFavorite(courseId);
        button.classList.add('active');
        button.textContent = 'В избранном';
    }
}

// Обновить счетчик избранного на всех страницах (репетиторы + курсы)
function updateFavoriteCount() {
    const counters = document.querySelectorAll('.favorite-count');
    const count = getFavorites().length + getCourseFavorites().length;
    counters.forEach((counter) => {
        counter.textContent = count;
    });
}

// Переключить избранное
function toggleFavorite(tutorId, button) {
    if (isFavorite(tutorId)) {
        removeFromFavorite(tutorId);
        button.classList.remove('active');
        button.textContent = 'В избранное';
    } else {
        addToFavorite(tutorId);
        button.classList.add('active');
        button.textContent = 'В избранном';
    }
}

window.getCourseFavorites = getCourseFavorites;
window.isCourseFavorite = isCourseFavorite;
window.toggleCourseFavorite = toggleCourseFavorite;
window.removeCourseFavorite = removeCourseFavorite;

// Инициализация счетчика при загрузке страницы
document.addEventListener('DOMContentLoaded', updateFavoriteCount);