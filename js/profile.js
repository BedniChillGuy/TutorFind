document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profileForm');
    const hint = document.getElementById('profileSavedHint');
    const recentList = document.getElementById('recentViewsList');
    const recentCourseList = document.getElementById('recentCourseViewsList');
    const requestsList = document.getElementById('requestsList');
    const courseRequestsList = document.getElementById('courseRequestsList');
    const clearRecentBtn = document.getElementById('clearRecentBtn');
    const clearRecentCoursesBtn = document.getElementById('clearRecentCoursesBtn');

    function fillForm() {
        const p = getUserProfile();
        if (form) {
            form.displayName.value = p.displayName || '';
            form.email.value = p.email || '';
            form.phone.value = p.phone || '';
            form.city.value = p.city || '';
            form.about.value = p.about || '';
        }
    }

    function renderRecent() {
        if (!recentList) return;
        const items = getRecentViews();
        if (items.length === 0) {
            recentList.innerHTML = '<li class="profile-hint">Пока нет записей.</li>';
            return;
        }
        recentList.innerHTML = items
            .map(
                (v) => `
            <li>
                <a href="tutor-detail.html?id=${encodeURIComponent(v.id)}">
                    ${escapeHtml(v.name)}
                    <small> — ${escapeHtml(v.subject)}</small>
                </a>
            </li>
        `
            )
            .join('');
    }

    function renderRecentCourses() {
        if (!recentCourseList) return;
        const items = typeof getRecentCourseViews === 'function' ? getRecentCourseViews() : [];
        if (items.length === 0) {
            recentCourseList.innerHTML = '<li class="profile-hint">Пока нет записей.</li>';
            return;
        }
        recentCourseList.innerHTML = items
            .map(
                (v) => `
            <li>
                <a href="course-detail.html?id=${encodeURIComponent(v.id)}">
                    ${escapeHtml(v.title)}
                    <small> — ${escapeHtml(v.category)}</small>
                </a>
            </li>
        `
            )
            .join('');
    }

    function renderRequests() {
        if (!requestsList) return;
        const items = getBookingRequests();
        if (items.length === 0) {
            requestsList.innerHTML =
                '<p class="profile-hint">Заявок нет. Оформите на странице репетитора («Связаться с репетитором»).</p>';
            return;
        }
        requestsList.innerHTML = items
            .map(
                (r) => `
            <article class="request-item">
                <header>
                    <span>${escapeHtml(r.tutorName)} — ${escapeHtml(r.subject)}</span>
                </header>
                <div class="request-meta">${formatDate(r.createdAt)}</div>
                <div class="request-message">${escapeHtml(r.message || '—')}</div>
                <div class="request-meta">Контакты: ${escapeHtml(r.contactPhone || '—')}, ${escapeHtml(r.contactEmail || '—')}</div>
                <div class="profile-toolbar">
                    <button type="button" class="btn btn-secondary btn-sm-delete" data-request-id="${escapeHtml(r.id)}">Удалить</button>
                    <a href="tutor-detail.html?id=${encodeURIComponent(r.tutorId)}" class="btn btn-primary">К профилю</a>
                </div>
            </article>
        `
            )
            .join('');

        requestsList.querySelectorAll('.btn-sm-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-request-id');
                if (id && confirm('Удалить заявку?')) {
                    deleteBookingRequest(id);
                    renderRequests();
                }
            });
        });
    }

    function renderCourseRequests() {
        if (!courseRequestsList) return;
        const items = typeof getCourseBookingRequests === 'function' ? getCourseBookingRequests() : [];
        if (items.length === 0) {
            courseRequestsList.innerHTML =
                '<p class="profile-hint">Заявок нет. Оформите на странице курса («Заявка на курс»).</p>';
            return;
        }
        courseRequestsList.innerHTML = items
            .map(
                (r) => `
            <article class="request-item">
                <header>
                    <span>${escapeHtml(r.courseTitle)} — ${escapeHtml(r.category)}</span>
                </header>
                <div class="request-meta">${formatDate(r.createdAt)}</div>
                <div class="request-message">${escapeHtml(r.message || '—')}</div>
                <div class="request-meta">Контакты: ${escapeHtml(r.contactPhone || '—')}, ${escapeHtml(r.contactEmail || '—')}</div>
                <div class="profile-toolbar">
                    <button type="button" class="btn btn-secondary btn-del-course" data-crid="${escapeHtml(r.id)}">Удалить</button>
                    <a href="course-detail.html?id=${encodeURIComponent(r.courseId)}" class="btn btn-primary">К курсу</a>
                </div>
            </article>
        `
            )
            .join('');

        courseRequestsList.querySelectorAll('.btn-del-course').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-crid');
                if (id && confirm('Удалить заявку?')) {
                    deleteCourseBookingRequest(id);
                    renderCourseRequests();
                }
            });
        });
    }

    if (form) {
        fillForm();
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveUserProfile({
                displayName: form.displayName.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                city: form.city.value.trim(),
                about: form.about.value.trim()
            });
            if (hint) {
                hint.hidden = false;
                setTimeout(() => {
                    hint.hidden = true;
                }, 2500);
            }
        });
    }

    if (clearRecentBtn) {
        clearRecentBtn.addEventListener('click', () => {
            if (confirm('Очистить историю просмотров репетиторов?')) {
                clearRecentViews();
                renderRecent();
            }
        });
    }

    if (clearRecentCoursesBtn) {
        clearRecentCoursesBtn.addEventListener('click', () => {
            if (confirm('Очистить историю просмотров курсов?')) {
                clearRecentCourseViews();
                renderRecentCourses();
            }
        });
    }

    renderRecent();
    renderRecentCourses();
    renderRequests();
    renderCourseRequests();
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function formatDate(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return iso;
    }
}
