document.addEventListener('DOMContentLoaded', async () => {
    const courseId = new URLSearchParams(window.location.search).get('id');
    const container = document.getElementById('courseDetail');
    if (!container) return;

    if (!courseId) {
        showCourseError(container, 'Курс не найден');
        return;
    }

    try {
        const course = await fetchCourseById(courseId);
        if (!course) {
            showCourseError(container, `Курс с ID ${courseId} не найден`);
            return;
        }
        if (typeof recordCourseView === 'function') {
            recordCourseView(course);
        }
        renderCourseDetail(course, container);
    } catch (e) {
        console.error(e);
        showCourseError(container, 'Ошибка загрузки данных');
    }
});

function showCourseError(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <p>${escapeHtml(message)}</p>
            <a href="catalog.html" class="btn btn-primary">В каталог</a>
        </div>
    `;
}

function renderCourseDetail(course, container) {
    const isFav = typeof isCourseFavorite === 'function' && isCourseFavorite(course.id);

    container.innerHTML = `
        <button type="button" class="btn-back" onclick="window.location.href='catalog.html?tab=courses'">
            Назад в каталог
        </button>
        <div class="tutor-detail-card">
            <div class="tutor-detail-header">
                <div class="tutor-detail-avatar">
                    ${
                        window.createCourseAvatar
                            ? window.createCourseAvatar(course.category)
                            : '<span class="course-card-icon">Курс</span>'
                    }
                </div>
                <div class="tutor-detail-info">
                    <h1>${escapeHtml(course.title)}</h1>
                    <div class="tutor-detail-subject">${escapeHtml(course.provider)} · ${escapeHtml(course.category)}</div>
                    <div class="tutor-detail-rating">
                        ${formatRating(course.rating)}
                        <span class="rating-muted"> (${course.reviews} отзывов)</span>
                    </div>
                    <div class="tutor-detail-stats">
                        <div class="stat">
                            <div class="stat-value">${Number(course.price).toLocaleString('ru-RU')} ₽</div>
                            <div class="stat-label">стоимость курса</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${course.durationWeeks}</div>
                            <div class="stat-label">недель</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${escapeHtml(course.format)}</div>
                            <div class="stat-label">формат</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tutor-detail-body">
                <div class="detail-section">
                    <h2>О программе</h2>
                    <p>${escapeHtml(course.about || '')}</p>
                </div>
                <div class="detail-section">
                    <h2>Контакты организатора</h2>
                    <p>${escapeHtml(course.phone || '')}<br>${escapeHtml(course.email || '')}</p>
                </div>
                <div class="detail-section detail-section--actions tutor-detail-actions">
                    <button type="button" class="btn btn-primary btn-large" onclick="window.openCourseBookingModal(${course.id})">
                        Заявка на курс
                    </button>
                    <button type="button" class="btn-favorite ${isFav ? 'active' : ''} btn-large"
                        onclick="window.toggleCourseFavoriteDetail(${course.id}, this)">
                        ${isFav ? 'В избранном' : 'В избранное'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

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

window.openCourseBookingModal = async function (id) {
    const modal = document.getElementById('courseBookingModal');
    const line = document.getElementById('courseBookingLine');
    const idInput = document.getElementById('courseBookingId');
    const form = document.getElementById('courseBookingForm');
    const successNote = document.getElementById('courseBookingSuccessNote');
    if (!modal || !form) return;

    const course = await fetchCourseById(id);
    if (!course) {
        alert('Курс не найден.');
        return;
    }
    const profile = typeof getUserProfile === 'function' ? getUserProfile() : {};
    idInput.value = String(course.id);
    if (line) {
        line.textContent = `${course.title} — ${course.provider}`;
    }
    document.getElementById('courseBookingPhone').value = profile.phone || '';
    document.getElementById('courseBookingEmail').value = profile.email || '';
    document.getElementById('courseBookingMessage').value = '';
    if (successNote) successNote.hidden = true;
    form.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
};

function closeCourseBookingModal() {
    const modal = document.getElementById('courseBookingModal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
}

window.toggleCourseFavoriteDetail = function (courseId, button) {
    if (typeof toggleCourseFavorite === 'function') {
        toggleCourseFavorite(courseId, button);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('courseBookingModal');
    const backdrop = document.getElementById('courseBookingModalBackdrop');
    const closeBtn = document.getElementById('courseBookingModalClose');
    const cancelBtn = document.getElementById('courseBookingModalCancel');
    const form = document.getElementById('courseBookingForm');

    function onClose() {
        closeCourseBookingModal();
    }

    if (backdrop) backdrop.addEventListener('click', onClose);
    if (closeBtn) closeBtn.addEventListener('click', onClose);
    if (cancelBtn) cancelBtn.addEventListener('click', onClose);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const courseId = parseInt(document.getElementById('courseBookingId').value, 10);
            const message = document.getElementById('courseBookingMessage').value.trim();
            const contactPhone = document.getElementById('courseBookingPhone').value.trim();
            const contactEmail = document.getElementById('courseBookingEmail').value.trim();

            fetchCourseById(courseId).then((course) => {
                if (!course || typeof addCourseBookingRequest !== 'function') return;
                addCourseBookingRequest({
                    courseId,
                    courseTitle: course.title,
                    category: course.category,
                    message,
                    contactPhone,
                    contactEmail
                });
                if (typeof saveUserProfile === 'function') {
                    saveUserProfile({ phone: contactPhone, email: contactEmail });
                }
                const successNote = document.getElementById('courseBookingSuccessNote');
                if (successNote) successNote.hidden = false;
                form.hidden = true;
                setTimeout(() => {
                    onClose();
                    if (form) form.hidden = false;
                    if (successNote) successNote.hidden = true;
                }, 1600);
            });
        });
    }
});
