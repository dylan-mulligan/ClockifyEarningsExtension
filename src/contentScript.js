'use strict';
function updateMoneyValue(mutationList, observer) {
    const timeElement = mutationList[0].target.parentNode;
    if (timeElement === null)
        return;
    const moneySpan = timeElement.previousSibling;
    if (moneySpan === null)
        return;
    let value;
    // Get updated value
    if (timeElement instanceof HTMLInputElement)
        value = timeElement.value;
    else if (timeElement instanceof HTMLSpanElement)
        value = timeElement.innerHTML;
    else
        return;
    // Set updated value
    const newValue = getTimeMoneyValue(value);
    if (moneySpan.innerHTML !== newValue)
        moneySpan.innerHTML = newValue;
}
function getTimeMoneyValue(str) {
    const timeVals = str.split(":");
    const hours = parseInt(timeVals[0]) + parseInt(timeVals[1]) / 60 + parseInt(timeVals[2]) / 3600;
    const salary = 45.0;
    return "$" + (hours * salary).toFixed(2);
}
function init() {
    const times = document.getElementsByClassName("cl-input-time-picker-sum");
    for (let i = 0; i < times.length; i++) {
        let value;
        const element = times.item(i);
        if (element === null)
            return;
        const parent = element.parentElement;
        if (parent === null)
            return;
        if (i === 0)
            value = element.innerHTML;
        else
            value = element.value;
        const moneyElement = document.createElement('span');
        moneyElement.innerHTML = getTimeMoneyValue(value);
        moneyElement.id = 'money-span-' + i;
        // TODO: Position moneyElement centered
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(updateMoneyValue);
        observer.observe(parent, {
            subtree: true,
            characterData: true
        });
        parent.prepend(moneyElement);
    }
}
document.addEventListener('DOMContentLoaded', init);
// Wait for post-load page modification before getting elements
setTimeout(init, 2000);
