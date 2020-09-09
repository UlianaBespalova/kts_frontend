export function countPercentRatio(total, part, precision=1) {
    let res = (part/total)*100;
    return res ? res.toFixed(precision) : 0;
}
