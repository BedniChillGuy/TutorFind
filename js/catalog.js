// Глобальные функции
window.navigateToTutorDetail = function (tutorId) {
    window.location.href = `tutor-detail.html?id=${tutorId}`;
};

window.navigateToCourseDetail = function (courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
};

window.toggleFavorite = toggleFavorite;

const PAGE_SIZE = 6;
let lastTutors = [];
let currentPage = 1;
let lastCourses = [];
let currentCoursePage = 1;
let activeCatalogTab = 'tutors';
let tutorSubjectOptions = [];
let courseCategoryOptions = [];

document.addEventListener('DOMContentLoaded', async () => {
    const tutorsContainer = document.getElementById('tutorsContainer');
    const coursesContainer = document.getElementById('coursesContainer');
    const paginationEl = document.getElementById('catalogPagination');
    const coursesPaginationEl = document.getElementById('coursesPagination');
    const tutorsCatalogArea = document.getElementById('tutorsCatalogArea');
    const coursesCatalogArea = document.getElementById('coursesCatalogArea');
    const subjectFilter = document.getElementById('subjectFilter');
    const searchInput = document.getElementById('searchInput');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortSelect = document.getElementById('sortSelect');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const compareDock = document.getElementById('compareDock');
    const compareDockLabel = document.getElementById('compareDockLabel');
    const compareGoBtn = document.getElementById('compareGoBtn');
    const compareClearBtn = document.getElementById('compareClearBtn');
    const tabTutors = document.getElementById('tabTutors');
    const tabCourses = document.getElementById('tabCourses');
    const catalogMainTitle = document.getElementById('catalogMainTitle');
    const filterSearchTitle = document.getElementById('filterSearchTitle');
    const filterSubjectTitle = document.getElementById('filterSubjectTitle');
    const filterPriceTitle = document.getElementById('filterPriceTitle');

    let currentFilters = {
        search: '',
        subject: 'all',
        minPrice: null,
        maxPrice: null,
        minRating: null,
        sortBy: 'default'
    };

    tutorSubjectOptions = await fetchSubjects();
    courseCategoryOptions = await fetchCourseCategories();

    function fillSubjectFilter(options, firstOptionText) {
        if (!subjectFilter) return;
        subjectFilter.innerHTML = `<option value="all">${firstOptionText}</option>`;
        options.forEach((label) => {
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            subjectFilter.appendChild(option);
        });
    }

    fillSubjectFilter(tutorSubjectOptions, 'Все предметы');

    function updateFilterLabels() {
        const isCourses = activeCatalogTab === 'courses';
        if (filterSearchTitle) filterSearchTitle.textContent = 'Поиск';
        if (filterSubjectTitle) filterSubjectTitle.textContent = isCourses ? 'Направление' : 'Предмет';
        if (filterPriceTitle) filterPriceTitle.textContent = isCourses ? 'Цена курса (₽)' : 'Цена за час';
        if (catalogMainTitle) {
            catalogMainTitle.textContent = isCourses ? 'Образовательные курсы' : 'Каталог репетиторов';
        }
        if (searchInput) {
            searchInput.placeholder = isCourses
                ? 'Название курса, организатор...'
                : 'Имя или предмет...';
        }
    }

    function setActiveTab(tab) {
        activeCatalogTab = tab;
        const isCourses = tab === 'courses';
        if (tabTutors) {
            tabTutors.classList.toggle('active', !isCourses);
            tabTutors.setAttribute('aria-selected', String(!isCourses));
        }
        if (tabCourses) {
            tabCourses.classList.toggle('active', isCourses);
            tabCourses.setAttribute('aria-selected', String(isCourses));
        }
        if (tutorsCatalogArea) {
            tutorsCatalogArea.classList.toggle('is-active', !isCourses);
        }
        if (coursesCatalogArea) {
            coursesCatalogArea.classList.toggle('is-active', isCourses);
        }
        if (paginationEl) {
            paginationEl.hidden = isCourses || paginationEl.innerHTML === '';
        }
        if (coursesPaginationEl) {
            if (!isCourses) {
                coursesPaginationEl.hidden = true;
            }
        }

        subjectFilter.value = 'all';
        fillSubjectFilter(isCourses ? courseCategoryOptions : tutorSubjectOptions, isCourses ? 'Все направления' : 'Все предметы');
        updateFilterLabels();
        updateCompareDock();
        readFiltersFromForm();

        if (isCourses) {
            loadAndRenderCourses();
        } else {
            loadAndRenderTutors();
        }
    }

    if (tabTutors) tabTutors.addEventListener('click', () => setActiveTab('tutors'));
    if (tabCourses) tabCourses.addEventListener('click', () => setActiveTab('courses'));

    function updateCompareDock() {
        if (!compareDock || !compareDockLabel || !compareGoBtn) return;
        const isCourses = activeCatalogTab === 'courses';
        if (isCourses) {
            const ids = typeof getCourseCompareIds === 'function' ? getCourseCompareIds() : [];
            compareDockLabel.textContent =
                ids.length === 0
                    ? 'Ни одного курса не выбрано'
                    : ids.length === 1
                      ? 'Выбран 1 курс — отметьте ещё для сравнения'
                      : `Выбрано курсов: ${ids.length}`;
            compareGoBtn.disabled = ids.length < 2;
            compareDock.classList.toggle('is-visible', ids.length > 0);
            return;
        }
        const ids = typeof getCompareIds === 'function' ? getCompareIds() : [];
        compareDockLabel.textContent =
            ids.length === 0
                ? 'Никого не выбрано'
                : ids.length === 1
                  ? 'Выбран 1 репетитор — отметьте ещё для сравнения'
                  : `Выбрано репетиторов: ${ids.length}`;
        compareGoBtn.disabled = ids.length < 2;
        compareDock.classList.toggle('is-visible', ids.length > 0);
    }

    function syncCompareCheckboxes() {
        const ids = typeof getCompareIds === 'function' ? getCompareIds() : [];
        document.querySelectorAll('.compare-check').forEach((cb) => {
            const tid = parseInt(cb.dataset.tutorId, 10);
            cb.checked = ids.includes(tid);
        });
    }

    function syncCourseCompareCheckboxes() {
        const ids = typeof getCourseCompareIds === 'function' ? getCourseCompareIds() : [];
        document.querySelectorAll('.compare-course-check').forEach((cb) => {
            const cid = parseInt(cb.dataset.courseId, 10);
            cb.checked = ids.includes(cid);
        });
    }

    if (compareGoBtn) {
        compareGoBtn.addEventListener('click', () => {
            if (activeCatalogTab === 'courses') {
                const ids = typeof getCourseCompareIds === 'function' ? getCourseCompareIds() : [];
                if (ids.length >= 2) {
                    window.location.href = `compare.html?type=course&ids=${ids.join(',')}`;
                }
            } else {
                const ids = getCompareIds();
                if (ids.length >= 2) {
                    window.location.href = `compare.html?ids=${ids.join(',')}`;
                }
            }
        });
    }
    if (compareClearBtn) {
        compareClearBtn.addEventListener('click', () => {
            if (activeCatalogTab === 'courses') {
                if (typeof setCourseCompareIds === 'function') setCourseCompareIds([]);
                syncCourseCompareCheckboxes();
            } else {
                setCompareIds([]);
                syncCompareCheckboxes();
            }
            updateCompareDock();
        });
    }

    window.addEventListener('compareIdsChanged', () => {
        syncCompareCheckboxes();
        updateCompareDock();
    });

    window.addEventListener('courseCompareIdsChanged', () => {
        syncCourseCompareCheckboxes();
        updateCompareDock();
    });

    async function loadAndRenderTutors() {
        if (!tutorsContainer) return;

        tutorsContainer.innerHTML = '<div class="loading">Загрузка...</div>';
        if (paginationEl) paginationEl.hidden = true;

        try {
            const mapFilters = {
                ...currentFilters,
                subject: currentFilters.subject
            };
            const tutors = await searchTutors(mapFilters);
            renderTutorsList(tutors);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            tutorsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Ошибка загрузки данных</p>
                    <button onclick="location.reload()" class="btn btn-primary">Обновить</button>
                </div>
            `;
            updateCompareDock();
        }
    }

    function renderTutorsList(tutors) {
        if (!tutorsContainer) return;

        if (tutors.length === 0) {
            lastTutors = [];
            tutorsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Репетиторы не найдены</p>
                    <button class="btn btn-primary" onclick="document.getElementById('resetFilters')?.click()">
                        Сбросить фильтры
                    </button>
                </div>
            `;
            if (paginationEl) paginationEl.hidden = true;
            updateCompareDock();
            return;
        }

        lastTutors = tutors;
        currentPage = 1;
        renderCurrentPage();
    }

    function renderCurrentPage() {
        if (!tutorsContainer) return;

        const total = lastTutors.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * PAGE_SIZE;
        const slice = lastTutors.slice(start, start + PAGE_SIZE);
        const compareIds = typeof getCompareIds === 'function' ? getCompareIds() : [];

        tutorsContainer.innerHTML = slice
            .map(
                (tutor) => `
            <div class="tutor-card-wrap">
                <label class="compare-pick" onclick="event.stopPropagation()">
                    <input type="checkbox" class="compare-check" data-tutor-id="${tutor.id}" ${
                        compareIds.includes(tutor.id) ? 'checked' : ''
                    }>
                    <span>В сравнении</span>
                </label>
                <div class="tutor-card" data-id="${tutor.id}" onclick="window.navigateToTutorDetail(${tutor.id})">
                    ${window.createTutorAvatar ? window.createTutorAvatar(tutor.subject) : '<div class="tutor-avatar"></div>'}
                    <div class="tutor-info">
                        <div class="tutor-name">${escapeHtml(tutor.name)}</div>
                        <div class="tutor-subject">${escapeHtml(tutor.subject)}</div>
                        <div class="tutor-price">${tutor.price} ₽/час</div>
                        <div class="tutor-rating">
                            ${formatRating(tutor.rating)}
                            (${tutor.reviews} отзывов)
                        </div>
                        <p>Опыт: ${tutor.experience} лет</p>
                        <p>${escapeHtml(tutor.about.substring(0, 50))}...</p>
                        <div class="tutor-actions" onclick="event.stopPropagation()">
                            <button class="btn-favorite ${isFavorite(tutor.id) ? 'active' : ''}" 
                                    onclick="window.toggleFavorite(${tutor.id}, this)">
                                ${isFavorite(tutor.id) ? 'В избранном' : 'В избранное'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
            )
            .join('');

        tutorsContainer.querySelectorAll('.compare-check').forEach((cb) => {
            cb.addEventListener('change', (e) => {
                e.stopPropagation();
                const id = parseInt(cb.dataset.tutorId, 10);
                if (typeof toggleCompareId === 'function') {
                    toggleCompareId(id);
                }
                syncCompareCheckboxes();
                updateCompareDock();
            });
            cb.addEventListener('click', (e) => e.stopPropagation());
        });

        updatePaginationUI(paginationEl, totalPages, total, 'репетиторов', () => {
            currentPage--;
            renderCurrentPage();
        }, () => {
            currentPage++;
            renderCurrentPage();
        }, currentPage);
        updateCompareDock();
    }

    async function loadAndRenderCourses() {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = '<div class="loading">Загрузка...</div>';
        if (coursesPaginationEl) coursesPaginationEl.hidden = true;

        try {
            const courses = await searchCourses({
                search: currentFilters.search,
                category: currentFilters.subject,
                minPrice: currentFilters.minPrice,
                maxPrice: currentFilters.maxPrice,
                minRating: currentFilters.minRating,
                sortBy: currentFilters.sortBy
            });
            renderCoursesList(courses);
        } catch (e) {
            console.error(e);
            coursesContainer.innerHTML = `
                <div class="empty-state"><p>Ошибка загрузки курсов</p>
                <button onclick="location.reload()" class="btn btn-primary">Обновить</button></div>`;
        }
    }

    function renderCoursesList(courses) {
        if (!coursesContainer) return;
        if (courses.length === 0) {
            lastCourses = [];
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <p>Курсы не найдены</p>
                    <button class="btn btn-primary" onclick="document.getElementById('resetFilters')?.click()">Сбросить фильтры</button>
                </div>`;
            if (coursesPaginationEl) coursesPaginationEl.hidden = true;
            updateCompareDock();
            return;
        }
        lastCourses = courses;
        currentCoursePage = 1;
        renderCoursePage();
    }

    function renderCoursePage() {
        if (!coursesContainer) return;
        const total = lastCourses.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (currentCoursePage > totalPages) currentCoursePage = totalPages;
        const start = (currentCoursePage - 1) * PAGE_SIZE;
        const slice = lastCourses.slice(start, start + PAGE_SIZE);
        const courseCompareIds = typeof getCourseCompareIds === 'function' ? getCourseCompareIds() : [];

        coursesContainer.innerHTML = slice
            .map(
                (c) => `
            <div class="tutor-card-wrap course-card-wrap">
                <label class="compare-pick" onclick="event.stopPropagation()">
                    <input type="checkbox" class="compare-course-check" data-course-id="${c.id}" ${
                        courseCompareIds.includes(c.id) ? 'checked' : ''
                    }>
                    <span>В сравнении</span>
                </label>
                <div class="tutor-card course-card" data-id="${c.id}" onclick="window.navigateToCourseDetail(${c.id})">
                    ${window.createCourseAvatar ? window.createCourseAvatar(c.category) : '<div class="tutor-avatar course-card-badge"><span class="course-card-icon">Курс</span></div>'}
                    <div class="tutor-info">
                        <div class="tutor-name">${escapeHtml(c.title)}</div>
                        <div class="tutor-subject">${escapeHtml(c.provider)} · ${escapeHtml(c.category)}</div>
                        <div class="tutor-price">${c.price.toLocaleString('ru-RU')} ₽</div>
                        <div class="tutor-rating">${formatRating(c.rating)} (${c.reviews} отзывов)</div>
                        <p>${c.durationWeeks} нед. · ${escapeHtml(c.format)}</p>
                        <p>${escapeHtml((c.about || '').substring(0, 55))}...</p>
                        <div class="tutor-actions" onclick="event.stopPropagation()">
                            <button type="button" class="btn-favorite ${isCourseFavorite(c.id) ? 'active' : ''}"
                                onclick="window.toggleCourseFavorite(${c.id}, this)">
                                ${isCourseFavorite(c.id) ? 'В избранном' : 'В избранное'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
            )
            .join('');

        coursesContainer.querySelectorAll('.compare-course-check').forEach((cb) => {
            cb.addEventListener('change', (e) => {
                e.stopPropagation();
                const id = parseInt(cb.dataset.courseId, 10);
                if (typeof toggleCourseCompareId === 'function') {
                    toggleCourseCompareId(id);
                }
                syncCourseCompareCheckboxes();
                updateCompareDock();
            });
            cb.addEventListener('click', (e) => e.stopPropagation());
        });

        updatePaginationUI(
            coursesPaginationEl,
            totalPages,
            total,
            'курсов',
            () => {
                currentCoursePage--;
                renderCoursePage();
            },
            () => {
                currentCoursePage++;
                renderCoursePage();
            },
            currentCoursePage
        );
        updateCompareDock();
    }

    function updatePaginationUI(el, totalPages, total, entityLabel, onPrev, onNext, pageVar) {
        if (!el) return;
        if (totalPages <= 1) {
            el.hidden = true;
            el.innerHTML = '';
            return;
        }
        el.hidden = false;
        el.innerHTML = `
            <button type="button" class="btn btn-secondary" id="pgPrev">Назад</button>
            <span class="pagination-info">Страница ${pageVar} из ${totalPages} (${total} ${entityLabel})</span>
            <button type="button" class="btn btn-secondary" id="pgNext">Вперёд</button>
        `;
        const prev = el.querySelector('#pgPrev');
        const next = el.querySelector('#pgNext');
        if (prev) {
            prev.disabled = pageVar <= 1;
            prev.addEventListener('click', onPrev);
        }
        if (next) {
            next.disabled = pageVar >= totalPages;
            next.addEventListener('click', onNext);
        }
    }

    function readFiltersFromForm() {
        currentFilters = {
            search: searchInput?.value.trim() || '',
            subject: subjectFilter?.value || 'all',
            minPrice: minPrice?.value ? parseFloat(minPrice.value) : null,
            maxPrice: maxPrice?.value ? parseFloat(maxPrice.value) : null,
            minRating: ratingFilter?.value !== 'all' ? parseFloat(ratingFilter.value) : null,
            sortBy: sortSelect?.value || 'default'
        };
    }

    function applyFilters() {
        readFiltersFromForm();
        if (activeCatalogTab === 'courses') {
            loadAndRenderCourses();
        } else {
            loadAndRenderTutors();
        }
    }

    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (subjectFilter) subjectFilter.value = 'all';
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (ratingFilter) ratingFilter.value = 'all';
        if (sortSelect) sortSelect.value = 'default';
        applyFilters();
    }

    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(applyFilters, 500);
        });
    }

    updateCompareDock();
    updateFilterLabels();

    const startCourses = new URLSearchParams(window.location.search).get('tab') === 'courses';
    if (startCourses) {
        setActiveTab('courses');
    } else {
        await loadAndRenderTutors();
    }
});

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
