document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('compareRoot');
    const pageTitle = document.getElementById('comparePageTitle');
    const pageHint = document.getElementById('comparePageHint');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const compareType = params.get('type') === 'course' ? 'course' : 'tutor';

    if (pageTitle) {
        pageTitle.textContent = compareType === 'course' ? 'Сравнение курсов' : 'Сравнение репетиторов';
    }
    if (pageHint) {
        pageHint.innerHTML =
            compareType === 'course'
                ? '<a href="catalog.html?tab=courses">Вернуться в каталог курсов</a> и отметьте элементы для сравнения.'
                : '<a href="catalog.html">Вернуться в каталог репетиторов</a> и отметьте преподавателей для сравнения.';
    }

    let ids = parseIdsFromSearch(params);
    const stored =
        compareType === 'course'
            ? typeof getCourseCompareIds === 'function'
              ? getCourseCompareIds()
              : []
            : typeof getCompareIds === 'function'
              ? getCompareIds()
              : [];

    if (ids.length < 2 && stored.length >= 2) {
        ids = [...stored];
    }
    ids = [...new Set(ids.map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n)))];
    const cap = typeof getMaxCompareSelection === 'function' ? getMaxCompareSelection() : 8;
    ids = ids.slice(0, cap);

    if (ids.length < 2) {
        root.innerHTML =
            compareType === 'course'
                ? `
            <div class="empty-state profile-card--wide" style="grid-column: 1 / -1;">
                <p>Выберите не менее двух курсов в каталоге (вкладка «Образовательные курсы») и нажмите «Сравнить».</p>
                <a href="catalog.html?tab=courses" class="btn btn-primary">Перейти к курсам</a>
            </div>
        `
                : `
            <div class="empty-state profile-card--wide" style="grid-column: 1 / -1;">
                <p>Выберите не менее двух репетиторов в каталоге и нажмите «Сравнить».</p>
                <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    if (compareType === 'course') {
        try {
            const fetched = await Promise.all(ids.map((id) => fetchCourseById(id)));
            const valid = fetched.filter(Boolean);
            if (valid.length < 2) {
                root.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>Недостаточно данных для сравнения.</p>
                    <a href="catalog.html?tab=courses" class="btn btn-primary">В каталог курсов</a>
                </div>
            `;
                return;
            }
            const priceFlags = bestNumericFlagsMulti(
                valid.map((c) => c.price),
                true
            );
            const ratingFlags = bestNumericFlagsMulti(
                valid.map((c) => c.rating),
                false
            );
            if (typeof recordCompareSession === 'function') {
                recordCompareSession(
                    'course',
                    valid.map((c) => c.id)
                );
            }
            root.innerHTML = valid
                .map((c, i) =>
                    renderCompareCourseColumn(c, { bestPrice: priceFlags[i], bestRating: ratingFlags[i] })
                )
                .join('');
        } catch (e) {
            console.error(e);
            root.innerHTML = '<div class="empty-state">Ошибка загрузки.</div>';
        }
        return;
    }

    try {
        const fetched = await Promise.all(ids.map((id) => fetchTutorById(id)));
        const valid = fetched.map((t) => t || null).filter(Boolean);
        if (valid.length < 2) {
            root.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>Недостаточно данных для сравнения.</p>
                    <a href="catalog.html" class="btn btn-primary">В каталог</a>
                </div>
            `;
            return;
        }
        const priceFlags = bestNumericFlagsMulti(
            valid.map((t) => t.price),
            true
        );
        const ratingFlags = bestNumericFlagsMulti(
            valid.map((t) => t.rating),
            false
        );
        if (typeof recordCompareSession === 'function') {
            recordCompareSession(
                'tutor',
                valid.map((t) => t.id)
            );
        }
        root.innerHTML = valid
            .map((t, i) => renderCompareColumn(t, { bestPrice: priceFlags[i], bestRating: ratingFlags[i] }))
            .join('');
    } catch (e) {
        console.error(e);
        root.innerHTML = '<div class="empty-state">Ошибка загрузки.</div>';
    }
});

function parseIdsFromSearch(params) {
    const idsParam = params.get('ids');
    const out = [];
    if (idsParam && idsParam.trim()) {
        idsParam.split(/[,;]+/).forEach((part) => {
            const n = parseInt(part.trim(), 10);
            if (!Number.isNaN(n)) out.push(n);
        });
    }
    if (out.length === 0) {
        const a = parseInt(params.get('a'), 10);
        const b = parseInt(params.get('b'), 10);
        if (!Number.isNaN(a)) out.push(a);
        if (!Number.isNaN(b)) out.push(b);
    }
    return out;
}

/** @param {number[]} values @param {boolean} lowerIsBetter */
function bestNumericFlagsMulti(values, lowerIsBetter) {
    const nums = values.map((v) => Number(v));
    const present = nums.filter((n) => !Number.isNaN(n));
    if (present.length === 0) return values.map(() => false);
    const extreme = lowerIsBetter ? Math.min(...present) : Math.max(...present);
    return nums.map((n) => (Number.isNaN(n) ? false : n === extreme));
}

function rowClass(best) {
    return best ? 'compare-row compare-row--best' : 'compare-row';
}

function renderCompareColumn(tutor, flags) {
    const icon = window.getSubjectIcon ? window.getSubjectIcon(tutor.subject) : '';
    const about = tutor.about ? escapeHtml(tutor.about.substring(0, 220)) + (tutor.about.length > 220 ? '…' : '') : '—';
    const fp = flags && flags.bestPrice;
    const fr = flags && flags.bestRating;
    return `
        <div class="compare-column">
            <div class="tutor-detail-avatar" style="margin-bottom: 1rem; min-height: 140px;">
                ${icon}
            </div>
            <h2>${escapeHtml(tutor.name)}</h2>
            <div class="compare-row"><span>Предмет</span>${escapeHtml(tutor.subject)}</div>
            <div class="${rowClass(fp)}"><span>Цена за час</span>${tutor.price} ₽</div>
            <div class="${rowClass(fr)}"><span>Рейтинг</span>${Number(tutor.rating).toFixed(1)} из 5 (${tutor.reviews} отзывов)</div>
            <div class="compare-row"><span>Опыт</span>${tutor.experience} лет</div>
            <div class="compare-row"><span>Образование</span>${escapeHtml(tutor.education || '—')}</div>
            <div class="compare-row"><span>О преподавателе</span>${about}</div>
            <div style="margin-top: 1rem;">
                <a href="tutor-detail.html?id=${tutor.id}" class="btn btn-primary">Профиль</a>
            </div>
        </div>
    `;
}

function renderCompareCourseColumn(course, flags) {
    const avatar = window.createCourseAvatar ? window.createCourseAvatar(course.category) : '';
    const about = course.about
        ? escapeHtml(course.about.substring(0, 220)) + (course.about.length > 220 ? '…' : '')
        : '—';
    const fp = flags && flags.bestPrice;
    const fr = flags && flags.bestRating;
    return `
        <div class="compare-column compare-column--course">
            <div class="compare-course-avatar">${avatar}</div>
            <h2>${escapeHtml(course.title)}</h2>
            <div class="compare-row"><span>Организатор</span>${escapeHtml(course.provider || '—')}</div>
            <div class="compare-row"><span>Направление</span>${escapeHtml(course.category || '—')}</div>
            <div class="${rowClass(fp)}"><span>Стоимость</span>${Number(course.price).toLocaleString('ru-RU')} ₽</div>
            <div class="${rowClass(fr)}"><span>Рейтинг</span>${Number(course.rating).toFixed(1)} из 5 (${course.reviews} отзывов)</div>
            <div class="compare-row"><span>Длительность</span>${course.durationWeeks} нед.</div>
            <div class="compare-row"><span>Формат</span>${escapeHtml(course.format || '—')}</div>
            <div class="compare-row"><span>О программе</span>${about}</div>
            <div style="margin-top: 1rem;">
                <a href="course-detail.html?id=${course.id}" class="btn btn-primary">Страница курса</a>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}
