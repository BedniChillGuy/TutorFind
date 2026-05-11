// Базовый URL для данных
const DATA_URL = 'data/database.json';

// Кеш для данных, чтобы не загружать несколько раз
let cachedData = null;

// Загрузка всех данных из JSON файла
async function loadData() {
    if (cachedData) {
        return cachedData;
    }
    
    try {
        console.log('Загрузка данных из database.json...');
        const response = await fetch(DATA_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cachedData = data;
        console.log('Данные успешно загружены:', data);
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Возвращаем пустые данные в случае ошибки
        return { tutors: [], subjects: [], skillsBySubject: {}, courses: [], courseCategories: [] };
    }
}

async function fetchCourses() {
    const data = await loadData();
    return data.courses || [];
}

async function fetchCourseCategories() {
    const data = await loadData();
    if (data.courseCategories && data.courseCategories.length > 0) {
        return data.courseCategories;
    }
    const courses = data.courses || [];
    const cats = [...new Set(courses.map((c) => c.category).filter(Boolean))];
    return cats.sort();
}

async function fetchCourseById(id) {
    const courses = await fetchCourses();
    return courses.find((c) => c.id === parseInt(id, 10));
}

async function fetchFavoriteCourses() {
    const courses = await fetchCourses();
    const fav = typeof getCourseFavorites === 'function' ? getCourseFavorites() : [];
    return courses.filter((c) => fav.includes(c.id));
}

async function searchCourses(filters) {
    let courses = await fetchCourses();

    if (filters.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter(
            (c) =>
                (c.title && c.title.toLowerCase().includes(q)) ||
                (c.provider && c.provider.toLowerCase().includes(q)) ||
                (c.category && c.category.toLowerCase().includes(q))
        );
    }

    if (filters.category && filters.category !== 'all') {
        courses = courses.filter((c) => c.category === filters.category);
    }

    if (filters.minPrice) {
        courses = courses.filter((c) => c.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
        courses = courses.filter((c) => c.price <= filters.maxPrice);
    }

    if (filters.minRating) {
        courses = courses.filter((c) => c.rating >= filters.minRating);
    }

    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'priceAsc':
                courses.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                courses.sort((a, b) => b.price - a.price);
                break;
            case 'ratingDesc':
                courses.sort((a, b) => b.rating - a.rating);
                break;
        }
    }

    return courses;
}

// Навыки по предмету из database.json (skillsBySubject)
async function getSkillsForSubject(subject) {
    const data = await loadData();
    const map = data.skillsBySubject || {};
    const list = map[subject];
    return Array.isArray(list) ? list : [];
}

// Получить всех репетиторов
async function fetchTutors() {
    const data = await loadData();
    return data.tutors || [];
}

// Получить список предметов
async function fetchSubjects() {
    const data = await loadData();
    // Если в JSON есть subjects, используем их, иначе извлекаем из репетиторов
    if (data.subjects && data.subjects.length > 0) {
        return data.subjects;
    }
    const tutors = data.tutors || [];
    const subjects = [...new Set(tutors.map(tutor => tutor.subject))];
    return subjects.sort();
}

// Получить репетитора по ID
async function fetchTutorById(id) {
    const tutors = await fetchTutors();
    return tutors.find(tutor => tutor.id === parseInt(id));
}

// Получить избранных репетиторов (с учетом favorites из localStorage)
async function fetchFavoriteTutors() {
    const tutors = await fetchTutors();
    const favorites = getFavorites();
    return tutors.filter(tutor => favorites.includes(tutor.id));
}

// Поиск репетиторов с фильтрацией
async function searchTutors(filters) {
    let tutors = await fetchTutors();
    
    // Поиск по имени и предмету
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        tutors = tutors.filter(tutor => 
            tutor.name.toLowerCase().includes(searchLower) ||
            tutor.subject.toLowerCase().includes(searchLower)
        );
    }
    
    // Фильтр по предмету
    if (filters.subject && filters.subject !== 'all') {
        tutors = tutors.filter(tutor => tutor.subject === filters.subject);
    }
    
    // Фильтр по цене
    if (filters.minPrice) {
        tutors = tutors.filter(tutor => tutor.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
        tutors = tutors.filter(tutor => tutor.price <= filters.maxPrice);
    }
    
    // Фильтр по рейтингу
    if (filters.minRating) {
        tutors = tutors.filter(tutor => tutor.rating >= filters.minRating);
    }
    
    // Сортировка
    if (filters.sortBy) {
        switch(filters.sortBy) {
            case 'priceAsc':
                tutors.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                tutors.sort((a, b) => b.price - a.price);
                break;
            case 'ratingDesc':
                tutors.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
    
    return tutors;
}

// Обновить данные (для будущего расширения с сервером)
async function updateTutor(tutorId, updatedData) {
    // Здесь можно будет реализовать отправку на сервер
    console.log('Обновление данных репетитора:', tutorId, updatedData);
    // Пока просто предупреждаем, что это демо-режим
    alert('В демо-версии изменение данных недоступно. Данные хранятся в JSON файле.');
}

// Сбросить кеш (принудительная перезагрузка)
function clearCache() {
    cachedData = null;
    console.log('Кеш очищен');
}