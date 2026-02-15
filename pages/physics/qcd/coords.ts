// Метод Ньютона для решения уравнения: 2θ + sin(2θ) = π·sin(φ)
function solveTheta(phi: number) {
    const target = Math.PI * Math.sin(phi);
    let theta = phi; // начальное приближение
    let iter = 0;
    const maxIter = 50;
    const tolerance = 1e-10;

    while (iter < maxIter) {
        const f = 2 * theta + Math.sin(2 * theta) - target;
        const df = 2 + 2 * Math.cos(2 * theta); // производная
        if (Math.abs(f) < tolerance) break;
        theta -= f / df;
        iter++;
    }
    return theta;
}

/**
 * Проекция Мольвейде: переводит сферические координаты (широта, долгота в радианах) в (x, y) на плоскости.
 * @param {number} latRad - широта в радианах (от -π/2 до π/2)
 * @param {number} lonRad - долгота в радианах (от -π до π)
 * @param {number} R - радиус сферы в единицах вывода (например, пиксели)
 * @param {number} centerLonRad - центральный меридиан проекции в радианах (по умолчанию 0)
 * @returns {Object} { x, y } - координаты на плоскости
 */
function molweideProjectionRadians(latRad: number, lonRad: number, R: number, centerLonRad = 0) {
    const theta = solveTheta(latRad);

    // Разность долгот (приводим к диапазону [-π, π])
    let deltaLon = lonRad - centerLonRad;
    if (deltaLon > Math.PI) deltaLon -= 2 * Math.PI;
    if (deltaLon < -Math.PI) deltaLon += 2 * Math.PI;

    // Вычисляем x и y по формулам проекции Мольвейде
    const x = R * (2 * Math.sqrt(2) / Math.PI) * deltaLon * Math.cos(theta);
    const y = R * Math.sqrt(2) * Math.sin(theta);

    return { x, y };
}
