/*
    © 2021 Firetheme.com
*/

// Collection "Filter by"
document.querySelector('#filter-by')?.addEventListener('change', (e) => {
    const params = window.location.href.split('?')[1]
    if (params) {
        window.location.href = `${e.target.value}?${params}`
    } else {
        window.location.href = e.target.value
    }
})

// Collection "Sort by"
document.querySelector('#sort-by')?.addEventListener('change', (e) => {
    window.location.href = window.location.href.split('?')[0] + `?sort_by=${e.target.value}`
})