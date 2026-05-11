window.navigateToTutorDetail = function (tutorId) {
    window.location.href = `tutor-detail.html?id=${tutorId}`;
};

window.navigateToCourseDetail = function (courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
};

async function renderFavorites() {
    const favoriteContainer = document.getElementById('favoriteContainer');
    if (!favoriteContainer) return;

    const [favorites, courseFavs] = await Promise.all([fetchFavoriteTutors(), fetchFavoriteCourses()]);

    if (favorites.length === 0 && courseFavs.length === 0) {
        favoriteContainer.innerHTML = `
            <div class="empty-state">
                <p>У вас пока нет избранных репетиторов и курсов</p>
                <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    let html = '';

    if (favorites.length > 0) {
        html += `<h2 class="favorite-section-title">Репетиторы</h2>
        <div class="tutors-grid favorite-grid-block">
            ${favorites
                .map(
                    (tutor) => `
                <div class="tutor-card" data-id="${tutor.id}" onclick="window.navigateToTutorDetail(${tutor.id})">
                    ${window.createTutorAvatar ? window.createTutorAvatar(tutor.subject) : '<div class="tutor-avatar"></div>'}
                    <div class="tutor-info">
                        <div class="tutor-name">${escapeHtml(tutor.name)}</div>
                        <div class="tutor-subject">${escapeHtml(tutor.subject)}</div>
                        <div class="tutor-price">${tutor.price} ₽/час</div>
                        <div class="tutor-rating">${formatRating(tutor.rating)}</div>
                        <p>Опыт: ${tutor.experience} лет</p>
                        <div class="tutor-actions" onclick="event.stopPropagation()">
                            <button type="button" class="btn-favorite active" 
                                    onclick="window.removeFromFavoriteHandler(${tutor.id}, this)">
                                В избранном
                            </button>
                        </div>
                    </div>
                </div>
            `
                )
                .join('')}
        </div>`;
    }

    if (courseFavs.length > 0) {
        html += `<h2 class="favorite-section-title">Курсы</h2>
        <div class="tutors-grid favorite-grid-block">
            ${courseFavs
                .map(
                    (c) => `
                <div class="tutor-card course-card" data-id="${c.id}" onclick="window.navigateToCourseDetail(${c.id})">
                    ${window.createCourseAvatar ? window.createCourseAvatar(c.category) : '<div class="tutor-avatar course-card-badge"><span class="course-card-icon">Курс</span></div>'}
                    <div class="tutor-info">
                        <div class="tutor-name">${escapeHtml(c.title)}</div>
                        <div class="tutor-subject">${escapeHtml(c.provider)}</div>
                        <div class="tutor-price">${Number(c.price).toLocaleString('ru-RU')} ₽</div>
                        <div class="tutor-rating">${formatRating(c.rating)}</div>
                        <div class="tutor-actions" onclick="event.stopPropagation()">
                            <button type="button" class="btn-favorite active" 
                                    onclick="window.removeFromCourseFavoriteHandler(${c.id}, this)">
                                В избранном
                            </button>
                        </div>
                    </div>
                </div>
            `
                )
                .join('')}
        </div>`;
    }

    favoriteContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

function formatRating(rating) {
    const n = Number(rating);
    if (Number.isNaN(n)) return '';
    return `${n.toFixed(1)} из 5`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

window.removeFromFavoriteHandler = function (tutorId) {
    removeFromFavorite(tutorId);
    renderFavorites();
};

window.removeFromCourseFavoriteHandler = function (courseId) {
    if (typeof removeCourseFavorite === 'function') {
        removeCourseFavorite(courseId);
    }
    renderFavorites();
};
