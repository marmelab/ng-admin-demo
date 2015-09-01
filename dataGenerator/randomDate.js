export default function(chance) {
    return function randomDate(minDate, maxDate) {
        var minTs = minDate instanceof Date ? minDate.getTime() : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
        var maxTs = maxDate instanceof Date ? maxDate.getTime() : Date.now();
        var range = maxTs - minTs;
        var ts = chance.natural({ max: range });
        // move it more towards today to account for traffic increase
        ts = Math.sqrt(ts/(range))*(range);
        return new Date(minTs + ts);
    }
}
