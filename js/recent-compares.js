document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('recentComparesRoot');
    if (!root) return;

    const sessions = typeof getRecentCompareSessions === 'function' ? getRecentCompareSessions() : [];
    if (sessions.length === 0) {
        root.innerHTML = `
            <div class="empty-state profile-card profile-card--wide">
                <p>Пока нет сохранённых сравнений. Отметьте в каталоге не менее двух позиций и нажмите «Сравнить».</p>
                <div class="profile-toolbar" style="justify-content: center;">
                    <a href="catalog.html" class="btn btn-primary">Каталог репетиторов</a>
                    <a href="catalog.html?tab=courses" class="btn btn-secondary">Каталог курсов</a>
                </div>
            </div>
        `;
        return;
    }

    root.innerHTML = `
        <div class="profile-toolbar" style="margin-bottom: 1.25rem;">
            <button type="button" id="clearRecentComparesBtn" class="btn btn-secondary">Очистить список</button>
        </div>
        <ul class="recent-compare-list" id="recentComparesList"></ul>
    `;

    const listEl = document.getElementById('recentComparesList');
    const clearBtn = document.getElementById('clearRecentComparesBtn');

    const rows = await Promise.all(sessions.map((s) => renderSessionRow(s)));

    if (listEl) {
        listEl.innerHTML = rows.join('');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Удалить все записи о сравнениях?')) {
                if (typeof clearRecentCompareSessions === 'function') {
                    clearRecentCompareSessions();
                }
                root.innerHTML = `
                    <div class="empty-state profile-card profile-card--wide">
                        <p>Список очищен.</p>
                        <a href="catalog.html" class="btn btn-primary">В каталог</a>
                    </div>
                `;
            }
        });
    }
});

async function renderSessionRow(session) {
    const ids = Array.isArray(session.ids) ? session.ids : [];
    if (ids.length < 2) return '';

    if (session.type === 'course') {
        const courses = await Promise.all(ids.map((id) => fetchCourseById(id)));
        return renderCourseSessionRow(session, courses);
    }
    const tutors = await Promise.all(ids.map((id) => fetchTutorById(id)));
    return renderTutorSessionRow(session, tutors);
}

function compareHref(type, ids) {
    const q = ids.join(',');
    return type === 'course' ? `compare.html?type=course&ids=${q}` : `compare.html?ids=${q}`;
}

function renderTutorSessionRow(session, tutors) {
    const parts = tutors.map((t, i) => {
        if (!t) return `<span class="recent-compare-item__missing">ID ${session.ids[i]}</span>`;
        return `<span>${escapeHtml(t.name)} <span class="recent-compare-item__meta">${escapeHtml(t.subject)}</span></span>`;
    });
    const href = compareHref('tutor', session.ids);
    const when = formatSessionDate(session.comparedAt);
    return `
        <li class="recent-compare-item">
            <div class="recent-compare-item__badge">Репетиторы</div>
            <div class="recent-compare-item__body">
                <a class="recent-compare-item__link" href="${href}">${parts.join('<span class="recent-compare-item__sep">·</span>')}</a>
                <div class="recent-compare-item__date">${when}</div>
            </div>
        </li>
    `;
}

function renderCourseSessionRow(session, courses) {
    const parts = courses.map((c, i) => {
        if (!c) return `<span class="recent-compare-item__missing">ID ${session.ids[i]}</span>`;
        return `<span>${escapeHtml(c.title)} <span class="recent-compare-item__meta">${escapeHtml(c.category)}</span></span>`;
    });
    const href = compareHref('course', session.ids);
    const when = formatSessionDate(session.comparedAt);
    return `
        <li class="recent-compare-item recent-compare-item--course">
            <div class="recent-compare-item__badge">Курсы</div>
            <div class="recent-compare-item__body">
                <a class="recent-compare-item__link" href="${href}">${parts.join('<span class="recent-compare-item__sep">·</span>')}</a>
                <div class="recent-compare-item__date">${when}</div>
            </div>
        </li>
    `;
}

function formatSessionDate(iso) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}
