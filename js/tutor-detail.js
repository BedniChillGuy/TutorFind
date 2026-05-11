document.addEventListener('DOMContentLoaded', async () => {
    const tutorId = getTutorIdFromUrl();
    const container = document.getElementById('tutorDetail');

    if (!container) {
        console.error('Контейнер не найден');
        return;
    }

    if (!tutorId) {
        showError(container, 'Репетитор не найден');
        return;
    }

    try {
        const tutor = await fetchTutorById(tutorId);

        if (!tutor) {
            showError(container, `Репетитор с ID ${tutorId} не найден`);
            return;
        }

        const skills =
            Array.isArray(tutor.skills) && tutor.skills.length
                ? tutor.skills
                : await getSkillsForSubject(tutor.subject);
        const reviews = buildMergedReviews(tutor);
        if (typeof recordTutorView === 'function') {
            recordTutorView(tutor);
        }
        renderTutorDetail(tutor, container, skills, reviews);
        bindTutorReviewForm(tutor);
    } catch (error) {
        console.error('Ошибка:', error);
        showError(container, 'Произошла ошибка при загрузке данных');
    }
});

function getTutorIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function showError(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <p>${message}</p>
            <a href="catalog.html" class="btn btn-primary">Вернуться в каталог</a>
        </div>
    `;
}

function buildMergedReviews(tutor) {
    const builtIn = Array.isArray(tutor.reviewEntries)
        ? tutor.reviewEntries.map((r) => ({ ...r, fromUser: false }))
        : [];
    const userRev =
        typeof getUserTutorReviewsForTutor === 'function' ? getUserTutorReviewsForTutor(tutor.id) : [];
    return [...builtIn, ...userRev];
}

function renderTutorDetail(tutor, container, skills, reviews) {
    const isFav = isFavorite(tutor.id);
    const detailIcon = window.getSubjectIcon ? window.getSubjectIcon(tutor.subject) : '';
    const skillsList = Array.isArray(skills) ? skills : [];
    const reviewsList = Array.isArray(reviews) ? reviews : [];

    container.innerHTML = `
        <button class="btn-back" onclick="window.location.href='catalog.html'">
            Назад к списку репетиторов
        </button>
        
        <div class="tutor-detail-card">
            <div class="tutor-detail-header">
                <div class="tutor-detail-avatar">
                    ${detailIcon}
                </div>
                <div class="tutor-detail-info">
                    <h1>${escapeHtml(tutor.name)}</h1>
                    <div class="tutor-detail-subject">${escapeHtml(tutor.subject)}</div>
                    <div class="tutor-detail-rating">
                        ${formatRating(tutor.rating)}
                        <span class="rating-muted"> (${tutor.reviews} отзывов)</span>
                    </div>
                    <div class="tutor-detail-stats">
                        <div class="stat">
                            <div class="stat-value">${tutor.price} ₽</div>
                            <div class="stat-label">час занятий</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${tutor.experience}</div>
                            <div class="stat-label">лет опыта</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${tutor.reviews}</div>
                            <div class="stat-label">отзывов</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tutor-detail-body">
                <div class="detail-section">
                    <h2>Образование</h2>
                    <p>${escapeHtml(tutor.education || 'Высшее профильное образование')}</p>
                </div>
                
                <div class="detail-section">
                    <h2>О преподавателе</h2>
                    <p>${escapeHtml(tutor.about)}</p>
                </div>
                
                <div class="detail-section">
                    <h2>Навыки и компетенции</h2>
                    <ul class="skills-list">
                        ${skillsList.length
                            ? skillsList.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')
                            : '<li>Не указано</li>'}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h2>Стоимость занятий</h2>
                    <p>Стоимость занятия (60 минут) - ${tutor.price} рублей. 
                    ${tutor.experience > 5 ? 'Возможны скидки при оплате абонемента.' : 'Провожу первое пробное занятие бесплатно.'}</p>
                </div>
                
                <div class="detail-section">
                    <h2>Расписание</h2>
                    <p>${escapeHtml(tutor.schedule || 'Гибкий график, обсуждается индивидуально')}</p>
                </div>
                
                <div class="detail-section">
                    <h2>Отзывы учеников</h2>
                    <div class="reviews-list" id="tutorReviewsList">
                        ${reviewsList.length
                            ? reviewsList
                                  .map(
                                      (review) => `
                            <div class="review-card">
                                <div class="review-header">
                                    <span>${escapeHtml(review.author)}${
                                          review.fromUser
                                              ? '<span class="review-badge-user">ваш отзыв</span>'
                                              : ''
                                      }</span>
                                    <span class="review-header-aside">
                                        <span>${formatRating(review.rating)}</span>
                                        ${
                                            review.fromUser && review.id
                                                ? `<button type="button" class="btn btn-secondary btn-review-delete" data-delete-user-review="${escapeHtml(review.id)}" data-tutor-id="${tutor.id}">Удалить</button>`
                                                : ''
                                        }
                                    </span>
                                </div>
                                <div class="review-text">${escapeHtml(review.text)}</div>
                            </div>
                        `
                                  )
                                  .join('')
                            : '<p class="review-text">Отзывов пока нет.</p>'}
                    </div>
                    <div class="review-form-block">
                        <h3>Оставить отзыв</h3>
                        <form id="tutorReviewForm">
                            <div class="modal-field">
                                <label for="tutorReviewRating">Оценка</label>
                                <select id="tutorReviewRating" name="rating" required>
                                    <option value="5">5 — отлично</option>
                                    <option value="4">4 — хорошо</option>
                                    <option value="3">3 — удовлетворительно</option>
                                    <option value="2">2 — слабо</option>
                                    <option value="1">1 — плохо</option>
                                </select>
                            </div>
                            <div class="modal-field">
                                <label for="tutorReviewText">Текст отзыва</label>
                                <textarea id="tutorReviewText" name="text" required maxlength="2000" rows="4" placeholder="Расскажите о занятиях…"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Опубликовать отзыв</button>
                        </form>
                        <p class="profile-hint">Отзыв сохраняется в браузере и отображается на этой странице.</p>
                    </div>
                </div>
                
                <div class="detail-section detail-section--actions tutor-detail-actions">
                    <button type="button" class="btn btn-primary btn-large" onclick="window.openBookingModal(${tutor.id})">
                        Связаться с репетитором
                    </button>
                    <button class="btn-favorite ${isFav ? 'active' : ''} btn-large" 
                            onclick="window.toggleFavoriteDetail(${tutor.id}, this)">
                        ${isFav ? 'В избранном' : 'Добавить в избранное'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function bindTutorReviewForm(tutor) {
    const form = document.getElementById('tutorReviewForm');
    if (!form || typeof addUserTutorReview !== 'function') return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = document.getElementById('tutorReviewRating').value;
        const text = document.getElementById('tutorReviewText').value.trim();
        if (!text) return;
        addUserTutorReview({ tutorId: tutor.id, rating, text });
        const container = document.getElementById('tutorDetail');
        const fresh = await fetchTutorById(tutor.id);
        if (!fresh) return;
        const skillsList =
            Array.isArray(fresh.skills) && fresh.skills.length
                ? fresh.skills
                : await getSkillsForSubject(fresh.subject);
        const merged = buildMergedReviews(fresh);
        renderTutorDetail(fresh, container, skillsList, merged);
        bindTutorReviewForm(fresh);
    });
}

function formatRating(rating) {
    const n = Number(rating);
    if (Number.isNaN(n)) return '';
    return `${n.toFixed(1)} из 5`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.openBookingModal = async function (tutorId) {
    const modal = document.getElementById('bookingModal');
    const tutorLine = document.getElementById('bookingTutorLine');
    const tutorIdInput = document.getElementById('bookingTutorId');
    const form = document.getElementById('bookingForm');
    const successNote = document.getElementById('bookingSuccessNote');
    if (!modal || !form) return;

    const tutor = await fetchTutorById(tutorId);
    if (!tutor) {
        alert('Не удалось загрузить данные репетитора.');
        return;
    }

    const profile = typeof getUserProfile === 'function' ? getUserProfile() : {};
    tutorIdInput.value = String(tutor.id);
    if (tutorLine) {
        tutorLine.textContent = `${tutor.name} — ${tutor.subject}. Контакты преподавателя: ${tutor.phone}, ${tutor.email}`;
    }
    document.getElementById('bookingContactPhone').value = profile.phone || '';
    document.getElementById('bookingContactEmail').value = profile.email || '';
    document.getElementById('bookingMessage').value = '';
    if (successNote) successNote.hidden = true;
    form.hidden = false;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
};

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const backdrop = document.getElementById('bookingModalBackdrop');
    const closeBtn = document.getElementById('bookingModalClose');
    const cancelBtn = document.getElementById('bookingModalCancel');
    const form = document.getElementById('bookingForm');

    function onClose() {
        closeBookingModal();
    }

    if (backdrop) backdrop.addEventListener('click', onClose);
    if (closeBtn) closeBtn.addEventListener('click', onClose);
    if (cancelBtn) cancelBtn.addEventListener('click', onClose);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const tutorId = parseInt(document.getElementById('bookingTutorId').value, 10);
            const message = document.getElementById('bookingMessage').value.trim();
            const contactPhone = document.getElementById('bookingContactPhone').value.trim();
            const contactEmail = document.getElementById('bookingContactEmail').value.trim();

            if (typeof addBookingRequest !== 'function') {
                alert('Сохранение заявки недоступно.');
                return;
            }

            fetchTutorById(tutorId).then((tutor) => {
                if (!tutor) return;
                addBookingRequest({
                    tutorId,
                    tutorName: tutor.name,
                    subject: tutor.subject,
                    message,
                    contactPhone,
                    contactEmail
                });
                if (typeof saveUserProfile === 'function') {
                    saveUserProfile({ phone: contactPhone, email: contactEmail });
                }
                const successNote = document.getElementById('bookingSuccessNote');
                if (successNote) {
                    successNote.hidden = false;
                }
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

window.toggleFavoriteDetail = function (tutorId, button) {
    if (isFavorite(tutorId)) {
        removeFromFavorite(tutorId);
        button.classList.remove('active');
        button.textContent = 'Добавить в избранное';
    } else {
        addToFavorite(tutorId);
        button.classList.add('active');
        button.textContent = 'В избранном';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('tutorDetail');
    if (!root) return;
    root.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-delete-user-review]');
        if (!btn) return;
        e.preventDefault();
        const reviewId = btn.getAttribute('data-delete-user-review');
        const tutorId = parseInt(btn.getAttribute('data-tutor-id'), 10);
        if (!reviewId || Number.isNaN(tutorId)) return;
        if (!confirm('Удалить этот отзыв?')) return;
        if (typeof deleteUserTutorReview === 'function') {
            deleteUserTutorReview(reviewId);
        }
        const tutor = await fetchTutorById(tutorId);
        if (!tutor) return;
        const skillsList =
            Array.isArray(tutor.skills) && tutor.skills.length
                ? tutor.skills
                : await getSkillsForSubject(tutor.subject);
        const merged = buildMergedReviews(tutor);
        renderTutorDetail(tutor, root, skillsList, merged);
        bindTutorReviewForm(tutor);
    });
});
