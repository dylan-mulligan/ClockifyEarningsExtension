'use strict';

function updateMoneyValue(mutationList: MutationRecord[], observer: MutationObserver) {
  const timeElement:  Element | null = <Element | null> mutationList[0].target.parentNode;
  if(timeElement === null) return;
  const moneySpan: Element | null = <Element | null> timeElement.previousSibling;
  if(moneySpan === null) return;
  
  let value: string;

  // Get updated value
  if(timeElement instanceof HTMLInputElement) value = (timeElement as HTMLInputElement).value;
  else if(timeElement instanceof HTMLSpanElement) value = (timeElement as HTMLSpanElement).innerHTML;
  else return;

  // Set updated value
  const newValue: string = getTimeMoneyValue(value);
  if(moneySpan.innerHTML !== newValue) moneySpan.innerHTML = newValue;
}

function getTimeMoneyValue(str: string): string {
  const timeVals: string[] = str.split(":");
  const hours: number = parseInt(timeVals[0]) + parseInt(timeVals[1]) / 60 + parseInt(timeVals[2]) / 3600;
  const salary: number = 45.0;
  
  return "$" + (hours * salary).toFixed(2);
}

function init() {
    const times: HTMLCollectionOf<Element> = document.getElementsByClassName("cl-input-time-picker-sum");
    
    for (let i = 0; i < times.length; i++) {
      let value: string;
      const element = times.item(i);
      if(element === null) return;
      const parent = element.parentElement;
      if(parent === null) return;
  
      if(i === 0) value = (element as HTMLSpanElement).innerHTML
      else value = (element as HTMLInputElement).value
  
      const moneyElement = document.createElement('span') as HTMLSpanElement;
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